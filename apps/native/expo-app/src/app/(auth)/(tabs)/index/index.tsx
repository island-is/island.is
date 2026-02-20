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
  RefreshControl,
} from 'react-native'

import { TopLine } from '@/ui'
import { useAndroidNotificationPermission } from '@/hooks/use-android-notification-permission'
import { useDeepLinkHandling } from '@/hooks/use-deep-link-handling'
import { useNotificationsStore } from '@/stores/notifications-store'
import {
  preferencesStore,
  usePreferencesStore,
} from '@/stores/preferences-store'
import { needsToUpdateAppVersion } from '@/utils/minimum-app-version'
import { testIDs } from '@/utils/test-ids'
import { navigateTo } from '@/lib/deep-linking'
import {
  AirDiscountModule,
  useGetAirDiscountQuery,
  validateAirDiscountInitialData,
} from '@/screens/home/air-discount-module'
import {
  ApplicationsModule,
  useListApplicationsQuery,
  validateApplicationsInitialData,
} from '@/screens/home/applications-module'
import { HelloModule } from '@/screens/home/hello-module'
import {
  InboxModule,
  useListDocumentsQuery,
  validateInboxInitialData,
} from '@/screens/home/inbox-module'
import {
  LicensesModule,
  useListLicensesQuery,
  validateLicensesInitialData,
} from '@/screens/home/licenses-module'
import { OnboardingModule } from '@/screens/home/onboarding-module'
import {
  useListVehiclesV2Query,
  validateVehiclesInitialData,
  VehiclesModule,
} from '@/screens/home/vehicles-module'
import { INCLUDED_LICENSE_TYPES } from '@/screens/wallet-pass/wallet-pass.constants'
import { useFeatureFlag } from '@/components/providers/feature-flag-provider'
import { GenericLicenseType, useGetProfileQuery } from '@/graphql/types/schema'
import { useLocale } from '@/hooks/use-locale'
import { Stack } from 'expo-router'

interface ListItem {
  id: string
  component: ReactElement
}

export default function HomeScreen() {
  const userProfile = useGetProfileQuery({
    fetchPolicy: 'cache-first',
  })
  const { locale: userProfileLocale, documentNotifications } =
    userProfile.data?.getUserProfile ?? {}

  useAndroidNotificationPermission(documentNotifications)
  const syncToken = useNotificationsStore(({ syncToken }) => syncToken)
  const checkUnseen = useNotificationsStore(({ checkUnseen }) => checkUnseen)
  const setLocale = usePreferencesStore(({ setLocale }) => setLocale)
  const isIdentityDocumentEnabled = useFeatureFlag(
    'isIdentityDocumentEnabled',
    false,
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

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ListItem>) => item.component,
    [],
  )
  const keyExtractor = useCallback((item: ListItem) => item.id, [])

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
      // @todo remove componentId once applications-module is migrated
      component: applicationsWidgetEnabled ? (
        <ApplicationsModule {...applicationsRes} componentId="" />
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
