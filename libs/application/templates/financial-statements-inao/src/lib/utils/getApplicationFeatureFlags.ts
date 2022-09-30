import { FeatureFlagClient } from '@island.is/feature-flags'

export enum FinancialStatementInaoFeatureFlags {
  ALLOW_FAKE = 'financialStatementInaoAllowfakedata',
}

export const getApplicationFeatureFlags = async (
  client: FeatureFlagClient,
): Promise<Record<FinancialStatementInaoFeatureFlags, boolean>> => {
  const featureFlags: FinancialStatementInaoFeatureFlags[] = [
    FinancialStatementInaoFeatureFlags.ALLOW_FAKE,
  ]

  return (
    await Promise.all(
      featureFlags.map(async (key: FinancialStatementInaoFeatureFlags) => {
        return { key, value: !!(await client.getValue(key, false)) }
      }),
    )
  ).reduce(
    (
      acc,
      {
        key,
        value,
      }: { key: FinancialStatementInaoFeatureFlags; value: boolean },
    ) => {
      return {
        ...acc,
        [key]: value,
      }
    },
    {} as Record<FinancialStatementInaoFeatureFlags, boolean>,
  )
}
