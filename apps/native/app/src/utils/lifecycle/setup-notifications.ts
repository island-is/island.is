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

  addNotificationReceivedListener((notification) => {
    handleNotificationResponse({
      notification,
      actionIdentifier: 'NOOP',
    })
  })

  addNotificationResponseReceivedListener((response) => {
    handleNotificationResponse(response)
  })
}
