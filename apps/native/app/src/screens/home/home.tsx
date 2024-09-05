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

import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useAndroidNotificationPermission } from '../../hooks/use-android-notification-permission'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { useNotificationsStore } from '../../stores/notifications-store'
import { useUiStore } from '../../stores/ui-store'
import { isAndroid } from '../../utils/devices'
import { getRightButtons } from '../../utils/get-main-root'
import { handleInitialNotification } from '../../utils/lifecycle/setup-notifications'
import { testIDs } from '../../utils/test-ids'
import {
  ApplicationsModule,
  useListApplicationsQuery,
  validateApplicationsInitialData,
} from './applications-module'
import { HelloModule } from './hello-module'
import {
  InboxModule,
  useListDocumentsQuery,
  validateInboxInitialData,
} from './inbox-module'
import { OnboardingModule } from './onboarding-module'
import {
  VehiclesModule,
  useListVehiclesQuery,
  validateVehiclesInitialData,
} from './vehicles-module'
import {
  preferencesStore,
  usePreferencesStore,
} from '../../stores/preferences-store'
import {
  AirDiscountModule,
  useGetAirDiscountQuery,
  validateAirDiscountInitialData,
} from './air-discount-module'
import {
  LicensesModule,
  validateLicensesInitialData,
  useGetLicensesData,
} from './licenses-module'

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
        rightButtons: initialized
          ? getRightButtons({
              icons: ['notifications', 'options'],
              theme: theme as any,
            })
          : [],
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

  useAndroidNotificationPermission()
  const syncToken = useNotificationsStore(({ syncToken }) => syncToken)
  const checkUnseen = useNotificationsStore(({ checkUnseen }) => checkUnseen)
  const getAndSetLocale = usePreferencesStore(
    ({ getAndSetLocale }) => getAndSetLocale,
  )
  const [refetching, setRefetching] = useState(false)
  const flatListRef = useRef<FlatList>(null)
  const ui = useUiStore()
  const {
    homeScreenEnableVehiclesWidget,
    homeScreenEnableAirDiscountWidget,
    homeScreenEnableApplicationsWidget,
    homeScreenEnableInboxWidget,
    homeScreenEnableLicensesWidget,
    homeScreenWidgetsInitialised,
  } = usePreferencesStore()

  const applicationsRes = useListApplicationsQuery({
    skip: !homeScreenEnableApplicationsWidget,
  })

  const inboxRes = useListDocumentsQuery({
    variables: {
      input: { page: 1, pageSize: 3 },
    },
    skip: !homeScreenEnableInboxWidget,
  })

  const licensesRes = useGetLicensesData({
    skipFetching: !homeScreenEnableLicensesWidget,
  })

  const airDiscountRes = useGetAirDiscountQuery({
    fetchPolicy: 'network-only',
    skip: !homeScreenEnableAirDiscountWidget,
  })

  const vehiclesRes = useListVehiclesQuery({
    variables: {
      input: {
        page: 1,
        pageSize: 15,
        showDeregeristered: false,
        showHistory: false,
      },
    },
    skip: !homeScreenEnableVehiclesWidget,
  })

  useEffect(() => {
    // If widgets have not been initialized, validate data and set state accordingly
    if (!homeScreenWidgetsInitialised) {
      const shouldShowInboxWidget = validateInboxInitialData({ ...inboxRes })

      const shouldShowLicensesWidget = validateLicensesInitialData({
        ...licensesRes,
      })

      const shouldShowApplicationsWidget = validateApplicationsInitialData({
        ...applicationsRes,
      })

      const shouldShowVehiclesWidget = validateVehiclesInitialData({
        ...vehiclesRes,
      })

      const shouldShowAirDiscountWidget = validateAirDiscountInitialData({
        ...airDiscountRes,
      })

      preferencesStore.setState({
        homeScreenEnableInboxWidget: shouldShowInboxWidget,
        homeScreenEnableLicensesWidget: shouldShowLicensesWidget,
        homeScreenEnableApplicationsWidget: shouldShowApplicationsWidget,
        homeScreenEnableVehiclesWidget: shouldShowVehiclesWidget,
        homeScreenEnableAirDiscountWidget: shouldShowAirDiscountWidget,
      })

      // Don't set initialized state if any of the queries are still loading
      if (
        licensesRes.loading ||
        applicationsRes.loading ||
        inboxRes.loading ||
        airDiscountRes.loading ||
        vehiclesRes.loading
      ) {
        return
      }

      preferencesStore.setState({ homeScreenWidgetsInitialised: true })
    }
  }, [
    licensesRes.loading,
    applicationsRes.loading,
    inboxRes.loading,
    airDiscountRes.loading,
    vehiclesRes.loading,
  ])

  useConnectivityIndicator({
    componentId,
    rightButtons: getRightButtons({ icons: ['notifications', 'options'] }),
    queryResult: [
      applicationsRes,
      inboxRes,
      licensesRes,
      airDiscountRes,
      vehiclesRes,
    ],
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
    syncToken()
    checkUnseen()
    // Get user locale from server
    getAndSetLocale()

    // Handle initial notification
    handleInitialNotification()
  }, [])

  const refetch = useCallback(async () => {
    setRefetching(true)

    try {
      homeScreenEnableApplicationsWidget && (await applicationsRes.refetch())
      homeScreenEnableInboxWidget && (await inboxRes.refetch())
      homeScreenEnableLicensesWidget && (await licensesRes.refetch())
      homeScreenEnableLicensesWidget && (await licensesRes.refetchPassport())
      homeScreenEnableAirDiscountWidget && (await airDiscountRes.refetch())
      homeScreenEnableVehiclesWidget && (await vehiclesRes.refetch())
    } catch (err) {
      // noop
    }

    setRefetching(false)
  }, [
    applicationsRes,
    inboxRes,
    licensesRes,
    airDiscountRes,
    vehiclesRes,
    homeScreenEnableVehiclesWidget,
    homeScreenEnableAirDiscountWidget,
    homeScreenEnableApplicationsWidget,
    homeScreenEnableLicensesWidget,
    homeScreenEnableInboxWidget,
  ])

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
      component: homeScreenEnableInboxWidget ? (
        <InboxModule {...inboxRes} />
      ) : null,
    },
    {
      id: 'licenses',
      component: homeScreenEnableLicensesWidget ? (
        <LicensesModule {...licensesRes} />
      ) : null,
    },
    {
      id: 'applications',
      component: homeScreenEnableApplicationsWidget ? (
        <ApplicationsModule {...applicationsRes} componentId={componentId} />
      ) : null,
    },
    {
      id: 'vehicles',
      component: homeScreenEnableVehiclesWidget ? (
        <VehiclesModule {...vehiclesRes} />
      ) : null,
    },
    {
      id: 'air-discount',
      component: homeScreenEnableAirDiscountWidget ? (
        <AirDiscountModule {...airDiscountRes} />
      ) : null,
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
