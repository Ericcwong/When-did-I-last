import { useState, useEffect } from 'react';

/** Returns a tick counter that increments every `intervalMs` (default 60s).
 *  Components that read this value will re-render on each tick. */
export function useLiveTimer(intervalMs = 60_000): number {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return tick;
}
