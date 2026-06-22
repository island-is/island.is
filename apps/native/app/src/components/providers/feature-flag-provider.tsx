import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Platform } from 'react-native'
import * as Application from 'expo-application'
import { gql, useQuery } from '@apollo/client'
import { useAuthStore } from '@/stores/auth-store'
import { setFeatureFlagCache } from '@/lib/feature-flag-client'

type FeatureFlagRecord = Record<string, boolean | string | number>

const FEATURE_FLAGS_QUERY = gql`
  query FeatureFlags($attributes: FeatureFlagAttributesInput) {
    featureFlags(attributes: $attributes) {
      flags
    }
  }
`

const clientAttributes = {
  appVersion: Application.nativeApplicationVersion ?? undefined,
  os: Platform.OS.toLowerCase(),
}

const EMPTY_FLAGS: FeatureFlagRecord = {}

export interface FeatureFlagClient {
  getValue(
    key: string,
    defaultValue: boolean | string | number,
  ): Promise<boolean | string | number>
}

const FeatureFlagContext = createContext<FeatureFlagClient>({
  getValue: (_, defaultValue) => Promise.resolve(defaultValue),
})

export const FeatureFlagProvider: FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const { authorizeResult } = useAuthStore()
  const isAuthenticated = !!authorizeResult
  const { data, refetch } = useQuery<{
    featureFlags: { flags: FeatureFlagRecord }
  }>(FEATURE_FLAGS_QUERY, {
    skip: !isAuthenticated,
    variables: { attributes: clientAttributes },
  })
  const flagsFromQuery = isAuthenticated
    ? data?.featureFlags?.flags
    : undefined
  const flags = flagsFromQuery ?? EMPTY_FLAGS

  // Also triggers on token refresh (~5min), which is acceptable.
  const prevAuthRef = useRef(authorizeResult)
  useEffect(() => {
    if (prevAuthRef.current !== authorizeResult) {
      prevAuthRef.current = authorizeResult
      if (authorizeResult) {
        refetch()
      } else {
        setFeatureFlagCache({})
      }
    }
  }, [authorizeResult, refetch])

  useEffect(() => {
    if (flagsFromQuery) {
      setFeatureFlagCache(flagsFromQuery)
    }
  }, [flagsFromQuery])

  const context = useMemo<FeatureFlagClient>(
    () => ({
      getValue: async (
        key: string,
        defaultValue: boolean | string | number,
      ) => {
        return flags[key] ?? defaultValue
      },
    }),
    [flags],
  )

  return (
    <FeatureFlagContext.Provider value={context}>
      {children}
    </FeatureFlagContext.Provider>
  )
}

export const useFeatureFlagClient = () => {
  return useContext(FeatureFlagContext)
}

// When initialValue is null, return type includes null
export function useFeatureFlag<T extends string | boolean>(
  key: string,
  defaultValue: T,
  initialValue: null,
): T | null

// When initialValue is provided and not null, return type is T
export function useFeatureFlag<T extends string | boolean>(
  key: string,
  defaultValue: T,
  initialValue: T,
): T

// When initialValue is not provided (backwards compatible), return type is T
export function useFeatureFlag<T extends string | boolean>(
  key: string,
  defaultValue: T,
): T

export function useFeatureFlag<T extends string | boolean>(
  key: string,
  defaultValue: T,
  initialValue?: T | null,
) {
  const featureFlagClient = useFeatureFlagClient()
  const [flag, setFlag] = useState<T | null>(
    initialValue !== undefined ? initialValue : defaultValue,
  )

  useEffect(() => {
    let isMounted = true

    featureFlagClient
      .getValue(key, defaultValue)
      .then((result) => {
        if (isMounted) {
          setFlag(result as T)
        }
      })
      .catch(() => {
        if (isMounted) {
          setFlag(defaultValue)
        }
      })

    return () => {
      isMounted = false
    }
  }, [defaultValue, featureFlagClient, key])

  return flag
}
