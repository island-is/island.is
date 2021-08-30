import { useEffect, useState } from 'react'

import { useFeatureFlagClient } from './context'
import { User } from './types'

export interface FeatureFlagHookValue<T> {
  value: T
  loading: boolean
}

export const useFeatureFlag = <T extends boolean | string>(
  featureFlag: string,
  defaultValue: T,
  user?: User,
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
      .then((value: T) => {
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
