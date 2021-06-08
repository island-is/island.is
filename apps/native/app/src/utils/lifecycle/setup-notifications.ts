import {
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  DEFAULT_ACTION_IDENTIFIER,
  NotificationResponse,
  setNotificationCategoryAsync,
  setNotificationHandler,
} from 'expo-notifications'
import { navigateToNotification } from '../../lib/deep-linking'
import {
  notificationCategories,
  notificationsStore,
} from '../../stores/notifications-store'

type NotificationContent = {
  title: string | null
  subtitle: string | null
  body: string | null
  data: {
    [key: string]: unknown
  }
  sound: 'default' | 'defaultCritical' | 'custom' | null
  launchImageName: string | null
  badge: number | null
  attachments: Array<{
    identifier: string | null
    url: string | null
    type: string | null
  }>
  summaryArgument?: string | null
  summaryArgumentCount?: number
  categoryIdentifier: string | null
  threadIdentifier: string | null
  targetContentIdentifier?: string
  color?: string
  vibrationPattern?: number[]
}

export function handleNotificationResponse(response: NotificationResponse) {
  // parse notification response and add to the store
  const notification = notificationsStore
    .getState()
    .actions.handleNotificationResponse(response)

  // handle notification
  const id = response.notification.request.identifier
  const content = response.notification.request.content as NotificationContent

  if (response.actionIdentifier === DEFAULT_ACTION_IDENTIFIER) {
    navigateToNotification({ id })
  } else {
    const category = notificationCategories.find(
      ({ categoryIdentifier }) =>
        categoryIdentifier === content.categoryIdentifier,
    )
    const action = category?.actions.find(
      (x) => x.identifier === response.actionIdentifier,
    )

    if (!category || !action) {
      return;
    }

    // follow the action!
    action.onPress(notification)
  }
}

export async function setupNotifications() {
  // set notification groups
  Promise.all(
    notificationCategories.map(({ categoryIdentifier, actions }) => {
      setNotificationCategoryAsync(categoryIdentifier, actions)
    }),
  )

  setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: true,
    }),
  });

  // expo
  addNotificationReceivedListener((notification) => {
    console.log('addNotificationReceivedListener')
    console.log(JSON.stringify(notification))
    handleNotificationResponse({
      notification,
      actionIdentifier: 'NOOP',
    })
  })

  // expo action clicked
  addNotificationResponseReceivedListener((response) => {
    console.log('addNotificationResponseReceivedListener')
    console.log(JSON.stringify(response))
    handleNotificationResponse(response)
  })

  // LETS USE EXPO INSTEAD
  // messaging().onNotificationOpenedApp(remoteMessage => {
  //   console.log('messaging().onNotificationOpenedApp', remoteMessage);
  //   // navigateToNotification(remoteMessage);
  // });

  // Check whether an initial notification is available
  // messaging()
  //   .getInitialNotification()
  //   .then(remoteMessage => {
  //     if (remoteMessage) {
  //       console.log('messaging().getInitialNotification', remoteMessage);
  //       // navigateToNotification(remoteMessage);
  //     }
  //   });

  // handle firebase messages in foreground
  // messaging().onMessage(async remoteMessage => {
  //   notificationsStore.getState().actions.handleRemoteMessage(remoteMessage);
  //   console.log('messaging().onMessage', remoteMessage);
  // });

  // // handle firebase messages in background
  // messaging().setBackgroundMessageHandler(async remoteMessage => {
  //   notificationsStore.getState().actions.handleRemoteMessage(remoteMessage);

  //   console.log('messaging().setBackgroundMessageHandler', remoteMessage);
  // });
}
