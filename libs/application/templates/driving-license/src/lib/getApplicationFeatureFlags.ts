import { FeatureFlagClient } from '@island.is/feature-flags'

export enum DrivingLicenseFeatureFlags {
  ALLOW_FAKE = 'applicationTemplateDrivingLicenseAllowFakeData',
  ALLOW_LICENSE_SELECTION = 'applicationTemplateDrivingLicenseAllowLicenseSelection',
  ALLOW_BE_LICENSE = 'isBEApplicationEnabled',
  ALLOW_65_RENEWAL = 'is65RenewalApplicationEnabled',
}

export const getApplicationFeatureFlags = async (
  client: FeatureFlagClient,
): Promise<Record<DrivingLicenseFeatureFlags, boolean>> => {
  const featureFlags: DrivingLicenseFeatureFlags[] = [
    DrivingLicenseFeatureFlags.ALLOW_FAKE,
    DrivingLicenseFeatureFlags.ALLOW_LICENSE_SELECTION,
    DrivingLicenseFeatureFlags.ALLOW_BE_LICENSE,
    DrivingLicenseFeatureFlags.ALLOW_65_RENEWAL,
  ]

  return (
    await Promise.all(
      featureFlags.map(async (key: DrivingLicenseFeatureFlags) => {
        return { key, value: !!(await client.getValue(key, false)) }
      }),
    )
  ).reduce(
    (
      acc,
      { key, value }: { key: DrivingLicenseFeatureFlags; value: boolean },
    ) => {
      return {
        ...acc,
        [key]: value,
      }
    },
    {} as Record<DrivingLicenseFeatureFlags, boolean>,
  )
}
