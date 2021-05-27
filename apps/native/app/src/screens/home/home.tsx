import { useQuery } from '@apollo/client'
import React, { useCallback, useRef, useState } from 'react'
import { FlatList, RefreshControl } from 'react-native'
import CodePush from 'react-native-code-push'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { AppLoading } from '../../components/app-loading/app-loading'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { client } from '../../graphql/client'
import {
  ListApplicationsResponse,
  LIST_APPLICATIONS_QUERY,
} from '../../graphql/queries/list-applications.query'
import {
  ListNotificationsResponse,
  LIST_NOTIFICATIONS_QUERY,
} from '../../graphql/queries/list-notifications.query'
import { useUiStore } from '../../stores/ui-store'
import { rightButtons } from '../../utils/get-main-root'
import { testIDs } from '../../utils/test-ids'
import { useActiveTabItemPress } from '../../utils/use-active-tab-item-press'
import { useThemedNavigationOptions } from '../../utils/use-themed-navigation-options'
import { ApplicationsModule } from './applications-module'
import { NotificationsModule } from './notifications-module'
import { OnboardingModule } from './onboarding-module'

const {
  useNavigationOptions,
  getNavigationOptions,
} = useThemedNavigationOptions(
  (theme, intl, initialized) => ({
    topBar: {
      title: {
        text: initialized ? intl.formatMessage({ id: 'home.screenTitle' }) : '',
      },
      rightButtons: initialized ? rightButtons : [],
    },
    bottomTab: {
      ...({
        accessibilityLabel: intl.formatMessage({ id: 'home.screenTitle' }),
      } as any),
      selectedIconColor: null as any,
      iconColor: null as any,
      textColor: initialized ? theme.shade.foreground : theme.shade.background,
      icon: initialized
        ? require('../../assets/icons/tabbar-home.png')
        : undefined,
      selectedIcon: initialized
      ? require('../../assets/icons/tabbar-home-selected.png')
      : undefined,
    },
  }),
  {
    topBar: {
      rightButtons: [],
    },
    bottomTab: {
      testID: testIDs.TABBAR_TAB_HOME,
      iconInsets: {
        top: 16,
        bottom: -4,
      },
      iconWidth: 42,
      iconHeight: 42,
      disableIconTint: false,
      disableSelectedIconTint: true,
    },
  },
)

export const MainHomeScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
  const flatListRef = useRef<FlatList>(null)
  const ui = useUiStore()

  useActiveTabItemPress(1, () => {
    flatListRef.current?.scrollToOffset({ offset: -100, animated: true })
  })

  const notificationsRes = useQuery<ListNotificationsResponse>(
    LIST_NOTIFICATIONS_QUERY,
    { client },
  )

  const applicationsRes = useQuery<ListApplicationsResponse>(
    LIST_APPLICATIONS_QUERY,
    { client },
  )

  const [loading, setLoading] = useState(false)

  const renderItem = useCallback(({ item }: any) => item.component, []);

  const keyExtractor = useCallback((item) => item.id, []);

  const refetch = async () => {
    setLoading(true)
    try {
      await notificationsRes.refetch()
      await applicationsRes.refetch()
    } catch (err) {
      // noop
    }
    setLoading(false)
  }

  if (!ui.initializedApp) {
    return <AppLoading />
  }

  const data = [
    {
      id: 'onboarding',
      component: <OnboardingModule />,
    },
    {
      id: 'applications',
      component: (
        <ApplicationsModule
          applications={applicationsRes.data?.applicationApplications ?? []}
          loading={applicationsRes.loading}
          componentId={componentId}
        />
      ),
    },
    {
      id: 'notifications',
      component: (
        <NotificationsModule
          items={notificationsRes.data?.listNotifications?.slice(0, 5)!}
          componentId={componentId}
        />
      ),
    },
  ]

  return (
    <>
      <BottomTabsIndicator index={1} total={3} />
      <FlatList
        ref={flatListRef}
        testID={testIDs.SCREEN_HOME}
        keyExtractor={keyExtractor}
        data={data}
        renderItem={renderItem}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      />
    </>
  )
}

MainHomeScreen.options = getNavigationOptions

export const HomeScreen = CodePush({
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  installMode: CodePush.InstallMode.ON_NEXT_RESUME,
})(MainHomeScreen)

HomeScreen.options = MainHomeScreen.options
