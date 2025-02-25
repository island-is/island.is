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

import { TopLine } from '../../ui'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useAndroidNotificationPermission } from '../../hooks/use-android-notification-permission'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { useDeepLinkHandling } from '../../hooks/use-deep-link-handling'
import { useNotificationsStore } from '../../stores/notifications-store'
import {
  preferencesStore,
  usePreferencesStore,
} from '../../stores/preferences-store'
import { useUiStore } from '../../stores/ui-store'
import { isAndroid } from '../../utils/devices'
import { needsToUpdateAppVersion } from '../../utils/minimum-app-version'
import { getRightButtons } from '../../utils/get-main-root'
import { testIDs } from '../../utils/test-ids'
import { navigateTo } from '../../lib/deep-linking'
import {
  AirDiscountModule,
  useGetAirDiscountQuery,
  validateAirDiscountInitialData,
} from './air-discount-module'
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
import {
  LicensesModule,
  useGetLicensesData,
  validateLicensesInitialData,
} from './licenses-module'
import { OnboardingModule } from './onboarding-module'
import {
  useListVehiclesV2Query,
  validateVehiclesInitialData,
  VehiclesModule,
} from './vehicles-module'

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
  const vehiclesWidgetEnabled = usePreferencesStore(
    ({ vehiclesWidgetEnabled }) => vehiclesWidgetEnabled,
  )
  const inboxWidgetEnabled = usePreferencesStore(
    ({ inboxWidgetEnabled }) => inboxWidgetEnabled,
  )
  const licensesWidgetEnabled = usePreferencesStore(
    ({ licensesWidgetEnabled }) => licensesWidgetEnabled,
  )
  const applicationsWidgetEnabled = usePreferencesStore(
    ({ applicationsWidgetEnabled }) => applicationsWidgetEnabled,
  )
  const airDiscountWidgetEnabled = usePreferencesStore(
    ({ airDiscountWidgetEnabled }) => airDiscountWidgetEnabled,
  )
  const widgetsInitialised = usePreferencesStore(
    ({ widgetsInitialised }) => widgetsInitialised,
  )

  useDeepLinkHandling()

  const applicationsRes = useListApplicationsQuery({
    skip: !applicationsWidgetEnabled,
  })

  const inboxRes = useListDocumentsQuery({
    variables: {
      input: { page: 1, pageSize: 3 },
    },
    skip: !inboxWidgetEnabled,
  })

  const licensesRes = useGetLicensesData({
    skipFetching: !licensesWidgetEnabled,
  })

  const airDiscountRes = useGetAirDiscountQuery({
    fetchPolicy: 'network-only',
    skip: !airDiscountWidgetEnabled,
  })

  const vehiclesRes = useListVehiclesV2Query({
    variables: {
      input: {
        page: 1,
        pageSize: 15,
      },
    },
    fetchPolicy: 'cache-first',
    skip: !vehiclesWidgetEnabled,
  })

  useEffect(() => {
    // If widgets have not been initialized, validate data and set state accordingly
    if (!widgetsInitialised) {
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
        inboxWidgetEnabled: shouldShowInboxWidget,
        licensesWidgetEnabled: shouldShowLicensesWidget,
        applicationsWidgetEnabled: shouldShowApplicationsWidget,
        vehiclesWidgetEnabled: shouldShowVehiclesWidget,
        airDiscountWidgetEnabled: shouldShowAirDiscountWidget,
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

      preferencesStore.setState({ widgetsInitialised: true })
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

  const isAppUpdateRequired = useCallback(async () => {
    const needsUpdate = await needsToUpdateAppVersion()
    if (needsUpdate) {
      navigateTo('/update-app', { closable: false })
    }
  }, [])

  useEffect(() => {
    // Sync push tokens and unseen notifications
    syncToken()
    checkUnseen()
    // Get user locale from server
    getAndSetLocale()
    // Check if upgrade wall should be shown
    isAppUpdateRequired()
  }, [])

  const refetch = useCallback(async () => {
    setRefetching(true)

    try {
      const promises = [
        applicationsWidgetEnabled && applicationsRes.refetch(),
        inboxWidgetEnabled && inboxRes.refetch(),
        licensesWidgetEnabled && licensesRes.refetch(),
        licensesWidgetEnabled && licensesRes.refetchPassport(),
        airDiscountWidgetEnabled && airDiscountRes.refetch(),
        vehiclesWidgetEnabled && vehiclesRes.refetch(),
      ].filter(Boolean)

      await Promise.all(promises)
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
    vehiclesWidgetEnabled,
    airDiscountWidgetEnabled,
    applicationsWidgetEnabled,
    licensesWidgetEnabled,
    inboxWidgetEnabled,
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
      component: inboxWidgetEnabled ? <InboxModule {...inboxRes} /> : null,
    },
    {
      id: 'licenses',
      component: licensesWidgetEnabled ? (
        <LicensesModule {...licensesRes} />
      ) : null,
    },
    {
      id: 'applications',
      component: applicationsWidgetEnabled ? (
        <ApplicationsModule {...applicationsRes} componentId={componentId} />
      ) : null,
    },
    {
      id: 'vehicles',
      component: vehiclesWidgetEnabled ? (
        <VehiclesModule {...vehiclesRes} />
      ) : null,
    },
    {
      id: 'air-discount',
      component: airDiscountWidgetEnabled ? (
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
