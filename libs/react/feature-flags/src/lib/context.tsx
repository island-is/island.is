import {
  FeatureFlagClient,
  SettingTypeOf,
  SettingValue,
} from '@island.is/feature-flags'
import { useUserInfo } from '@island.is/react-spa/bff'
import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import {
  FeatureFlagsDocument,
  FeatureFlagsQuery,
} from './FeatureFlags.generated'
import { useQuery } from '@apollo/client'

type FeatureFlagRecord = Record<string, boolean | string | number>

const EMPTY_FLAGS: FeatureFlagRecord = {}

const FeatureFlagContext = createContext<FeatureFlagClient>({
  getValue: <T extends SettingValue>(_: string, defaultValue: T) =>
    Promise.resolve(defaultValue as SettingTypeOf<T>),
  getAllValues: () => Promise.resolve(EMPTY_FLAGS),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispose() {},
})

export const FeatureFlagProvider: FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const userInfo = useUserInfo()
  const isAuthenticated = !!userInfo?.profile?.nationalId
  const { data, loading } = useQuery<FeatureFlagsQuery>(
    FeatureFlagsDocument,
    { skip: !isAuthenticated },
  )
  const flags = data?.featureFlags?.flags ?? EMPTY_FLAGS

  // Use a ref for flags so getValue always reads the latest value
  // regardless of which render's closure it was created in.
  const flagsRef = useRef<FeatureFlagRecord>(EMPTY_FLAGS)
  flagsRef.current = flags

  const readyRef = useRef<{
    resolve: () => void
    promise: Promise<void>
  } | null>(null)

  if (isAuthenticated && loading && !readyRef.current) {
    let resolve: () => void
    const promise = new Promise<void>((r) => {
      resolve = r
    })
    readyRef.current = { resolve: resolve!, promise }
  }

  useEffect(() => {
    if ((!loading || !isAuthenticated) && readyRef.current) {
      readyRef.current.resolve()
      readyRef.current = null
    }
  }, [loading, isAuthenticated])

  const contextRef = useRef<FeatureFlagClient>({
    getValue: async <T extends SettingValue>(key: string, defaultValue: T) => {
      if (readyRef.current) {
        await readyRef.current.promise
      }
      return (flagsRef.current[key] ?? defaultValue) as SettingTypeOf<T>
    },
    getAllValues: async () => {
      if (readyRef.current) {
        await readyRef.current.promise
      }
      return flagsRef.current
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    dispose() {},
  })

  return (
    <FeatureFlagContext.Provider value={contextRef.current}>
      {children}
    </FeatureFlagContext.Provider>
  )
}

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
      getAllValues: async () => cleanFlags as FeatureFlagRecord,
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
