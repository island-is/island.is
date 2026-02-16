import {
  FirebaseMessagingTypes,
  getInitialNotification,
  onNotificationOpenedApp,
} from '@react-native-firebase/messaging'
import { useURL } from 'expo-linking'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useMarkUserNotificationAsReadMutation } from '../graphql/types/schema'

import { navigateToUniversalLink } from '../lib/deep-linking'
import { app } from '../lib/firebase'
import { useBrowser } from '../lib/use-browser'
import { useAuthStore } from '../new-stores/auth-store'
import { isString } from '../utils/is-string'

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

export function useDeepLinkHandling() {
  const url = useURL()
  const notification = useLastNotificationResponse()
  const [markUserNotificationAsRead] = useMarkUserNotificationAsReadMutation()
  const lockScreenActivatedAt = useAuthStore(
    ({ lockScreenActivatedAt }) => lockScreenActivatedAt,
  )

  const lastUrl = useRef<string | null>(null)
  const { openBrowser } = useBrowser()

  const handleUrl = useCallback(
    (url?: string | null) => {
      if (!url || lastUrl.current === url || lockScreenActivatedAt) {
        return false
      }

      lastUrl.current = url

      if (url.startsWith('is.island.app') && url.includes('wallet/')) {
        return false
      }

      navigateToUniversalLink({ link: url, openBrowser })

      return true
    },
    [openBrowser, lastUrl, lockScreenActivatedAt],
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
      })
    }
  }, [notification, handleUrl, markUserNotificationAsRead])
}
