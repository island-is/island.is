import { createClient, FeatureFlagUser } from '@island.is/feature-flags'

export const getFeatureFlag = async (
  flag: string,
  defaultValue: boolean | string,
  user?: FeatureFlagUser,
) => {
  const client = createClient()
  const value = await client.getValue(flag, defaultValue, user)
  client.dispose()
  return value
}
