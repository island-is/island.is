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
import {
  NotificationsModule,
  useGetUserNotificationsQuery,
  validateNotificationsInitialData,
} from '@/components/home/notifications-module'
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
import { testIDs } from '@/utils/test-ids'
import * as Application from 'expo-application'
import { compare, validate } from 'compare-versions'
import { router, Stack } from 'expo-router'
import { useIntl } from 'react-intl'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'styled-components/native'
import { StackScreen } from '../../../../components/stack-screen'
import { Button, red400, Typography } from '../../../../ui'

interface ListItem {
  id: string
  component: ReactElement
}

export default function HomeScreen() {
  const intl = useIntl()
  const theme = useTheme()
  const insets = useSafeAreaInsets()
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
  const isNotificationsWidgetEnabled = useFeatureFlag(
    'isNotificationWidgetEnabled',
    false,
    null,
  )
  const isInboxWidgetDisabled = useFeatureFlag(
    'isPostholfWidgetDisabled',
    false,
    null,
  )
  const minimumVersionSupported = useFeatureFlag(
    'minimumSupportedAppVersion',
    '1.0.0',
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
  const notificationsWidgetEnabled = usePreferencesStore(
    ({ notificationsWidgetEnabled }) => notificationsWidgetEnabled,
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
    skip: !inboxWidgetEnabled || isInboxWidgetDisabled !== false,
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

  const notificationsRes = useGetUserNotificationsQuery({
    variables: {
      input: { limit: 3 },
      locale: useLocale(),
    },
    skip: !notificationsWidgetEnabled || !isNotificationsWidgetEnabled,
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
        licensesWidgetEnabled: shouldShowLicensesWidget,
        applicationsWidgetEnabled: shouldShowApplicationsWidget,
        vehiclesWidgetEnabled: shouldShowVehiclesWidget,
        airDiscountWidgetEnabled: shouldShowAirDiscountWidget,
        ...(isInboxWidgetDisabled !== null && {
          inboxWidgetEnabled: isInboxWidgetDisabled
            ? false
            : shouldShowInboxWidget,
        }),
        ...(isAppointmentsEnabled !== null && {
          appointmentsWidgetEnabled: isAppointmentsEnabled
            ? validateAppointmentsInitialData({ ...appointmentsRes })
            : false,
        }),
        ...(isNotificationsWidgetEnabled !== null && {
          notificationsWidgetEnabled: isNotificationsWidgetEnabled
            ? validateNotificationsInitialData({ ...notificationsRes })
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
        notificationsRes.loading ||
        isAppointmentsEnabled === null ||
        isNotificationsWidgetEnabled === null ||
        isInboxWidgetDisabled === null
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
    notificationsRes.loading,
    widgetsInitialised,
    inboxRes,
    licensesRes,
    applicationsRes,
    vehiclesRes,
    airDiscountRes,
    appointmentsRes,
    notificationsRes,
    isAppointmentsEnabled,
    isNotificationsWidgetEnabled,
    isInboxWidgetDisabled,
  ])

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ListItem>) => item.component,
    [],
  )
  const keyExtractor = useCallback((item: ListItem) => item.id, [])

  useEffect(() => {
    syncToken()
    checkUnseen()
  }, [])

  // Check if the app version is below the minimum supported version and navigate to the update screen if so
  useEffect(() => {
    const currentVersion = Application.nativeApplicationVersion
    if (
      currentVersion &&
      validate(minimumVersionSupported) &&
      validate(currentVersion) &&
      compare(minimumVersionSupported, currentVersion, '>')
    ) {
      router.navigate({
        pathname: '/update-app',
        params: { closable: String(false) },
      })
    }
  }, [minimumVersionSupported])

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
        inboxWidgetEnabled &&
          isInboxWidgetDisabled === false &&
          inboxRes.refetch(),
        licensesWidgetEnabled && licensesRes.refetch(),
        airDiscountWidgetEnabled && airDiscountRes.refetch(),
        vehiclesWidgetEnabled && vehiclesRes.refetch(),
        appointmentsWidgetEnabled &&
          isAppointmentsEnabled &&
          appointmentsRes.refetch(),
        notificationsWidgetEnabled &&
          isNotificationsWidgetEnabled &&
          notificationsRes.refetch(),
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
    notificationsRes,
    vehiclesWidgetEnabled,
    airDiscountWidgetEnabled,
    applicationsWidgetEnabled,
    licensesWidgetEnabled,
    inboxWidgetEnabled,
    appointmentsWidgetEnabled,
    notificationsWidgetEnabled,
    isAppointmentsEnabled,
    isNotificationsWidgetEnabled,
    isInboxWidgetDisabled,
  ])

  const data = [
    {
      id: 'hello',
      component: <HelloModule />,
    },
    {
      id: 'notifications',
      component:
        notificationsWidgetEnabled && isNotificationsWidgetEnabled ? (
          <NotificationsModule {...notificationsRes} />
        ) : null,
    },
    {
      id: 'inbox',
      component:
        inboxWidgetEnabled && isInboxWidgetDisabled === false ? (
          <InboxModule {...inboxRes} />
        ) : null,
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
          notificationsRes.networkStatus,
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
        style={{
          flex: 1,
          backgroundColor:
            Platform.OS === 'ios' ? theme.color.blue100 : undefined,
        }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + (Platform.OS === 'android' ? 0 : 30),
          backgroundColor:
            Platform.OS === 'ios' ? theme.color.white : undefined,
          flexGrow: Platform.OS === 'ios' ? 1 : undefined,
        }}
        refreshControl={
          <RefreshControl refreshing={refetching} onRefresh={refetch} />
        }
        ListFooterComponent={
          <View
            style={{
              marginHorizontal: theme.spacing[2],
              marginTop: theme.spacing[2],
            }}
          >
            <Button
              title={intl.formatMessage({ id: 'homeOptions.heading.title' })}
              isOutlined
              icon={require('@/assets/icons/options.png')}
              onPress={() => router.navigate('/homescreen-options')}
            />
          </View>
        }
      />
    </>
  )
}
