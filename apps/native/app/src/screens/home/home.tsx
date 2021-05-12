import React, { useRef, useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native'
import { Badge, Heading, StatusCard, NotificationCard, WelcomeCard, Close } from '@island.is/island-ui-native'
import logo from '../../assets/logo/logo-64w.png'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { useQuery } from '@apollo/client'
import { useTheme } from 'styled-components/native'
import { client } from '../../graphql/client'
import { testIDs } from '../../utils/test-ids'
import { useScreenOptions } from '../../contexts/theme-provider'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { useIntl } from '../../utils/intl'
import timeOutlineIcon from '../../assets/icons/time-outline.png';
import { ListNotificationsResponse, LIST_NOTIFICATIONS_QUERY } from '../../graphql/queries/list-notifications.query'
import { useNotificationsStore } from '../../stores/notifications-store'
import { navigateToNotification } from '../../utils/deep-linking';
import { SafeAreaProvider, SafeAreaView, useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context'
import { uiStore } from '../../stores/ui-store'
import illustrationSrc from '../../assets/illustrations/digital-services-m2.png'
import { authStore } from '../../stores/auth-store'
import { ViewPager } from '../../components/view-pager/view-pager'
import { createNavigationTitle } from '../../utils/create-navigation-title'
import { theme } from '@island.is/island-ui/theme'


function BubbleSafeArea() {
  const insets = useSafeAreaInsets();
  const frame = useSafeAreaFrame();
  uiStore.setState({ insets, frame });
  return null;
}

const { title, useNavigationTitle } = createNavigationTitle('home.screenTitle');

export const HomeScreen: NavigationFunctionComponent = ({ componentId }) => {
  const notificationsStore = useNotificationsStore();
  const theme = useTheme()
  const intl = useIntl();

  useNavigationTitle(componentId);

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

  const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);

  return (
    <>
      <ScrollView
        testID={testIDs.SCREEN_HOME}
      >
        {isWelcomeVisible &&
          <>
            <SafeAreaView style={{ paddingHorizontal: 16, marginTop: 16 }}>
              <Heading
                button={
                  <TouchableOpacity onPress={() => setIsWelcomeVisible(false)}>
                    <Close />
                  </TouchableOpacity>
                }
              >
                {intl.formatMessage({ id: 'home.welcomeText' })} {authStore.getState().userInfo?.name.split(' ').shift()}
              </Heading>
            </SafeAreaView>
            <ViewPager>
              <WelcomeCard
                key="card-1"
                number="1"
                description="Í þessari fyrstu útgáfu af appinu geturðu nálgast rafræn skjöl og skírteini, fengið tilkynningar og séð stöðu umsókna."
                imgSrc={illustrationSrc}
              />
              <WelcomeCard
                key="card-2"
                number="2"
                description="Í þessari fyrstu útgáfu af appinu geturðu nálgast rafræn skjöl og skírteini, fengið tilkynningar og séð stöðu umsókna."
                imgSrc={illustrationSrc}
                backgroundColor="#F2F7FF"
              />
              <WelcomeCard
                key="card-3"
                number="3"
                description="Í þessari fyrstu útgáfu af appinu geturðu nálgast rafræn skjöl og skírteini, fengið tilkynningar og séð stöðu umsókna."
                imgSrc={illustrationSrc}
              />
            </ViewPager>
          </>
        }
        <SafeAreaView style={{ paddingHorizontal: 16 }}>
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
        </SafeAreaView>
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
    title,
    // scrollEdgeAppearance: {
    //   active: true,
    //   noBorder: true,
    // },
    // largeTitle: {
    //   visible: true,
    //   fontFamily: 'IBMPlexSans-SemiBold',
    //   fontSize: 29,
    //   color: theme.color.dark400,
    // }
  }
}
