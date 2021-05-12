import React from 'react'
import { useQuery } from '@apollo/client'
import { Text, ActivityIndicator, FlatList } from 'react-native'
import { Navigation, NavigationFunctionComponent } from 'react-native-navigation'
import { useIntl } from 'react-intl'
import logo from '../../assets/logo/logo-64w.png'
import { client } from '../../graphql/client'
import {
  ListNotificationsResponse,
  LIST_NOTIFICATIONS_QUERY,
} from '../../graphql/queries/list-notifications.query'
import { INotification } from '../../graphql/fragments/notification.fragment'
import { TouchableHighlight } from 'react-native'
import { theme } from '@island.is/island-ui/theme'
import { navigateToNotification } from '../../utils/deep-linking'
import { useNotificationsStore } from '../../stores/notifications-store'
import { NavigationBarSheet } from '../../components/navigation-bar-sheet/navigation-bar-sheet'
import { NotificationCard } from '@island.is/island-ui-native'

export const NotificationsScreen: NavigationFunctionComponent = ({ componentId }) => {
  const notificationsRes = useQuery<ListNotificationsResponse>(
    LIST_NOTIFICATIONS_QUERY,
    {
      client,
    },
  )
  const notificationsStore = useNotificationsStore();
  const intl = useIntl();

  if (notificationsRes.loading) {
    return <ActivityIndicator />
  }

  if (!notificationsRes.data) {
    return <Text>No data</Text>
  }

  const notifications = notificationsRes.data?.listNotifications!

  const onNotificationPress = (notification: INotification) => {
    navigateToNotification(notification, componentId);
  }

  const renderNotificationItem = ({ item }: { item: INotification }) => {
    const unread = !notificationsStore.readItems.has(item.id);
    return (
      <TouchableHighlight underlayColor={theme.color.blue100} onPress={() => onNotificationPress(item)}>
        <NotificationCard
          key={item.id}
          id={item.id}
          title={item.serviceProvider}
          message={item.title}
          date={new Date(item.date)}
          icon={logo}
          unread={!notificationsStore.readItems.has(item.id)}
          onPress={() => navigateToNotification(item, componentId)}
          actions={item.actions?.map(action => ({
            text: action.text,
            onPress() {
              navigateToNotification({ id: item.id, link: action.link }, componentId);
            }
          }))}
        />
      </TouchableHighlight>
    )
  }

  return (
    <>
      <NavigationBarSheet
        title={intl.formatMessage({ id: 'notifications.screenTitle' })}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{ marginHorizontal: 16 }}
      />
      <FlatList
        style={{ marginHorizontal: 16, flex: 1 }}
        data={notifications}
        keyExtractor={(item: any) => item.id}
        renderItem={renderNotificationItem}
      />
    </>
  )
}

NotificationsScreen.options = {
  topBar: {
    visible: false,
  },
}
