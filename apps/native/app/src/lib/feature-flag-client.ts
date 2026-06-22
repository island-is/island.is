type FeatureFlagRecord = Record<string, boolean | string | number>

let flagCache: FeatureFlagRecord = {}

export function setFeatureFlagCache(flags: FeatureFlagRecord) {
  flagCache = flags
}

export function getFeatureFlagValue<T extends boolean | string | number>(
  key: string,
  defaultValue: T,
): T {
  const cached = flagCache[key]
  if (typeof cached === typeof defaultValue) {
    return cached as T
  }
  return defaultValue
}
