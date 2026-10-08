import { NetworkStatus, useApolloClient } from '@apollo/client'
import { useCallback, useEffect, useRef } from 'react'
import { useFocusEffect } from 'expo-router'
import { AppState } from 'react-native'

import { useFeatureFlag } from '@/components/providers/feature-flag-provider'
import { useStepUpSessionQuery } from '@/graphql/types/schema'
import { evictLockedData } from '@/lib/step-up/evict-locked-data'
import { stepUpStore, useStepUpStore } from '@/stores/step-up-store'

export type StepUpLockState =
  | 'loading'
  | 'locked'
  | 'unlocked'
  /** Unlocked as far as we knew, and being asked again: hide, don't unmount. */
  | 'checking'

/**
 * Whether an area of the app is locked behind an Auðkenni unlock.
 *
 * The feature flag is the on/off switch, and it is the same flag the API uses
 * to refuse the area's data. The API has the last word: it decides whether
 * this session is unlocked, and if it refuses data the area locks even when
 * the flag here says off (the two are read differently, and the API locks when
 * it can't read the flag). We ask it when the area opens and whenever the app
 * comes back to the foreground, when the area comes into view, and when the
 * unlock can have run out.
 */
export function useStepUpLock(flag: string) {
  // Read as the API reads it: if the flag can't be read, the API locks the
  // area, so the app asks it rather than showing what it has cached.
  const isFlagOn = useFeatureFlag(flag, true, null)
  const requiredByServer = useStepUpStore((state) => state.required)
  const isRequired = requiredByServer || isFlagOn
  const client = useApolloClient()

  const { data, loading, refetch, networkStatus } = useStepUpSessionQuery({
    skip: !isRequired,
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  })
  // While asking again, show nothing rather than what is cached: it may be
  // what the answer is about to lock away.
  const rechecking = networkStatus === NetworkStatus.refetch

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

  // Screens of the area may show what is cached without asking the server, so
  // the server may never get to say it has locked. Ask again whenever the area
  // comes into view…
  useFocusEffect(refresh)

  // …and when the unlock can have run out while it stays in view: after the
  // idle time, or at the absolute limit, whichever comes first.
  const session = data?.stepUpSession
  useEffect(() => {
    if (!session?.unlocked) {
      return
    }
    const untilLimit = session.expiresAt
      ? new Date(session.expiresAt).getTime() - Date.now()
      : Infinity
    const wait = Math.max(
      1000,
      Math.min(untilLimit, session.idleSeconds * 1000) + 1000,
    )
    const timer = setTimeout(refresh, wait)
    return () => clearTimeout(timer)
  }, [session, refresh])

  let state: StepUpLockState
  if (isRequired === null) {
    state = 'loading'
  } else if (!isRequired) {
    state = 'unlocked'
  } else if (!data) {
    // Until the server answers there is nothing to show; failing to reach it
    // keeps the lock, which offers to unlock.
    state = loading ? 'loading' : 'locked'
  } else if (data.stepUpSession.unlocked && !requiredByServer) {
    state = rechecking ? 'checking' : 'unlocked'
  } else {
    state = 'locked'
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
