import { FeatureFlagClient } from '@island.is/feature-flags'

export enum MarriageConditionsFeatureFlags {
  ALLOW_FAKE = 'isallowfakedatainmarriageconditionsenabled',
}

export const getApplicationFeatureFlags = async (
  client: FeatureFlagClient,
): Promise<Record<MarriageConditionsFeatureFlags, boolean>> => {
  const featureFlags: MarriageConditionsFeatureFlags[] = [
    MarriageConditionsFeatureFlags.ALLOW_FAKE,
  ]

  return (
    await Promise.all(
      featureFlags.map(async (key: MarriageConditionsFeatureFlags) => {
        return { key, value: !!(await client.getValue(key, false)) }
      }),
    )
  ).reduce(
    (
      acc,
      { key, value }: { key: MarriageConditionsFeatureFlags; value: boolean },
    ) => {
      return {
        ...acc,
        [key]: value,
      }
    },
    {} as Record<MarriageConditionsFeatureFlags, boolean>,
  )
}
