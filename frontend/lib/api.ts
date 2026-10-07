import { PlayerStats, Position } from '@/types/player';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface HealthCheckResponse {
  status: string;
  service?: string;
  version?: string;
  timestamp?: string;
}

export interface PredictResponse {
  overall: number;
  feature_importance: Record<string, number>;
  model: string;
}

export async function predictPlayerRating(
  stats: PlayerStats,
  position: Position,
  signal?: AbortSignal
): Promise<PredictResponse> {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...stats,
      position,
    }),
    signal,
    cache: 'no-store',
  });

  const data: PredictResponse | { detail?: string | Array<{ msg?: string }> } =
    await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail = 'detail' in data ? data.detail : undefined;
    const message = Array.isArray(detail)
      ? detail.map((item) => item.msg).filter(Boolean).join(', ')
      : detail;
    throw new Error(message || `Prediction failed (HTTP ${response.status})`);
  }

  if (
    !('overall' in data) ||
    typeof data.overall !== 'number' ||
    !Number.isInteger(data.overall) ||
    data.overall < 1 ||
    data.overall > 99
  ) {
    throw new Error('The prediction API returned an invalid overall rating.');
  }

  return data as PredictResponse;
}

export async function checkBackendHealth(): Promise<{
  isOnline: boolean;
  data?: HealthCheckResponse;
  latencyMs?: number;
  error?: string;
}> {
  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      return {
        isOnline: false,
        latencyMs,
        error: `HTTP Error ${response.status}`,
      };
    }

    const data: HealthCheckResponse = await response.json();
    return {
      isOnline: true,
      data,
      latencyMs,
    };
  } catch (err: unknown) {
    const latencyMs = Date.now() - startTime;
    const errorMessage =
      err instanceof Error ? err.message : 'Connection failed';
    return {
      isOnline: false,
      latencyMs,
      error: errorMessage,
    };
  }
}
