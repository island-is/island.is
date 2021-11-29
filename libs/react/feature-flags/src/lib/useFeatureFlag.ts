import { useEffect, useState } from 'react'
import { FeatureFlagUser } from '@island.is/feature-flags'

import { useFeatureFlagClient } from './context'

export interface FeatureFlagHookValue<T> {
  value: T
  loading: boolean
}

/**
 * Hook to get a feature flag.
 */
export const useFeatureFlag = <T extends boolean | string>(
  featureFlag: string,
  defaultValue: T,
  user?: FeatureFlagUser,
): FeatureFlagHookValue<T> => {
  const featureFlagClient = useFeatureFlagClient()
  const [state, setState] = useState<FeatureFlagHookValue<T>>({
    value: defaultValue,
    loading: true,
  })

  useEffect(() => {
    let mounted = true
    featureFlagClient
      .getValue(featureFlag, defaultValue, user)
      .then((value) => {
        if (mounted) {
          setState({ value: value as T, loading: false })
        }
      })
    return () => {
      mounted = false
    }
  }, [featureFlagClient, setState])

  return state
}
