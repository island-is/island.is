import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging'
import {
  DEFAULT_ACTION_IDENTIFIER,
  Notification,
  NotificationResponse,
} from 'expo-notifications'
import { navigateTo, navigateToNotification } from '../../lib/deep-linking'

export const ACTION_IDENTIFIER_NO_OPERATION = 'NOOP'

export async function handleNotificationResponse({
  actionIdentifier,
  notification,
}: NotificationResponse) {
  const link =
    notification.request.content.data?.clickActionUrl ??
    notification.request.content.data?.link

  if (
    typeof link === 'string' &&
    actionIdentifier !== ACTION_IDENTIFIER_NO_OPERATION
  ) {
    navigateToNotification({ link })
  } else {
    navigateTo('/notifications')
  }
}

function mapRemoteMessage(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
): Notification {
  return {
    date: remoteMessage.sentTime ?? 0,
    request: {
      content: {
        title: remoteMessage.notification?.title || null,
        subtitle: null,
        body: remoteMessage.notification?.body || null,
        data: {
          link: remoteMessage.notification?.android?.link,
          ...remoteMessage.data,
        },
        sound: 'default',
      },
      identifier: remoteMessage.messageId ?? '',
      trigger: {
        type: 'push',
      },
    },
  }
}

export function setupNotifications() {
  // FCMs

  messaging().onNotificationOpenedApp((remoteMessage) =>
    handleNotificationResponse({
      notification: mapRemoteMessage(remoteMessage),
      actionIdentifier: DEFAULT_ACTION_IDENTIFIER,
    }),
  )

  messaging().onMessage((remoteMessage) =>
    handleNotificationResponse({
      notification: mapRemoteMessage(remoteMessage),
      actionIdentifier: ACTION_IDENTIFIER_NO_OPERATION,
    }),
  )

  messaging().setBackgroundMessageHandler((remoteMessage) =>
    handleNotificationResponse({
      notification: mapRemoteMessage(remoteMessage),
      actionIdentifier: ACTION_IDENTIFIER_NO_OPERATION,
    }),
  )
}

/**
 * Handle initial notification when app is closed and opened from a notification
 */
export function handleInitialNotification() {
  // FCMs
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        void handleNotificationResponse({
          notification: mapRemoteMessage(remoteMessage),
          actionIdentifier: DEFAULT_ACTION_IDENTIFIER,
        })
      }
    })
}
