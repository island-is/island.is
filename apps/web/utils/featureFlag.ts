import {
  createClient,
  FeatureFlagUser,
  FeatureFlagClient,
} from '@island.is/feature-flags'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()
let client: FeatureFlagClient | null

export const getFeatureFlag = async (
  flag: string,
  defaultValue: boolean | string,
  user?: FeatureFlagUser,
) => {
  if (!client) {
    client = createClient({
      sdkKey: publicRuntimeConfig.configCatSdkKey,
    })
  }
  const value = await client.getValue(flag, defaultValue, user)
  return value
}
