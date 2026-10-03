'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { checkBackendHealth } from '@/lib/api';
import { Activity, RefreshCw } from 'lucide-react';

export default function StatusPill() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [latency, setLatency] = useState<number | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const performCheck = useCallback(async () => {
    setIsRefreshing(true);
    const result = await checkBackendHealth();
    setStatus(result.isOnline ? 'online' : 'offline');
    setLatency(result.latencyMs ?? null);
    setLastChecked(new Date());
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    performCheck();
    // Poll every 30 seconds
    const interval = setInterval(performCheck, 30000);
    return () => clearInterval(interval);
  }, [performCheck]);

  return (
    <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 shadow-inner backdrop-blur-md text-xs font-mono">
      <div className="relative flex items-center justify-center">
        {status === 'online' && (
          <>
            <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          </>
        )}
        {status === 'checking' && (
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400 animate-pulse" />
        )}
        {status === 'offline' && (
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
        )}
      </div>

      <div className="flex items-center gap-1.5 text-slate-300">
        <span className="text-[11px] font-medium text-slate-400">API:</span>
        <span
          className={`font-semibold capitalize ${
            status === 'online'
              ? 'text-emerald-400'
              : status === 'checking'
              ? 'text-amber-400'
              : 'text-rose-400'
          }`}
        >
          {status}
        </span>
        {latency !== null && status === 'online' && (
          <span className="text-[10px] text-slate-500">({latency}ms)</span>
        )}
      </div>

      <button
        onClick={performCheck}
        disabled={isRefreshing}
        title={`Click to recheck health (Last: ${lastChecked ? lastChecked.toLocaleTimeString() : 'never'})`}
        className="text-slate-500 hover:text-slate-300 transition-colors p-0.5 rounded focus:outline-none"
        aria-label="Refresh API Status"
      >
        <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-slate-300' : ''}`} />
      </button>
    </div>
  );
}
