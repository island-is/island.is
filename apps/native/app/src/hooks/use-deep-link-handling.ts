import {
  FirebaseMessagingTypes,
  getInitialNotification,
  onNotificationOpenedApp,
} from '@react-native-firebase/messaging'
import { useLinkingURL } from 'expo-linking'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useMarkUserNotificationAsReadMutation } from '../graphql/types/schema'

import { navigateToUniversalLink } from '../lib/deep-linking'
import { app } from '../lib/firebase'
import { useBrowser } from './use-browser'
import { useAuthStore } from '../stores/auth-store'
import { isString } from '../utils/is-string'
import { stashPendingDeepLink } from '../app/+native-intent'

// Expo-style notification hook wrapping firebase.
function useLastNotificationResponse() {
  const [lastNotificationResponse, setLastNotificationResponse] =
    useState<FirebaseMessagingTypes.RemoteMessage | null>(null)

  useEffect(() => {
    getInitialNotification(app.messaging()).then((remoteMessage) => {
      if (remoteMessage) {
        setLastNotificationResponse(remoteMessage)
      }
    })

    // Return the unsubscribe function as a useEffect destructor.
    return onNotificationOpenedApp(app.messaging(), (remoteMessage) => {
      setLastNotificationResponse(remoteMessage)
    })
  }, [])

  return lastNotificationResponse
}

// @todo migration - is this working??
export function useDeepLinkHandling() {
  const url = useLinkingURL()
  const notification = useLastNotificationResponse()
  const [markUserNotificationAsRead] = useMarkUserNotificationAsReadMutation()
  const lockScreenActivatedAt = useAuthStore(
    ({ lockScreenActivatedAt }) => lockScreenActivatedAt,
  )
  const { openBrowser } = useBrowser()

  // Dedup keys, persisted across the lock cycle so each intent is handled once
  // despite the re-render churn a replay triggers.
  const lastLinkingUrl = useRef<string | null>(null)
  const handledNotificationKey = useRef<string | null>(null)

  // Locked → stash for unlockApp to replay; unlocked → navigate now.
  const handleUrl = useCallback(
    (url: string) => {
      // Wallet URLs are handled elsewhere.
      if (url.startsWith('is.island.app') && url.includes('wallet/')) {
        return false
      }

      if (lockScreenActivatedAt) {
        stashPendingDeepLink(url)
        return true
      }

      navigateToUniversalLink({ link: url, openBrowser })
      return true
    },
    [lockScreenActivatedAt, openBrowser],
  )

  // Universal links: dedup by URL.
  useEffect(() => {
    if (!url || lastLinkingUrl.current === url) {
      return
    }
    lastLinkingUrl.current = url
    handleUrl(url)
  }, [url, handleUrl])

  // Notification taps: dedup so a lock re-arm mid-replay can't re-handle the
  // same tap (which caused an infinite reopen loop). Key on notificationId when
  // present, else fall back to the URL — a tap with a clickActionUrl but no id
  // would otherwise never be deduped and re-navigate on every lock cycle.
  useEffect(() => {
    const url = notification?.data?.clickActionUrl
    const notificationId = notification?.data?.notificationId
    if (!isString(url)) {
      return
    }
    const id = notificationId != null ? String(notificationId) : null
    const dedupKey = id ?? url
    if (handledNotificationKey.current === dedupKey) {
      return
    }

    const wasHandled = handleUrl(url)
    if (!wasHandled) {
      return
    }
    handledNotificationKey.current = dedupKey

    if (id) {
      // Mark as read and seen
      void markUserNotificationAsRead({
        variables: { id: Number(id) },
      }).catch(() => void 0)
    }
  }, [notification, handleUrl, markUserNotificationAsRead])
}
