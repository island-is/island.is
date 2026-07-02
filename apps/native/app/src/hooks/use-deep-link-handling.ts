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

  const lastUrl = useRef<string | null>(null)

  const handleUrl = useCallback(
    (url?: string | null) => {
      if (!url || lastUrl.current === url) {
        return false
      }
      lastUrl.current = url

      // Wallet URLs are intentionally handled elsewhere — keep the bypass
      // ahead of the lock-stash so locked-state doesn't change wallet flow.
      if (url.startsWith('is.island.app') && url.includes('wallet/')) {
        return false
      }

      // Locked: stash so unlockApp replays it. Return true so notification
      // callers still mark the notification as read — we acknowledged the URL.
      if (lockScreenActivatedAt) {
        stashPendingDeepLink(url)
        return true
      }

      navigateToUniversalLink({ link: url, openBrowser })

      return true
    },
    [lastUrl, lockScreenActivatedAt, openBrowser],
  )

  useEffect(() => {
    handleUrl(url)
  }, [url, handleUrl])

  useEffect(() => {
    const url = notification?.data?.clickActionUrl
    const wasHandled = isString(url) ? handleUrl(url) : false

    if (wasHandled && notification?.data?.notificationId) {
      // Mark notification as read and seen
      void markUserNotificationAsRead({
        variables: { id: Number(notification.data.notificationId) },
      }).catch(() => void 0)
    }
  }, [notification, handleUrl, markUserNotificationAsRead])
}
