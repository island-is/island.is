import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging'
import {
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  DEFAULT_ACTION_IDENTIFIER,
  Notification,
  NotificationResponse,
  setNotificationHandler,
} from 'expo-notifications'
import { navigateToNotification } from '../../lib/deep-linking'
import { isIos } from '../devices'

const NO_OPERATION = 'NOOP'

export async function handleNotificationResponse(
  response: NotificationResponse,
) {
  const link = response.notification.request.content.data?.link
  console.log(
    'response.notification.request.content',
    response.notification.request.content,
  )
  if (typeof link === 'string' && response.actionIdentifier !== NO_OPERATION) {
    navigateToNotification({ link })
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
  setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: true,
    }),
  })

  addNotificationReceivedListener((notification) =>
    handleNotificationResponse({
      notification,
      actionIdentifier: NO_OPERATION,
    }),
  )

  addNotificationResponseReceivedListener((response) =>
    handleNotificationResponse(response),
  )

  // FCMs
  if (!isIos) {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      handleNotificationResponse({
        notification: mapRemoteMessage(remoteMessage),
        actionIdentifier: DEFAULT_ACTION_IDENTIFIER,
      })
    })

    messaging().onMessage((remoteMessage) => {
      handleNotificationResponse({
        notification: mapRemoteMessage(remoteMessage),
        actionIdentifier: NO_OPERATION,
      })
    })

    messaging().setBackgroundMessageHandler((remoteMessage) =>
      handleNotificationResponse({
        notification: mapRemoteMessage(remoteMessage),
        actionIdentifier: NO_OPERATION,
      }),
    )
  }
}

export function openInitialNotificationAndroid() {
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
