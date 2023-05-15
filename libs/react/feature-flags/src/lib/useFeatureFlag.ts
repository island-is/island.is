import { useEffect, useState } from 'react'
import {
  FeatureFlagUser,
  SettingValue,
  SettingTypeOf,
} from '@island.is/feature-flags'

import { useFeatureFlagClient } from './context'

export interface FeatureFlagHookValue<T extends SettingValue> {
  value: SettingTypeOf<T>
  loading: boolean
}

/**
 * Hook to get a feature flag.
 */
export const useFeatureFlag = <T extends SettingValue>(
  featureFlag: string,
  defaultValue: T,
  user?: FeatureFlagUser,
): FeatureFlagHookValue<T> => {
  const featureFlagClient = useFeatureFlagClient()
  const [state, setState] = useState<FeatureFlagHookValue<T>>({
    value: defaultValue as SettingTypeOf<T>,
    loading: true,
  })

  useEffect(() => {
    let mounted = true
    featureFlagClient
      .getValue(featureFlag, defaultValue, user)
      .then((value) => {
        if (mounted) {
          setState({ value, loading: false })
        }
      })
    return () => {
      mounted = false
    }
  }, [featureFlagClient, setState])

  return state
}
