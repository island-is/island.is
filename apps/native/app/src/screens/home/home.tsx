import React from 'react'
import { View, ScrollView, TouchableOpacity } from 'react-native'
import { Badge, Heading, StatusCard, NotificationCard, Card } from '@island.is/island-ui-native'
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
import illustrationSrc from '../../assets/illustrations/digital-services-m2.png'
import { authStore } from '../../stores/auth-store'


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
      >
        <View style={{ paddingHorizontal: 16 }}>
          <Heading>Hæ {authStore.getState().userInfo?.name.split(' ').shift()}</Heading>
        {/* {intl.formatMessage({ id: 'home.applicationsStatus' })} */}
        </View>
        <ScrollView
          horizontal={true}
          snapToInterval={283 + 16}
          showsHorizontalScrollIndicator={false}
          snapToAlignment={'start'}
          contentInset={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 16,
          }}
          contentInsetAdjustmentBehavior="automatic"
          decelerationRate={0}
          style={{ marginBottom: 10 }}
        >
          <Card
            key="card-1"
            title="1"
            description="Í þessari fyrstu útgáfu af appinu geturðu nálgast rafræn skjöl og skírteini, fengið tilkynningar og séð stöðu umsókna."
            imgSrc={illustrationSrc}
          />
          <Card
            key="card-2"
            title="2"
            description="Í þessari fyrstu útgáfu af appinu geturðu nálgast rafræn skjöl og skírteini, fengið tilkynningar og séð stöðu umsókna."
            imgSrc={illustrationSrc}
            backgroundColor="#F2F7FF"
          />
          <Card
            key="card-3"
            title="3"
            description="Í þessari fyrstu útgáfu af appinu geturðu nálgast rafræn skjöl og skírteini, fengið tilkynningar og séð stöðu umsókna."
            imgSrc={illustrationSrc}
          />
        </ScrollView>
        <View style={{ paddingHorizontal: 16 }}>
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
