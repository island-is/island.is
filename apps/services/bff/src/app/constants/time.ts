export const FIVE_SECONDS_IN_MS = 5000

export const ONE_HOUR_IN_MS = 3600000

// Time-to-live (TTL) for caching the user profile, in milliseconds.
// We subtract 5 seconds from the TTL to handle latency and clock drift.
export const DEFAULT_CACHE_USER_PROFILE_TTL_MS =
  ONE_HOUR_IN_MS - FIVE_SECONDS_IN_MS
