import { useQuery } from '@apollo/client'
import { dynamicColor, font, NavigationBarSheet } from '@island.is/island-ui-native'
import {
  scheduleNotificationAsync,
  setNotificationCategoryAsync,
} from 'expo-notifications'
import React from 'react'
import { FormattedDate } from 'react-intl'
import { ActivityIndicator, ScrollView, Text } from 'react-native'
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

const Logo = styled.Image`
  width: 16px;
  height: 16px;
  margin-right: 8px;
`

const Header = styled.View`
  flex-direction: row;
  padding-bottom: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${dynamicColor(props => ({
    dark: props.theme.shades.dark.shade200,
    light: props.theme.color.blue100,
  }))};
  margin-bottom: 16px;
`

const ServiceProvider = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  padding-right: 8px;
`

const ServiceProviderText = styled.Text`
  ${font({
    fontSize: 13,
  })}
  flex: 1;
`

const DateText = styled.Text<{ unread?: boolean }>`
  ${font({
    fontWeight: props => props.unread ? '600' : '300',
    fontSize: 13,
  })}
`

const Title = styled.Text`
  ${font({
    fontWeight: '600',
    fontSize: 20,
  })}
  margin-bottom: 16px;
`

const Message = styled.Text`
  ${font({
    fontWeight: '300',
    fontSize: 16,
  })}
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
        componentId={componentId}
        title={intl.formatMessage({ id: 'notificationDetail.screenTitle' })}
        onClosePress={() => Navigation.dismissModal(componentId)}
      />
      <Header>
        <ServiceProvider>
          <Logo source={logo} />
          <ServiceProviderText numberOfLines={1} ellipsizeMode="tail">
            {notification.serviceProvider}
          </ServiceProviderText>
        </ServiceProvider>
        <DateText>
          <FormattedDate value={new Date(notification.date)} />
        </DateText>
      </Header>
      <ScrollView style={{ flex: 1 }}>
        <Title>{notification.title}</Title>
        <Message>{notification.message}</Message>
      </ScrollView>
    </Host>
  )
}

NotificationDetailScreen.options = getNavigationOptions
