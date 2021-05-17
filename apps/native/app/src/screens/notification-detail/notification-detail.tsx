import { useQuery } from '@apollo/client'
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
import styled, { useTheme } from 'styled-components/native'
import logo from '../../assets/logo/logo-64w.png'
import { NavigationBarSheet } from '../../components/navigation-bar-sheet/navigation-bar-sheet'
import { useScreenOptions } from '../../contexts/theme-provider'
import { client } from '../../graphql/client'
import {
  GetNotificationResponse,
  GET_NOTIFICATION_QUERY,
} from '../../graphql/queries/get-notification.query'
import { createNavigationTitle } from '../../utils/create-navigation-title'
import { useIntl } from '../../utils/intl'
import { testIDs } from '../../utils/test-ids'

interface NotificationDetailScreenProps {
  id: string
}

const Host = styled.SafeAreaView`
  margin-left: 24px;
  margin-right: 24px;
  flex: 1;
  /* margin-top: 16px; */
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
  border-bottom-color: ${(props) =>
    props.theme.isDark
      ? props.theme.shade.shade200
      : props.theme.color.blue100};
  margin-bottom: 16px;
`

const ServiceProvider = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  padding-right: 8px;
`

const ServiceProviderText = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 13px;
  line-height: 17px;
  color: ${(props) => props.theme.shade.foreground};
  flex: 1;
`

const DateText = styled.Text<{ unread?: boolean }>`
  font-family: ${(props) =>
    props.unread ? 'IBMPlexSans-SemiBold' : 'IBMPlexSans-Light'};
  font-size: 13px;
  line-height: 17px;
  color: ${(props) => props.theme.shade.foreground};
`

const Title = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 20px;
  line-height: 26px;
  color: ${(props) => props.theme.shade.foreground};
  margin-bottom: 16px;
`

const Message = styled.Text`
  font-family: 'IBMPlexSans-Light';
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.theme.shade.foreground};
`

// Create title options and hook to sync translated title message
const { title, useNavigationTitle } = createNavigationTitle(
  'notificationDetail.screenTitle',
)

export const NotificationDetailScreen: NavigationFunctionComponent<NotificationDetailScreenProps> = ({
  componentId,
  id,
}) => {
  const intl = useIntl()
  const theme = useTheme()
  const notificationRes = useQuery<GetNotificationResponse>(
    GET_NOTIFICATION_QUERY,
    {
      client,
      variables: {
        id,
      },
    },
  )

  useScreenOptions(
    () => ({
      layout: {
        backgroundColor: theme.shade.background,
        componentBackgroundColor: theme.shade.background,
      },
    }),
    [theme],
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
      {/* <Button title="Send push notification" onPress={onSendPushNotification} /> */}
    </Host>
  )
}

NotificationDetailScreen.options = {
  topBar: {
    visible: false,
  },
}
