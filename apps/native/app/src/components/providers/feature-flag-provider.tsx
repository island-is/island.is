import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { gql, useQuery } from '@apollo/client'
import { useAuthStore } from '@/stores/auth-store'
import { setFeatureFlagCache } from '@/lib/feature-flag-client'

type FeatureFlagRecord = Record<string, boolean | string>

const FEATURE_FLAGS_QUERY = gql`
  query FeatureFlags {
    featureFlags {
      flags
    }
  }
`

const EMPTY_FLAGS: FeatureFlagRecord = {}

export interface FeatureFlagClient {
  getValue(
    key: string,
    defaultValue: boolean | string,
  ): Promise<boolean | string>
  dispose(): void
}

const FeatureFlagContext = createContext<FeatureFlagClient>({
  getValue: (_, defaultValue) => Promise.resolve(defaultValue),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispose() {},
})

export const FeatureFlagProvider: FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const { authorizeResult } = useAuthStore()
  const isAuthenticated = !!authorizeResult
  const { data } = useQuery<{ featureFlags: { flags: FeatureFlagRecord } }>(
    FEATURE_FLAGS_QUERY,
    { skip: !isAuthenticated },
  )
  const flags = data?.featureFlags?.flags ?? EMPTY_FLAGS

  // Keep the module-level cache in sync for non-React usages
  useEffect(() => {
    setFeatureFlagCache(flags)
  }, [flags])

  const context = useMemo<FeatureFlagClient>(
    () => ({
      getValue: async (key: string, defaultValue: boolean | string) => {
        return flags[key] ?? defaultValue
      },
      dispose: () => {},
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
