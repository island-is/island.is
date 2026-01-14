import AsyncStorage from '@react-native-async-storage/async-storage'
import * as configcat from 'configcat-js'
import React, {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { environments } from '../config'
import { useAuthStore } from '../stores/auth-store'
import { useEnvironmentStore } from '../stores/environment-store'
import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'

interface FeatureFlagUser {
  identifier: string
  custom: { [key: string]: string }
}

export interface FeatureFlagClient {
  getValue(
    key: string,
    defaultValue: boolean | string,
    user?: FeatureFlagUser,
  ): Promise<boolean | string>

  dispose(): void
}

const FeatureFlagContext = createContext<FeatureFlagClient>({
  getValue: (_, defaultValue) => Promise.resolve(defaultValue),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispose() {},
})

export interface FeatureFlagContextProviderProps {
  children: ReactNode
  defaultUser?: FeatureFlagUser
}

class ConfigCatAsyncStorageCache {
  set(key: string, config: string) {
    return AsyncStorage.setItem(key, config)
  }
  async get(key: string) {
    const item = await AsyncStorage.getItem(key)
    if (item) {
      try {
        return item
      } catch (err) {
        // noop
      }
    }
    return null
  }
}

// Temporary way to get feature flag values in logout function.
// Consider removing when not needed anymore.
export let featureFlagClient: configcat.IConfigCatClient | null = null

export const FeatureFlagProvider: FC<
  React.PropsWithChildren<FeatureFlagContextProviderProps>
> = ({ children }) => {
  const { userInfo } = useAuthStore()
  const [time, setTime] = useState(Date.now())
  const { environment = environments.prod } = useEnvironmentStore()

  const client = useMemo(() => {
    return configcat.getClient(
      environment.configCat ?? '',
      configcat.PollingMode.AutoPoll,
      {
        dataGovernance: configcat.DataGovernance.EuOnly,
        cache: new ConfigCatAsyncStorageCache(),
        logger: configcat.createConsoleLogger(configcat.LogLevel.Off),
      },
    )
  }, [environment])
  featureFlagClient = client

  useEffect(() => {
    const listener = () => setTime(Date.now())
    client.addListener('configChanged', listener)

    return () => {
      client.removeListener('configChanged', listener)
    }
  }, [client])

  const context = useMemo<FeatureFlagClient>(() => {
    const appVersion = DeviceInfo.getVersion() ?? ''
    // Convert OS to lowercase to match the feature flag key
    const os = Platform.OS.toLowerCase()

    const userAuth =
      userInfo && userInfo.nationalId
        ? {
            identifier: userInfo.nationalId,
            custom: {
              nationalId: userInfo.nationalId,
              name: userInfo.name,
              appVersion,
              os,
            },
          }
        : undefined
    return {
      getValue(
        key: string,
        defaultValue: boolean | string,
        user: FeatureFlagUser | undefined = userAuth,
      ) {
        return client.getValueAsync(key, defaultValue, user)
      },
      dispose: () => client.dispose(),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featureFlagClient, userInfo, time])

  return (
    <FeatureFlagContext.Provider value={context}>
      {children}
    </FeatureFlagContext.Provider>
  )
}

export const useFeatureFlagClient = () => {
  return useContext(FeatureFlagContext)
}

export function useFeatureFlag(key: string, defaultValue: string): string
export function useFeatureFlag(key: string, defaultValue: boolean): boolean

export function useFeatureFlag<T extends string | boolean>(
  key: string,
  defaultValue: T,
) {
  const featureFlagClient = useFeatureFlagClient()
  const [flag, setFlag] = useState<T>(defaultValue)

  useEffect(() => {
    featureFlagClient.getValue(key, defaultValue).then((result) => {
      setFlag(result as T)
    })
  }, [defaultValue, featureFlagClient, key])

  return flag
}
