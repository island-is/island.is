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

  const results = await Promise.all(
    featureFlags.map(async (key: MortgageCertificateFeatureFlags) => {
      return { key, value: !!(await client.getValue(key, false)) }
    }),
  )
  return results.reduce((acc, { key, value }) => {
    acc[key] = value
    return acc
  }, {} as Record<MortgageCertificateFeatureFlags, boolean>)
}
