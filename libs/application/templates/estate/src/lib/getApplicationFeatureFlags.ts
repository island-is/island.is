import { FeatureFlagClient } from '@island.is/feature-flags'

export enum EstateFeatureFlags {
  ALLOW_DIVISION_OF_ESTATE = 'isDivisionOfEstateEnabled',
  ALLOW_ESTATE_WITHOUT_ASSETS = 'isEstateWithoutAssetsEnabled',
  ALLOW_PERMIT_TO_POSTPONE_ESTATE_DIVISION = 'isPermitToPostponeEstateDivisionEnabled',
  ALLOW_DIVISION_OF_ESTATE_BY_HEIRS = 'isDivisionOfEstateByHeirsEnabled',
  ALLOW_ESTATE_PAYMENT = 'isEstatePaymentEnabled',
}

export const getApplicationFeatureFlags = async (
  client: FeatureFlagClient,
): Promise<Record<EstateFeatureFlags, boolean>> => {
  const featureFlags: EstateFeatureFlags[] = [
    EstateFeatureFlags.ALLOW_DIVISION_OF_ESTATE,
    EstateFeatureFlags.ALLOW_ESTATE_WITHOUT_ASSETS,
    EstateFeatureFlags.ALLOW_PERMIT_TO_POSTPONE_ESTATE_DIVISION,
    EstateFeatureFlags.ALLOW_DIVISION_OF_ESTATE_BY_HEIRS,
    EstateFeatureFlags.ALLOW_ESTATE_PAYMENT,
  ]

  return (
    await Promise.all(
      featureFlags.map(async (key: EstateFeatureFlags) => {
        return { key, value: !!(await client.getValue(key, false)) }
      }),
    )
  ).reduce((acc, { key, value }) => {
    return {
      ...acc,
      [key]: value,
    }
  }, {} as Record<EstateFeatureFlags, boolean>)
}
