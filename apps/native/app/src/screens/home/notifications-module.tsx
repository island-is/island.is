import { Heading, NotificationCard } from "@island.is/island-ui-native"
import React from 'react'
import { SafeAreaView } from "react-native"
import logo from '../../assets/logo/logo-64w.png'
import { INotification } from '../../graphql/fragments/notification.fragment'
import { useNotificationsStore } from '../../stores/notifications-store'
import { navigateToNotification } from '../../utils/deep-linking'
import { useIntl } from "../../utils/intl"

interface NotificationsModuleProps {
  items: INotification[];
  componentId: string;
}

export const NotificationsModule = React.memo(({ items, componentId }: NotificationsModuleProps) => {
  const intl = useIntl()
  const notificationsStore = useNotificationsStore()

  return (
    <SafeAreaView style={{ marginHorizontal: 16 }}>
      <Heading>{intl.formatMessage({ id: 'home.notifications' })}</Heading>
      {items
        .map((notification) => (
          <NotificationCard
            key={notification.id}
            id={notification.id}
            title={notification.serviceProvider}
            message={notification.title}
            date={new Date(notification.date)}
            icon={logo}
            unread={!notificationsStore.readItems.has(notification.id)}
            onPress={() =>
              navigateToNotification(notification, componentId)
            }
            actions={notification.actions?.map((action) => ({
              text: action.text,
              onPress() {
                navigateToNotification(
                  { id: notification.id, link: action.link },
                  componentId,
                )
              },
            }))}
          />
        ))}
    </SafeAreaView>
  )
});
