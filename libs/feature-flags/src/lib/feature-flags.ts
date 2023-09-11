import { Client } from './configcat'
import { FeatureFlagClient, FeatureFlagClientProps } from './types'

const clientCache = new Map<string, Promise<FeatureFlagClient>>()

const createCacheKey = (config?: FeatureFlagClientProps): string => {
  return JSON.stringify(config)
}

export const createClient = async (
  config?: FeatureFlagClientProps,
): Promise<FeatureFlagClient> => {
  const key = createCacheKey(config)
  if (!clientCache.has(key)) {
    clientCache.set(key, Client.create(config ?? {}))
  }

  const client = clientCache.get(key)
  if (!client) {
    throw new Error('Failed to retrieve cached client.')
  }

  return client
}
