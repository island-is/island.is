import { FeatureFlagClient } from '@island.is/feature-flags'

export enum DrivingLicenseFeatureFlags {
  ALLOW_FAKE = 'applicationTemplateDrivingLicenseAllowFakeData',
}

export const getApplicationFeatureFlags = async (
  client: FeatureFlagClient,
): Promise<Record<DrivingLicenseFeatureFlags, boolean>> => {
  return {
    [DrivingLicenseFeatureFlags.ALLOW_FAKE]: !!(await client.getValue(
      DrivingLicenseFeatureFlags.ALLOW_FAKE,
      false,
    )),
  }
}
