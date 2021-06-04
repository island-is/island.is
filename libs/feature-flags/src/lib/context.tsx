import React, { FC, createContext, useContext, useMemo } from 'react'
import { createClient } from './feature-flags'
import { FeatureFlagClient, User } from './types'
import { useAuth } from '@island.is/auth/react'

const FeatureFlagContext = createContext<FeatureFlagClient>({
  getValue: (_, defaultValue) => Promise.resolve(defaultValue),
})

export interface FeatureFlagContextProviderProps {
  sdkKey: string
  defaultUser?: User
}

export const FeatureFlagProvider: FC<FeatureFlagContextProviderProps> = ({
  children,
  sdkKey,
  defaultUser: userProp,
}) => {
  const { userInfo } = useAuth()
  const featureFlagClient = useMemo(() => {
    return createClient({ sdkKey })
  }, [sdkKey])

  const context = useMemo<FeatureFlagClient>(() => {
    const userAuth =
      userInfo && userInfo.profile.sid !== undefined
        ? {
            id: userInfo.profile.sid,
            attributes: {
              nationalId: userInfo.profile.nationalId as string,
            },
          }
        : undefined
    const defaultUser = userProp ?? userAuth

    return {
      getValue(
        key: string,
        defaultValue: boolean | string,
        user: User | undefined = defaultUser,
      ) {
        return featureFlagClient.getValue(key, defaultValue, user)
      },
    }
  }, [featureFlagClient, userInfo, userProp])

  return (
    <FeatureFlagContext.Provider value={context}>
      {children}
    </FeatureFlagContext.Provider>
  )
}

export const useFeatureFlagClient = () => {
  return useContext(FeatureFlagContext)
}
