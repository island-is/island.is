import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useURL } from 'expo-linking'
import { useMarkUserNotificationAsReadMutation } from '../graphql/types/schema'

import { navigateToUniversalLink } from '../lib/deep-linking'
import { useBrowser } from '../lib/use-browser'
import { useAuthStore } from '../stores/auth-store'

// Expo-style notification hook wrapping firebase.
function useLastNotificationResponse() {
  const [lastNotificationResponse, setLastNotificationResponse] =
    useState<FirebaseMessagingTypes.RemoteMessage | null>(null)

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          setLastNotificationResponse(remoteMessage)
        }
      })

    // Return the unsubscribe function as a useEffect destructor.
    return messaging().onNotificationOpenedApp((remoteMessage) => {
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
    const wasHandled = handleUrl(url)
    if (wasHandled && notification?.data?.notificationId) {
      // Mark notification as read and seen
      void markUserNotificationAsRead({
        variables: { id: Number(notification.data.notificationId) },
      })
    }
  }, [notification, handleUrl, markUserNotificationAsRead])
}
