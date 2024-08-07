import { TopLine } from '@ui'
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  Animated,
  FlatList,
  ListRenderItemInfo,
  Platform,
  RefreshControl,
} from 'react-native'
import CodePush from 'react-native-code-push'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import {
  Application,
  useListApplicationsQuery,
  useListDocumentsQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { useNotificationsStore } from '../../stores/notifications-store'
import { useUiStore } from '../../stores/ui-store'
import { isAndroid } from '../../utils/devices'
import { getRightButtons } from '../../utils/get-main-root'
import { testIDs } from '../../utils/test-ids'
import { ApplicationsModule } from './applications-module'
import { OnboardingModule } from './onboarding-module'
import { HelloModule } from './hello-module'
import { InboxModule } from './inbox-module'

interface ListItem {
  id: string
  component: ReactElement
}

const iconInsets = {
  top: Platform.OS === 'ios' && Platform.isPad ? 8 : 16,
  bottom: Platform.OS === 'ios' && Platform.isPad ? 8 : -4,
}

const { useNavigationOptions, getNavigationOptions } =
  createNavigationOptionHooks(
    (theme, intl, initialized) => ({
      topBar: {
        rightButtons: initialized ? getRightButtons({ theme } as any) : [],
      },
      bottomTab: {
        ...({
          accessibilityLabel: intl.formatMessage({ id: 'home.screenTitle' }),
        } as any),
        // selectedIconColor: null as any,
        // iconColor: null as any,
        textColor: initialized
          ? isAndroid
            ? theme.shade.foreground
            : { light: 'black', dark: 'white' }
          : theme.shade.background,
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
        scrollEdgeAppearance: {
          active: true,
          noBorder: true,
        },
      },
      bottomTab: {
        testID: testIDs.TABBAR_TAB_HOME,
        iconInsets,
        disableIconTint: false,
        disableSelectedIconTint: true,
        iconColor: null as any,
        selectedIconColor: null as any,
      },
    },
  )

export const MainHomeScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)

  const syncToken = useNotificationsStore(({ syncToken }) => syncToken)
  const checkUnseen = useNotificationsStore(({ checkUnseen }) => checkUnseen)
  const [refetching, setRefetching] = useState(false)
  const flatListRef = useRef<FlatList>(null)
  const ui = useUiStore()

  const applicationsRes = useListApplicationsQuery()
  const inboxRes = useListDocumentsQuery({
    variables: { input: { page: 1, pageSize: 3 } },
  })

  useConnectivityIndicator({
    componentId,
    rightButtons: getRightButtons(),
    queryResult: applicationsRes,
    refetching,
  })

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ListItem>) => item.component,
    [],
  )
  const keyExtractor = useCallback((item: ListItem) => item.id, [])
  const scrollY = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Sync push tokens and unseen notifications
    void syncToken()
    void checkUnseen()
  }, [])

  const refetch = useCallback(async () => {
    setRefetching(true)

    try {
      await applicationsRes.refetch()
    } catch (err) {
      // noop
    }

    setRefetching(false)
  }, [applicationsRes])

  if (!ui.initializedApp) {
    return null
  }

  const data = [
    {
      id: 'hello',
      component: <HelloModule />,
    },
    {
      id: 'onboarding',
      component: <OnboardingModule />,
    },
    {
      id: 'inbox',
      component: (
        <InboxModule
          documents={inboxRes.data?.documentsV2?.data ?? []}
          loading={inboxRes.loading}
        />
      ),
    },
    {
      id: 'applications',
      component: (
        <ApplicationsModule
          applications={
            (applicationsRes.data?.applicationApplications ??
              []) as Application[]
          }
          loading={applicationsRes.loading}
          componentId={componentId}
        />
      ),
    },
  ].filter(Boolean) as Array<{
    id: string
    component: React.JSX.Element
  }>

  return (
    <>
      <Animated.FlatList
        ref={flatListRef}
        testID={testIDs.SCREEN_HOME}
        keyExtractor={keyExtractor}
        contentInset={{
          bottom: 32,
        }}
        data={data}
        renderItem={renderItem}
        style={{ flex: 1 }}
        scrollEventThrottle={16}
        scrollToOverflowEnabled={true}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true,
          },
        )}
        refreshControl={
          <RefreshControl refreshing={refetching} onRefresh={refetch} />
        }
      />
      <TopLine scrollY={scrollY} />

      <BottomTabsIndicator index={2} total={5} />
    </>
  )
}

MainHomeScreen.options = getNavigationOptions

export const HomeScreen = CodePush({
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  installMode: CodePush.InstallMode.ON_NEXT_RESUME,
})(MainHomeScreen)

HomeScreen.options = MainHomeScreen.options
