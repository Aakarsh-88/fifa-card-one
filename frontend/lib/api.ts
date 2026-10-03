export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface HealthCheckResponse {
  status: string;
  service?: string;
  version?: string;
  timestamp?: string;
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
