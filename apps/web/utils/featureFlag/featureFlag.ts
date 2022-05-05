import {
  createClient,
  FeatureFlagUser,
  FeatureFlagClient,
} from '@island.is/feature-flags'
import getConfig from 'next/config'

let client: FeatureFlagClient | undefined

/**
 * Returns a feature flag from ConfigCat
 */
export const getFeatureFlag = async (
  flag: string,
  defaultValue: boolean,
  user?: FeatureFlagUser,
) => {
  if (!client) {
    const config = getConfig()
    client = createClient({
      sdkKey: config?.publicRuntimeConfig.configCatSdkKey,
    })
  }
  const value = await client.getValue(flag, defaultValue, user)
  return value as boolean
}
