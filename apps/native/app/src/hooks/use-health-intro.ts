import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import * as Crypto from 'expo-crypto'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'

import { useFeatureFlag } from '@/components/providers/feature-flag-provider'
import { useAuthStore } from '@/stores/auth-store'

// Who has seen it, as hashes of their kennitala. Its own key: a logout
// clears the preferences, and this has to outlast it.
const SEEN_KEY = 'health_intro_seen'

// Lets anything else this screen opens as it appears go first, e.g. the
// update wall or a link the person tapped.
const HEALTH_INTRO_DELAY_MS = 500

const hashOf = (nationalId: string) =>
  Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nationalId)

async function readSeen(): Promise<string[]> {
  try {
    const seen = JSON.parse((await AsyncStorage.getItem(SEEN_KEY)) ?? '[]')
    return Array.isArray(seen) ? seen : []
  } catch {
    return []
  }
}

async function markSeen(nationalId: string) {
  const [seen, hash] = await Promise.all([readSeen(), hashOf(nationalId)])
  if (!seen.includes(hash)) {
    await AsyncStorage.setItem(SEEN_KEY, JSON.stringify([...seen, hash]))
  }
}

/**
 * Introduces the health data on the home screen, once for each person, when
 * any of the health services is on.
 */
export function useHealthIntro() {
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  // Never over the lock.
  const isUnlocked = useAuthStore(
    ({ authorizeResult, lockScreenActivatedAt }) =>
      !!authorizeResult && lockScreenActivatedAt === undefined,
  )
  const nationalId = useAuthStore(
    ({ nativeUser, userInfo }) =>
      nativeUser?.nationalId ?? userInfo?.nationalId,
  )
  // Unknown until read: then it waits.
  const [isSeen, setIsSeen] = useState<boolean>()
  const isHealthMessagesEnabled = useFeatureFlag(
    'isAppHealthMessagesEnabled',
    false,
  )
  const isQuestionnaireEnabled = useFeatureFlag('isQuestionnaireEnabled', false)
  const isAppointmentsEnabled = useFeatureFlag('isAppointmentsEnabled', false)
  const isPrescriptionsEnabled = useFeatureFlag('isPrescriptionsEnabled', false)
  const isMedicineDelegationEnabled = useFeatureFlag(
    'isMedicineDelegationEnabled',
    false,
  )
  const isHealthEnabled =
    isHealthMessagesEnabled ||
    isQuestionnaireEnabled ||
    isAppointmentsEnabled ||
    isPrescriptionsEnabled ||
    isMedicineDelegationEnabled

  useEffect(() => {
    setIsSeen(undefined)
    if (!nationalId) {
      return
    }
    let isCurrent = true
    void Promise.all([readSeen(), hashOf(nationalId)])
      .then(([seen, hash]) => {
        if (isCurrent) {
          setIsSeen(seen.includes(hash))
        }
      })
      .catch(() => {
        // Not knowing, it's left out rather than shown twice.
      })
    return () => {
      isCurrent = false
    }
  }, [nationalId])

  useEffect(() => {
    if (
      !isFocused ||
      !isUnlocked ||
      !nationalId ||
      isSeen !== false ||
      !isHealthEnabled
    ) {
      return
    }
    const timer = setTimeout(() => {
      if (!navigation.isFocused()) {
        return
      }
      setIsSeen(true)
      void markSeen(nationalId).catch((error) =>
        console.warn('Could not save that the health intro was seen', error),
      )
      router.push('/health-intro')
    }, HEALTH_INTRO_DELAY_MS)
    return () => clearTimeout(timer)
  }, [isFocused, isUnlocked, nationalId, isSeen, isHealthEnabled, navigation])
}
