import { useQuery } from '@apollo/client'
import {
  Content,
  Header,
  NavigationBarSheet,
} from '@island.is/island-ui-native'
import {
  scheduleNotificationAsync,
  setNotificationCategoryAsync,
} from 'expo-notifications'
import React from 'react'
import { FormattedDate } from 'react-intl'
import { ActivityIndicator, Text } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import styled from 'styled-components/native'
import logo from '../../assets/logo/logo-64w.png'
import { client } from '../../graphql/client'
import {
  GetNotificationResponse,
  GET_NOTIFICATION_QUERY,
} from '../../graphql/queries/get-notification.query'
import { useIntl } from '../../utils/intl'
import { testIDs } from '../../utils/test-ids'
import { useThemedNavigationOptions } from '../../utils/use-themed-navigation-options'

interface NotificationDetailScreenProps {
  id: string
}

const Host = styled.SafeAreaView`
  margin-left: 24px;
  margin-right: 24px;
  flex: 1;
`

const {
  useNavigationOptions,
  getNavigationOptions,
} = useThemedNavigationOptions(() => ({
  topBar: {
    visible: false,
  },
}))

export const NotificationDetailScreen: NavigationFunctionComponent<NotificationDetailScreenProps> = ({
  componentId,
  id,
}) => {
  useNavigationOptions(componentId)
  const intl = useIntl()
  const notificationRes = useQuery<GetNotificationResponse>(
    GET_NOTIFICATION_QUERY,
    {
      client,
      variables: {
        id,
      },
    },
  )

  if (notificationRes.loading) {
    return <ActivityIndicator />
  }

  if (!notificationRes.data) {
    return <Text>Not found</Text>
  }

  const notification = notificationRes.data?.Notification!

  const onSendPushNotification = () => {
    const categoryIdentifier = notification.actions.length
      ? `${notification.id}_${notification.actions
          .map((action) => action.id)
          .join('_')}`
      : undefined

    if (categoryIdentifier) {
      setNotificationCategoryAsync(
        categoryIdentifier,
        notification.actions.map((action) => ({
          buttonTitle: action.text,
          identifier: action.id,
        })),
      )
    }

    return scheduleNotificationAsync({
      content: {
        title: notification.serviceProvider,
        body: notification.title,
        categoryIdentifier,
        data: {
          id: notification.id,
          date: notification.date,
          serviceProvider: notification.serviceProvider,
          actions: notification.actions,
        },
      },
      trigger: { seconds: 2 },
    })
  }

  return (
    <Host testID={testIDs.SCREEN_NOTIFICATION_DETAIL}>
      <NavigationBarSheet
        title={intl.formatMessage({ id: 'notificationDetail.screenTitle' })}
        onClosePress={() => Navigation.dismissModal(componentId)}
      />
      <Header
        title={notification.serviceProvider}
        logo={logo}
        date={<FormattedDate value={new Date(notification.date)} />}
      />
      <Content title={notification.title} message={notification.message} />
      {/* <Button title="Send push notification" onPress={onSendPushNotification} /> */}
    </Host>
  )
}

NotificationDetailScreen.options = getNavigationOptions
