import { createClient } from '@island.is/feature-flags'

export const getFeatureFlag = async (
  flag: string,
  defaultValue: boolean | string,
) => {
  const client = createClient()
  const value = await client.getValue(flag, defaultValue)
  client.dispose()
  return value
}
