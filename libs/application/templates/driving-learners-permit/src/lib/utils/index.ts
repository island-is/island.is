import { getValueViaPath, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { FeatureFlagClient } from '@island.is/feature-flags'

export const allowFakeCondition =
  (result = YES) =>
  (answers: FormValue) =>
    getValueViaPath(answers, 'fakeData.useFakeData') === result

export const truthyFeatureFromClient = async (
  featureFlagClient: FeatureFlagClient,
  key: string,
): Promise<boolean> => {
  return !!(await featureFlagClient.getValue(key, false))
}
