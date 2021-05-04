import React from 'react';
import { useQuery } from "@apollo/client";
import { Text, ActivityIndicator, Button, View } from "react-native";
import { NavigationFunctionComponent } from "react-native-navigation";
import { FormattedDate } from 'react-intl';
import styled from 'styled-components/native';
import { scheduleNotificationAsync, setNotificationCategoryAsync } from 'expo-notifications';
import logo from '../../assets/logo/logo-64w.png'
import { client } from "../../graphql/client";
import { GET_NOTIFICATION_QUERY, GetNotificationResponse } from "../../graphql/queries/get-notification.query";
import { useTranslatedTitle } from '../../utils/use-translated-title';
import { ComponentRegistry } from '../../utils/navigation-registry';

interface NotificationDetailScreenProps {
  id: string;
}

const Host = styled.SafeAreaView`
  margin-left: 24px;
  margin-right: 24px;
  flex: 1;
  margin-top: 16px;
`;

const Logo = styled.Image`
  width: 16px;
  height: 16px;
  margin-right: 8px;
`;

const Header = styled.View`
  flex-direction: row;
  padding-bottom: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.color.blue100};
  margin-bottom: 16px;
`;

const ServiceProvider = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  padding-right: 8px;
`;


const ServiceProviderText = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 12px;
  line-height: 16px;
  color: ${props => props.theme.color.dark400};
  flex: 1;
`;

const DateText = styled.Text<{ unread?: boolean }>`
  font-family: ${props => props.unread ? 'IBMPlexSans-SemiBold' : 'IBMPlexSans-Light'};
  font-size: 12px;
  line-height: 16px;
  color: ${props => props.theme.color.dark400};
`;

const Title = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 20px;
  line-height: 26px;
  color: ${props => props.theme.color.dark400};
  margin-bottom: 16px;
`;

const Message = styled.Text`
  font-family: 'IBMPlexSans-Light';
  font-size: 16px;
  line-height: 24px;
  color: ${props => props.theme.color.dark400};
`;

export const NotificationDetailScreen: NavigationFunctionComponent<NotificationDetailScreenProps> = ({ id }) => {

  const notificationRes = useQuery<GetNotificationResponse>(GET_NOTIFICATION_QUERY, {
    client,
    variables: {
      id,
    }
  });

  useTranslatedTitle('NOTIFICATIONDETAIL_NAV_TITLE', 'notificationDetail.screenTitle')

  if (notificationRes.loading) {
    return <ActivityIndicator />
  }

  if (!notificationRes.data) {
    return <Text>Not found</Text>;
  }

  const notification = notificationRes.data?.Notification!;

  const onSendPushNotification = () => {
    const categoryIdentifier = notification.actions.length
      ? `${notification.id}_${notification.actions.map(action => action.id).join('_')}`
      : undefined;

    if (categoryIdentifier) {
      setNotificationCategoryAsync(categoryIdentifier, notification.actions.map(action => ({
        buttonTitle: action.text,
        identifier: action.id,
      })));
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
    <Host>
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
      <Title>{notification.title}</Title>
      <Message>{notification.message}</Message>
      <View style={{ flex: 1 }} />
      <Button title="Send push notification" onPress={onSendPushNotification} />
    </Host>
  );
}

NotificationDetailScreen.options = {
  topBar: {
    title: {
      component: {
        id: 'NOTIFICATIONDETAIL_NAV_TITLE',
        name: ComponentRegistry.NavigationBarTitle,
        passProps: {
          title: 'Notification',
        }
      },
      alignment: 'center'
    },
    rightButtons: [{
      id: 'close',
      icon: {
        system: 'xmark.circle.fill',
      }
    }]
  },
}
