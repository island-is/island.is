import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  Animated,
  Image,
  ListRenderItemInfo,
  Platform,
  Pressable,
  RefreshControl,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native'
import { LiquidGlass } from 'react-native-platform-components'
import {
  AirDiscountModule,
  useGetAirDiscountQuery,
  validateAirDiscountInitialData,
} from '@/components/home/air-discount-module'
import {
  ApplicationsModule,
  useListApplicationsQuery,
  validateApplicationsInitialData,
} from '@/components/home/applications-module'
import { HelloModule } from '@/components/home/hello-module'
import {
  InboxModule,
  useListDocumentsQuery,
  validateInboxInitialData,
} from '@/components/home/inbox-module'
import {
  LicensesModule,
  useListLicensesQuery,
  validateLicensesInitialData,
} from '@/components/home/licenses-module'
import { OnboardingModule } from '@/components/home/onboarding-module'
import {
  useListVehiclesV2Query,
  validateVehiclesInitialData,
  VehiclesModule,
} from '@/components/home/vehicles-module'
import {
  AppointmentsModule,
  useGetAppointmentsQuery,
  validateAppointmentsInitialData,
} from '@/components/home/appointments-module'
import { BaseAppointmentStatuses } from '@/constants/base-appointment-statuses'
import { useFeatureFlag } from '@/components/providers/feature-flag-provider'
import { INCLUDED_LICENSE_TYPES } from '@/constants/wallet.constants'
import { GenericLicenseType, useGetProfileQuery } from '@/graphql/types/schema'
import { useAndroidNotificationPermission } from '@/hooks/use-android-notification-permission'
import { useDeepLinkHandling } from '@/hooks/use-deep-link-handling'
import { useLocale } from '@/hooks/use-locale'
import { useNotificationsStore } from '@/stores/notifications-store'
import {
  preferencesStore,
  usePreferencesStore,
} from '@/stores/preferences-store'
import { needsToUpdateAppVersion } from '@/utils/minimum-app-version'
import { testIDs } from '@/utils/test-ids'
import { router, Stack } from 'expo-router'
import { useIntl } from 'react-intl'
import { StackScreen } from '../../../../components/stack-screen'
import { blue400, red400, Typography } from '../../../../ui'

interface ListItem {
  id: string
  component: ReactElement
}

