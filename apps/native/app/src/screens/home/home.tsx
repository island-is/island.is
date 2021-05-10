import React from 'react'
import { View, ScrollView } from 'react-native'
import { Badge, Heading, StatusCard, NotificationCard } from '@island.is/island-ui-native'
import logo from '../../assets/logo/logo-64w.png'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { useQuery } from '@apollo/client'
import { useTheme } from 'styled-components/native'
import { client } from '../../graphql/client'
import { testIDs } from '../../utils/test-ids'
import { useScreenOptions } from '../../contexts/theme-provider'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { ComponentRegistry } from '../../utils/navigation-registry'
import { useIntl } from '../../utils/intl'
import { useTranslatedTitle } from '../../utils/use-translated-title'
import timeOutlineIcon from '../../assets/icons/time-outline.png';
import { ListNotificationsResponse, LIST_NOTIFICATIONS_QUERY } from '../../graphql/queries/list-notifications.query'
import { useNotificationsStore } from '../../stores/notifications-store'
import { navigateToNotification } from '../../utils/deep-linking';
import { SafeAreaProvider, useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context'
import { uiStore } from '../../stores/ui-store'

function BubbleSafeArea() {
  const insets = useSafeAreaInsets();
  const frame = useSafeAreaFrame();
  uiStore.setState({ insets, frame });
  return null;
}

export const HomeScreen: NavigationFunctionComponent = ({ componentId }) => {
  const notificationsStore = useNotificationsStore();
  const theme = useTheme()
  const intl = useIntl();

  useTranslatedTitle('HOME_NAV_TITLE', 'home.screenTitle');

  useScreenOptions(
    () => ({
      bottomTab: {
        testID: testIDs.TABBAR_TAB_HOME,
        icon: theme.isDark
          ? require('../../assets/icons/tabbar-home-white.png')
          : require('../../assets/icons/tabbar-home-ios.png'),
        selectedIcon: require('../../assets/icons/tabbar-home-selected-ios.png'),

      },
    }),
    [theme, intl],
  )

  const notificationsRes = useQuery<ListNotificationsResponse>(LIST_NOTIFICATIONS_QUERY, { client });

  return (
    <>
      <ScrollView
        testID={testIDs.SCREEN_HOME}
        style={{ paddingHorizontal: 24 }}
      >
        <View>
          <Heading>{intl.formatMessage({ id: 'home.applicationsStatus' })}</Heading>
          <StatusCard
            title="Fæðingarorlof 4/6"
            icon={timeOutlineIcon}
            date={new Date()}
            description="Skipting orlofstíma"
            badge={<Badge title="Vantar gögn" />}
            progress={66}
            actions={[{ text: 'Opna umsókn', onPress() {} }]}
          />
          <Heading>{intl.formatMessage({ id: 'home.notifications' })}</Heading>
          {notificationsRes.data?.listNotifications.slice(0, 5).map(notification => (
            <NotificationCard
              key={notification.id}
              id={notification.id}
              title={notification.serviceProvider}
              message={notification.title}
              date={new Date(notification.date)}
              icon={logo}
              unread={!notificationsStore.readItems.has(notification.id)}
              onPress={() => navigateToNotification(notification, componentId)}
              actions={notification.actions?.map(action => ({
                text: action.text,
                onPress() {
                  navigateToNotification({ id: notification.id, link: action.link }, componentId);
                }
              }))}
            />
          ))}
        </View>
      </ScrollView>
      <SafeAreaProvider>
        <BubbleSafeArea />
      </SafeAreaProvider>
      <BottomTabsIndicator index={1} total={3} />
    </>
  )
}

HomeScreen.options = {
  topBar: {
    title: {
      component: {
        id: 'HOME_NAV_TITLE',
        name: ComponentRegistry.NavigationBarTitle,
        passProps: {
          title: 'Overview',
        }
      },
      alignment: 'fill'
    },
  },
}
