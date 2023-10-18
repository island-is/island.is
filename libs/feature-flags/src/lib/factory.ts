import { createFeatureFlagClient } from './configcat'
import {
  FeatureFlagClient,
  FeatureFlagClientProps,
  ConfigCatModule,
} from './types'

export const clientCache = new Map<string, FeatureFlagClient>()

const createCacheKey = (config?: FeatureFlagClientProps): string => {
  return config?.sdkKey || process.env.CONFIGCAT_SDK_KEY || ''
}

export const createClientFactory = (moduleProvider: ConfigCatModule) => {
  return (config?: FeatureFlagClientProps): FeatureFlagClient => {
    const key = createCacheKey(config)
    if (!clientCache.has(key)) {
      const client = createFeatureFlagClient(config ?? {}, moduleProvider)
      clientCache.set(key, client)
    }
    const cachedClient = clientCache.get(key)
    if (!cachedClient) {
      throw new Error('Failed to retrieve cached client.')
    }
    return cachedClient
  }
}