export default function HomeScreen() {
  const intl = useIntl()
  const userProfile = useGetProfileQuery({
    fetchPolicy: 'cache-first',
  })
  const { locale: userProfileLocale, documentNotifications } =
    userProfile.data?.getUserProfile ?? {}

  useAndroidNotificationPermission(documentNotifications)
  const syncToken = useNotificationsStore(({ syncToken }) => syncToken)
  const checkUnseen = useNotificationsStore(({ checkUnseen }) => checkUnseen)
  const unseenCount = useNotificationsStore(({ unseenCount }) => unseenCount)
  const setLocale = usePreferencesStore(({ setLocale }) => setLocale)
  const isIdentityDocumentEnabled = useFeatureFlag(
    'isIdentityDocumentEnabled',
    false,
  )
  const isAppointmentsEnabled = useFeatureFlag(
    'isAppointmentsEnabled',
    false,
    null,
  )
  const [refetching, setRefetching] = useState(false)

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
  const appointmentsWidgetEnabled = usePreferencesStore(
    ({ appointmentsWidgetEnabled }) => appointmentsWidgetEnabled,
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

  const licensesRes = useListLicensesQuery({
    variables: {
      input: {
        includedTypes: [
          ...INCLUDED_LICENSE_TYPES,
          ...(isIdentityDocumentEnabled
            ? [GenericLicenseType.IdentityDocument]
            : []),
        ],
      },
      locale: useLocale(),
    },
    fetchPolicy: 'cache-first',
    skip: !licensesWidgetEnabled,
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

  const appointmentsFrom = useRef(new Date()).current
  const appointmentsRes = useGetAppointmentsQuery({
    variables: {
      from: appointmentsFrom.toISOString(),
      status: BaseAppointmentStatuses,
    },
    fetchPolicy: 'network-only',
    skip: !appointmentsWidgetEnabled || !isAppointmentsEnabled,
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
        ...(isAppointmentsEnabled !== null && {
          appointmentsWidgetEnabled: isAppointmentsEnabled
            ? validateAppointmentsInitialData({ ...appointmentsRes })
            : false,
        }),
      })

      // Don't set initialized state if any of the queries are still loading
      // or the appointments feature flag has not resolved yet
      if (
        licensesRes.loading ||
        applicationsRes.loading ||
        inboxRes.loading ||
        airDiscountRes.loading ||
        vehiclesRes.loading ||
        appointmentsRes.loading ||
        isAppointmentsEnabled === null
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
    appointmentsRes.loading,
    widgetsInitialised,
    inboxRes,
    licensesRes,
    applicationsRes,
    vehiclesRes,
    airDiscountRes,
    appointmentsRes,
    isAppointmentsEnabled,
  ])

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ListItem>) => item.component,
    [],
  )
  const keyExtractor = useCallback((item: ListItem) => item.id, [])

  const isAppUpdateRequired = useCallback(async () => {
    const needsUpdate = await needsToUpdateAppVersion()
    if (needsUpdate) {
      router.navigate({
        pathname: '/update-app',
        params: { closable: String(false) },
      })
    }
  }, [])

  useEffect(() => {
    // Sync push tokens and unseen notifications
    syncToken()
    checkUnseen()
    // Check if upgrade wall should be shown
    isAppUpdateRequired()
  }, [])

  useEffect(() => {
    if (!userProfileLocale) {
      return
    }

    setLocale(userProfileLocale === 'en' ? 'en-US' : 'is-IS')
  }, [userProfileLocale, setLocale])

  const refetch = useCallback(async () => {
    setRefetching(true)

    try {
      const promises = [
        applicationsWidgetEnabled && applicationsRes.refetch(),
        inboxWidgetEnabled && inboxRes.refetch(),
        licensesWidgetEnabled && licensesRes.refetch(),
        airDiscountWidgetEnabled && airDiscountRes.refetch(),
        vehiclesWidgetEnabled && vehiclesRes.refetch(),
        appointmentsWidgetEnabled &&
          isAppointmentsEnabled &&
          appointmentsRes.refetch(),
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
    appointmentsRes,
    vehiclesWidgetEnabled,
    airDiscountWidgetEnabled,
    applicationsWidgetEnabled,
    licensesWidgetEnabled,
    inboxWidgetEnabled,
    appointmentsWidgetEnabled,
    isAppointmentsEnabled,
  ])

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
      id: 'appointments',
      component:
        appointmentsWidgetEnabled && isAppointmentsEnabled ? (
          <AppointmentsModule {...appointmentsRes} />
        ) : null,
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
        <ApplicationsModule {...applicationsRes} />
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
      <StackScreen
        networkStatus={[
          applicationsRes.networkStatus,
          inboxRes.networkStatus,
          licensesRes.networkStatus,
          airDiscountRes.networkStatus,
          vehiclesRes.networkStatus,
          appointmentsRes.networkStatus,
        ]}
        options={{
          headerTitle: '',
          headerLeftItems: [
            {
              type: 'custom',
              element: (
                <Image source={require('@/assets/logo/home-logo.png')} />
              ),
              hidesSharedBackground: true,
            },
          ],
          headerRightItems: [
            {
              identifier: 'options',
              type: 'button',
              label: 'Options',
              icon: {
                type: 'image',
                source: require('@/assets/icons/options.png'),
              },
              tintColor: blue400,
              onPress: () => router.navigate('/homescreen-options'),
              sharesBackground: false,
            },
            {
              type: 'custom',
              element: (
                <Pressable onPress={() => router.navigate('/notifications')}>
                  {Platform.OS === 'ios' ? (
                    <LiquidGlass
                      cornerRadius={24}
                      ios={{ interactive: true, effect: 'regular' }}
                      style={{
                        width: 46,
                        height: 46,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Image
                        source={require('@/assets/icons/notifications.png')}
                        style={{ width: 24, height: 24 }}
                      />
                    </LiquidGlass>
                  ) : (
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Image
                        source={require('@/assets/icons/notifications.png')}
                        style={{ width: 24, height: 24 }}
                      />
                    </View>
                  )}
                  {unseenCount > 0 ? (
                    <View
                      style={{
                        position: 'absolute',
                        right: Platform.select({ ios: -4, android: 0 }),
                        top: Platform.select({ ios: -4, android: 0 }),
                        backgroundColor: red400,
                        borderRadius: 8,
                        paddingVertical: 2,
                        paddingHorizontal: 4,
                      }}
                    >
                      <Typography variant="eyebrow" color="white">
                        {unseenCount}
                      </Typography>
                    </View>
                  ) : null}
                </Pressable>
              ),
              hidesSharedBackground: true,
            },
          ],
        }}
      />
      <Animated.FlatList
        testID={testIDs.SCREEN_HOME}
        keyExtractor={keyExtractor}
        data={data}
        renderItem={renderItem}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refetching} onRefresh={refetch} />
        }
      />
    </>
  )
}
