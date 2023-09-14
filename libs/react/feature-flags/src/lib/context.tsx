import React, { FC, createContext, useContext, useMemo } from 'react'
import * as ConfigCatJS from 'configcat-js'
import {
  FeatureFlagClient,
  FeatureFlagUser,
  SettingValue,
  SettingTypeOf,
  createClientFactory,
} from '@island.is/feature-flags'
import { useAuth } from '@island.is/auth/react'

const createClient = createClientFactory(ConfigCatJS)

const FeatureFlagContext = createContext<FeatureFlagClient>({
  getValue: <T extends SettingValue>(_: string, defaultValue: T) =>
    Promise.resolve(defaultValue as SettingTypeOf<T>),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispose() {},
})

export interface FeatureFlagContextProviderProps {
  sdkKey: string
  defaultUser?: FeatureFlagUser
}

export const FeatureFlagProvider: FC<
  React.PropsWithChildren<FeatureFlagContextProviderProps>
> = ({ children, sdkKey, defaultUser: userProp }) => {
  const { userInfo } = useAuth()
  const featureFlagClient = useMemo(() => {
    return createClient({ sdkKey })
  }, [sdkKey])

  const context = useMemo<FeatureFlagClient>(() => {
    const userAuth =
      userInfo && userInfo.profile.nationalId !== undefined
        ? {
            id: userInfo.profile.nationalId,
            attributes: {
              nationalId: userInfo.profile.nationalId,
              subjectType: userInfo.profile.subjectType,
            },
          }
        : undefined
    const defaultUser = userProp ?? userAuth

    return {
      getValue<T extends SettingValue>(
        key: string,
        defaultValue: T,
        user: FeatureFlagUser | undefined = defaultUser,
      ) {
        return featureFlagClient.getValue(key, defaultValue, user)
      },
      dispose: () => featureFlagClient.dispose(),
    }
  }, [featureFlagClient, userInfo, userProp])

  return (
    <FeatureFlagContext.Provider value={context}>
      {children}
    </FeatureFlagContext.Provider>
  )
}

type FeatureFlagRecord = Record<string, boolean | string>

export interface MockedFeatureFlagProviderProps {
  flags: string[] | FeatureFlagRecord
}

export const MockedFeatureFlagProvider: FC<
  React.PropsWithChildren<MockedFeatureFlagProviderProps>
> = ({ flags, children }) => {
  const context = useMemo<FeatureFlagClient>(() => {
    const cleanFlags = Array.isArray(flags)
      ? flags.reduce<FeatureFlagRecord>((obj, flag) => {
          obj[flag] = true
          return obj
        }, {})
      : flags
    return {
      getValue: async function <T extends SettingValue>(
        key: string,
        defaultValue: T,
      ) {
        return (cleanFlags[key] ?? defaultValue) as SettingTypeOf<T>
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      dispose() {},
    }
  }, [flags])

  return (
    <FeatureFlagContext.Provider value={context}>
      {children}
    </FeatureFlagContext.Provider>
  )
}

export const useFeatureFlagClient = () => {
  return useContext(FeatureFlagContext)
}
