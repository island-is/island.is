import { Heading, NotificationCard } from '@ui'
import React, { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { SafeAreaView } from 'react-native'
import { navigateToNotification } from '../../lib/deep-linking'
import {
  Notification,
  actionsForNotification,
  useNotificationsStore,
} from '../../stores/notifications-store'
import { useOrganizationsStore } from '../../stores/organizations-store'

interface NotificationsModuleProps {
  componentId: string
}

export const NotificationsModule = React.memo(
  ({ componentId }: NotificationsModuleProps) => {
    const intl = useIntl()
    const { getNotifications } = useNotificationsStore()
    const { getOrganizationLogoUrl } = useOrganizationsStore()
    const notifications = getNotifications().slice(0, 5)
    const onNotificationPress = useCallback((notification: Notification) => {
      navigateToNotification(notification, componentId)
    }, [])

    return (
      <SafeAreaView style={{ marginHorizontal: 16 }}>
        <Heading>{intl.formatMessage({ id: 'home.notifications' })}</Heading>
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            id={notification.id}
            category={notification.category}
            title={notification.title!}
            message={notification.body!}
            date={new Date(notification.date)}
            icon={getOrganizationLogoUrl(notification.title!, 64)}
            unread={!notification.read}
            onPress={() => onNotificationPress(notification)}
            actions={actionsForNotification(notification, componentId)}
          />
        ))}
      </SafeAreaView>
    )
  },
)
