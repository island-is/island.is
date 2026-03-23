import { FeatureFlagClient } from '@island.is/feature-flags'

export enum DrivingLicenseDuplicateFeatureFlags {
  ALLOW_FAKE = 'applicationTemplateDrivingLicenseDuplicateAllowFakeData',
  ALLOW_THJODSKRA_PHOTOS = 'applicationTemplateDrivingLicenseDuplicateAllowThjodskraPhotos',
}

export const getApplicationFeatureFlags = async (
  client: FeatureFlagClient,
): Promise<Record<DrivingLicenseDuplicateFeatureFlags, boolean>> => {
  const featureFlags: DrivingLicenseDuplicateFeatureFlags[] = [
    DrivingLicenseDuplicateFeatureFlags.ALLOW_FAKE,
    DrivingLicenseDuplicateFeatureFlags.ALLOW_THJODSKRA_PHOTOS,
  ]

  return (
    await Promise.all(
      featureFlags.map(async (key: DrivingLicenseDuplicateFeatureFlags) => {
        return { key, value: !!(await client.getValue(key, false)) }
      }),
    )
  ).reduce(
    (
      acc,
      {
        key,
        value,
      }: { key: DrivingLicenseDuplicateFeatureFlags; value: boolean },
    ) => {
      return {
        ...acc,
        [key]: value,
      }
    },
    {} as Record<DrivingLicenseDuplicateFeatureFlags, boolean>,
  )
}
