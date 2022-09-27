import { FeatureFlagClient } from '@island.is/feature-flags'

export enum MarriageCondtionsFeatureFlags {
  ALLOW_FAKE = 'isallowfakedatainmarriageconditionsenabled',
}

export const getApplicationFeatureFlags = async (
  client: FeatureFlagClient,
): Promise<Record<MarriageCondtionsFeatureFlags, boolean>> => {
  const featureFlags: MarriageCondtionsFeatureFlags[] = [
    MarriageCondtionsFeatureFlags.ALLOW_FAKE,
  ]

  return (
    await Promise.all(
      featureFlags.map(async (key: MarriageCondtionsFeatureFlags) => {
        return { key, value: !!(await client.getValue(key, false)) }
      }),
    )
  ).reduce(
    (
      acc,
      { key, value }: { key: MarriageCondtionsFeatureFlags; value: boolean },
    ) => {
      return {
        ...acc,
        [key]: value,
      }
    },
    {} as Record<MarriageCondtionsFeatureFlags, boolean>,
  )
}
