import { useEffect, useState } from 'react'

import { useFeatureFlagClient } from './context'
import { User } from './types'

export interface FeatureFlagHookValue {
  value: boolean | string
  loading: boolean
}

export const useFeatureFlag = (
  featureFlag: string,
  defaultValue: boolean | string,
  user?: User,
): FeatureFlagHookValue => {
  const featureFlagClient = useFeatureFlagClient()
  const [state, setState] = useState<FeatureFlagHookValue>({
    value: defaultValue,
    loading: true,
  })

  useEffect(() => {
    featureFlagClient
      .getValue(featureFlag, defaultValue, user)
      .then((value) => {
        setState({ value, loading: false })
      })
  }, [featureFlagClient, setState])

  return state
}
