/**
 * Returns an AbortSignal that aborts once `ms` elapses. Pass it into any
 * signal-aware call to get a real cancellation (aborts the underlying
 * socket), not just a client-side give-up.
 */
export const acceptableTimeSignal = (ms: number): AbortSignal =>
  AbortSignal.timeout(ms)
