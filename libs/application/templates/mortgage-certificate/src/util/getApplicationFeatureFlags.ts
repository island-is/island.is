import { FeatureFlagClient } from '@island.is/feature-flags'

export enum MortgageCertificateFeatureFlags {
  ALLOW_SHIP = 'applicationTemplateMortgageCertificateShip',
  ALLOW_VEHICLE = 'applicationTemplateMortgageCertificateVehicle',
}

export const getApplicationFeatureFlags = async (
  client: FeatureFlagClient,
): Promise<Record<MortgageCertificateFeatureFlags, boolean>> => {
  const featureFlags: MortgageCertificateFeatureFlags[] = [
    MortgageCertificateFeatureFlags.ALLOW_SHIP,
    MortgageCertificateFeatureFlags.ALLOW_VEHICLE,
  ]

  return (
    await Promise.all(
      featureFlags.map(async (key: MortgageCertificateFeatureFlags) => {
        return { key, value: !!(await client.getValue(key, false)) }
      }),
    )
  ).reduce(
    (
      acc,
      { key, value }: { key: MortgageCertificateFeatureFlags; value: boolean },
    ) => {
      return {
        ...acc,
        [key]: value,
      }
    },
    {} as Record<MortgageCertificateFeatureFlags, boolean>,
  )
}
