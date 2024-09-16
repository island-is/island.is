import { FeatureFlagClient } from '@island.is/feature-flags'

export enum InheritanceReportFeatureFlags {
  AllowEstateApplication = 'isInheritanceReportApplicationEnabled',
  AllowPrepaidApplication = 'isInheritanceReportPrepaidApplicationEnabled',
}

export const getApplicationFeatureFlags = async (
  client: FeatureFlagClient,
): Promise<Record<InheritanceReportFeatureFlags, boolean>> => {
  const featureFlags: InheritanceReportFeatureFlags[] = [
    InheritanceReportFeatureFlags.AllowEstateApplication,
    InheritanceReportFeatureFlags.AllowPrepaidApplication,
  ]

  return (
    await Promise.all(
      featureFlags.map(async (key: InheritanceReportFeatureFlags) => {
        return { key, value: !!(await client.getValue(key, false)) }
      }),
    )
  ).reduce(
    (
      acc,
      { key, value }: { key: InheritanceReportFeatureFlags; value: boolean },
    ) => {
      return {
        ...acc,
        [key]: value,
      }
    },
    {} as Record<InheritanceReportFeatureFlags, boolean>,
  )
}
