import { FeatureFlagClient } from '@island.is/feature-flags'

export async function truthyFeatureFromClient(
  featureFlagClient: FeatureFlagClient,
  key: string,
): Promise<boolean> {
  return !!(await featureFlagClient.getValue(key, false))
}
