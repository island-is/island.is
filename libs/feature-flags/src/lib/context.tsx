import React, { FC, createContext, useState } from 'react'
import { createClient } from './feature-flags'
import { FeatureFlagClient } from './types'

export interface FeatureFlagContextProps {
  featureFlagClient?: FeatureFlagClient
  setFeatureFlagClient: (client: FeatureFlagClient) => void
}

export const FeatureFlagContext = createContext<FeatureFlagContextProps>({
  featureFlagClient: undefined,
  setFeatureFlagClient: () => null,
})

export interface FeatureFlagContextProviderProps {
  sdkKey?: string
}

export const FeatureFlagContextProvider: FC<FeatureFlagContextProviderProps> = ({
  children,
  sdkKey,
}) => {
  const [state, setState] = useState({
    featureFlagClient: createClient({ sdkKey }),
    setFeatureFlagClient: (featureFlagClient: FeatureFlagClient) => {
      setState({ ...state, featureFlagClient })
    },
  })

  return (
    <FeatureFlagContext.Provider value={state}>
      {children}
    </FeatureFlagContext.Provider>
  )
}

export default FeatureFlagContext
