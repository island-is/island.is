import { useApolloClient } from '@apollo/client'
import { useCallback, useEffect, useRef } from 'react'
import { AppState } from 'react-native'

import { useFeatureFlag } from '@/components/providers/feature-flag-provider'
import { useStepUpSessionQuery } from '@/graphql/types/schema'
import { evictLockedData } from '@/lib/step-up/evict-locked-data'
import { stepUpStore, useStepUpStore } from '@/stores/step-up-store'

export type StepUpLockState = 'loading' | 'locked' | 'unlocked'

/**
 * Whether an area of the app is locked behind an Auðkenni unlock.
 *
 * The feature flag is the on/off switch, and it is the same flag the API uses
 * to refuse the area's data. The API has the last word: it decides whether
 * this session is unlocked, and if it refuses data the area locks even when
 * the flag here says off (the two are read differently, and the API locks when
 * it can't read the flag). We ask it when the area opens and whenever the app
 * comes back to the foreground.
 */
export function useStepUpLock(flag: string) {
  const isFlagOn = useFeatureFlag(flag, false, null)
  const requiredByServer = useStepUpStore((state) => state.required)
  const isRequired = requiredByServer || isFlagOn
  const client = useApolloClient()

  const { data, loading, refetch } = useStepUpSessionQuery({
    skip: !isRequired,
    fetchPolicy: 'network-only',
  })

  const refresh = useCallback(() => {
    if (isRequired) {
      void refetch().catch(() => undefined)
    }
  }, [isRequired, refetch])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        refresh()
      }
    })
    return () => subscription.remove()
  }, [refresh])

  let state: StepUpLockState
  if (isRequired === null) {
    state = 'loading'
  } else if (!isRequired) {
    state = 'unlocked'
  } else if (!data) {
    // Until the server answers there is nothing to show; failing to reach it
    // keeps the lock, which offers to unlock.
    state = loading ? 'loading' : 'locked'
  } else {
    state =
      data.stepUpSession.unlocked && !requiredByServer ? 'unlocked' : 'locked'
  }

  // Leaving nothing behind whenever it locks — including on a cold start, when
  // the cache restored from the device may still hold the area's data.
  const previous = useRef<StepUpLockState | undefined>(undefined)
  useEffect(() => {
    if (state === 'locked' && previous.current !== 'locked') {
      evictLockedData(client.cache)
    }
    previous.current = state
  }, [client, state])

  const onUnlocked = useCallback(async () => {
    stepUpStore.getState().markUnlocked()
    await refetch().catch(() => undefined)
  }, [refetch])

  return { state, onUnlocked }
}
