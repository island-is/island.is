import React from 'react'
import { useQuery } from '@apollo/client'
import { Text, ActivityIndicator, FlatList } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { FormattedDate } from 'react-intl'
import styled from 'styled-components/native'
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
import { ComponentRegistry } from '../../utils/navigation-registry'
import { useTranslatedTitle } from '../../utils/use-translated-title'

const ListItem = styled.SafeAreaView`
  margin-right: 16px;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.color.blue100};
`

const Icon = styled.View`
  padding: 22px;
  align-items: center;
  justify-content: center;
`

const Logo = styled.Image`
  width: 24px;
  height: 24px;
`

const Content = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 8px;
  padding-top: 16px;
`

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 8px;
`

const Title = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  padding-right: 8px;
`

const TitleText = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => props.theme.color.dark400};
  flex: 1;
`

const Date = styled.View`
  flex-direction: row;
  align-items: center;
`

const DateText = styled.Text<{ unread?: boolean }>`
  font-family: ${(props) =>
    props.unread ? 'IBMPlexSans-SemiBold' : 'IBMPlexSans-Light'};
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => props.theme.color.dark400};
`

const Dot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${(props) => props.theme.color.blueberry400};
  margin-left: 8px;
`

const Message = styled.Text`
  font-family: 'IBMPlexSans-Light';
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.theme.color.dark400};
  padding-bottom: 8px;
`;

const Actions = styled.View`
  flex-direction: row;
  padding-bottom: 8px;
`;

const Button = styled.TouchableHighlight`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px 16px;
  background-color: ${props => props.theme.color.blue400};
  border-radius: 8px;
  margin-right: 16px;
`;

const ButtonText = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 12px;
  line-height: 16px;
  color: #fff;
`;

export const NotificationsScreen: NavigationFunctionComponent = ({ componentId }) => {
  const notificationsRes = useQuery<ListNotificationsResponse>(
    LIST_NOTIFICATIONS_QUERY,
    {
      client,
    },
  )
  const notificationsStore = useNotificationsStore();
  useTranslatedTitle('NOTIFICATIONS_NAV_TITLE', 'notifications.screenTitle')

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
        <ListItem>
          <Icon>
            <Logo source={logo} />
          </Icon>
          <Content>
            <Row>
              <Title>
                <TitleText numberOfLines={1} ellipsizeMode="tail">
                  {item.serviceProvider}
                </TitleText>
              </Title>
              <Date>
                <DateText unread={unread}>
                  <FormattedDate value={item.date} />
                </DateText>
                {unread && <Dot />}
              </Date>
            </Row>
            <Message>{item.title}</Message>
            {item.actions?.length ? (
              <Actions>
              {item.actions.map(action => (
                <Button
                  key={action.id}
                  underlayColor={theme.color.blue600}
                  onPress={() => {
                    navigateToNotification({ id: item.id, link: action.link }, componentId);
                  }}
                >
                  <ButtonText>{action.text}</ButtonText>
                </Button>
              ))}
            </Actions>
            ) : null}
          </Content>
        </ListItem>
      </TouchableHighlight>
    )
  }

  return (
    <FlatList
      style={{ marginHorizontal: 0, flex: 1 }}
      data={notifications}
      keyExtractor={(item: any) => item.id}
      renderItem={renderNotificationItem}
    />
  )
}

NotificationsScreen.options = {
  topBar: {
    title: {
      component: {
        id: 'NOTIFICATIONS_NAV_TITLE',
        name: ComponentRegistry.NavigationBarTitle,
        passProps: {
          title: 'Notifications',
        }
      },
      alignment: 'fill'
    },
  },
}
