// Safety cap for app-lock suppression during external auth flows.
export const LOCK_SCREEN_SUPPRESS_MAX_MS = 15 * 60 * 1000

/**
 * How long the app can be away before it has to be unlocked again. A local
 * development build can shorten it with EXPO_PUBLIC_APP_LOCK_TIMEOUT_MS in
 * apps/native/app/.env.local, which git ignores.
 */
export const APP_LOCK_TIMEOUT_MS =
  (__DEV__ && Number(process.env.EXPO_PUBLIC_APP_LOCK_TIMEOUT_MS)) ||
  5 * 60 * 1000
