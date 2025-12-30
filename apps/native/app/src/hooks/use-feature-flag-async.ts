import { useEffect, useState } from 'react'

import { useFeatureFlagClient } from '../contexts/feature-flag-provider'

export function useFeatureFlagAsync(
  key: string,
  defaultValue: string,
  initialValue?: string | null,
): string | null
export function useFeatureFlagAsync(
  key: string,
  defaultValue: boolean,
  initialValue?: boolean | null,
): boolean | null

export function useFeatureFlagAsync<T extends string | boolean>(
  key: string,
  defaultValue: T,
  initialValue: T | null = null,
) {
  const featureFlagClient = useFeatureFlagClient()
  const [value, setValue] = useState<T | null>(initialValue)

  useEffect(() => {
    let isMounted = true

    featureFlagClient
      .getValue(key, defaultValue)
      .then((result) => {
        if (isMounted) {
          setValue(result as T)
        }
      })
      .catch(() => {
        if (isMounted) {
          setValue(defaultValue)
        }
      })

    return () => {
      isMounted = false
    }
  }, [defaultValue, featureFlagClient, key])

  return value
}
