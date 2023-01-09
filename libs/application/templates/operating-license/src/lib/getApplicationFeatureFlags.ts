import { FeatureFlagClient } from '@island.is/feature-flags'

export enum OperatingLicenseFeatureFlags {
  ALLOW_FAKE = 'isAllowFakeDataInOperatingLicenseEnabled',
}

export const getApplicationFeatureFlags = async (
  client: FeatureFlagClient,
): Promise<Record<OperatingLicenseFeatureFlags, boolean>> => {
  const featureFlags: OperatingLicenseFeatureFlags[] = [
    OperatingLicenseFeatureFlags.ALLOW_FAKE,
  ]

  return (
    await Promise.all(
      featureFlags.map(async (key: OperatingLicenseFeatureFlags) => {
        return { key, value: !!(await client.getValue(key, false)) }
      }),
    )
  ).reduce(
    (
      acc,
      { key, value }: { key: OperatingLicenseFeatureFlags; value: boolean },
    ) => {
      return {
        ...acc,
        [key]: value,
      }
    },
    {} as Record<OperatingLicenseFeatureFlags, boolean>,
  )
}
