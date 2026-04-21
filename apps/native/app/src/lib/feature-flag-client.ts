type FeatureFlagRecord = Record<string, boolean | string>

// Cached feature flag values, populated by FeatureFlagProvider on mount.
let flagCache: FeatureFlagRecord = {}

export function setFeatureFlagCache(flags: FeatureFlagRecord) {
  flagCache = flags
}

export function getFeatureFlagValue<T extends boolean | string>(
  key: string,
  defaultValue: T,
): T {
  return (flagCache[key] as T) ?? defaultValue
}
