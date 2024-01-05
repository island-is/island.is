import { Alert, EmptyList, Skeleton, TopLine } from '@ui'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  Animated,
  FlatList,
  Image,
  ListRenderItemInfo,
  Platform,
  RefreshControl,
  View,
} from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import SpotlightSearch from 'react-native-spotlight-search'
import { useTheme } from 'styled-components/native'
import illustrationSrc from '../../assets/illustrations/le-moving-s6.png'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { useFeatureFlag } from '../../contexts/feature-flag-provider'
import {
  GenericLicenseType,
  GenericUserLicense,
  IdentityDocumentModel,
  useGetIdentityDocumentQuery,
  useListLicensesQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useActiveTabItemPress } from '../../hooks/use-active-tab-item-press'
import { usePreferencesStore } from '../../stores/preferences-store'
import { ButtonRegistry } from '../../utils/component-registry'
import { getRightButtons } from '../../utils/get-main-root'
import { testIDs } from '../../utils/test-ids'
import { WalletItem } from './components/wallet-item'

type FlatListItem =
  | GenericUserLicense
  | IdentityDocumentModel
  | { __typename: 'Skeleton'; id: string }
  | { __typename: 'Error'; id: string }

const { useNavigationOptions, getNavigationOptions } =
  createNavigationOptionHooks(
    (theme, intl, initialized) => ({
      topBar: {
        title: {
          text: intl.formatMessage({ id: 'wallet.screenTitle' }),
        },
        rightButtons: initialized ? getRightButtons({ theme } as any) : [],
        leftButtons: [
          {
            id: ButtonRegistry.ScanLicenseButton,
            testID: testIDs.TOPBAR_SCAN_LICENSE_BUTTON,
            icon: require('../../assets/icons/navbar-scan.png'),
            color: theme.color.blue400,
          },
        ],
      },
      bottomTab: {
        iconColor: theme.color.blue400,
        text: initialized
          ? intl.formatMessage({ id: 'wallet.bottomTabText' })
          : '',
      },
    }),
    {
      topBar: {
        largeTitle: {
          visible: true,
        },
        scrollEdgeAppearance: {
          active: true,
          noBorder: true,
        },
      },
      bottomTab: {
        testID: testIDs.TABBAR_TAB_WALLET,
        iconInsets: {
          bottom: -4,
        },
        icon: require('../../assets/icons/tabbar-wallet.png'),
        selectedIcon: require('../../assets/icons/tabbar-wallet-selected.png'),
      },
    },
  )

export const WalletScreen: NavigationFunctionComponent = ({ componentId }) => {
  useNavigationOptions(componentId)

  const theme = useTheme()
  const flatListRef = useRef<FlatList>(null)
  const [loading, setLoading] = useState(false)
  const loadingTimeout = useRef<NodeJS.Timeout>()
  const intl = useIntl()
  const scrollY = useRef(new Animated.Value(0)).current
  const { dismiss, dismissed } = usePreferencesStore()

  // Feature flags
  const showPassport = useFeatureFlag('isPassportEnabled', false)
  const showDisability = useFeatureFlag('isDisabilityFlagEnabled', false)
  const showPCard = useFeatureFlag('isPCardEnabled', false)

  // Query list of licenses
  const res = useListLicensesQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        includedTypes: [
          GenericLicenseType.DriversLicense,
          GenericLicenseType.AdrLicense,
          GenericLicenseType.MachineLicense,
          GenericLicenseType.FirearmLicense,
          showDisability ? GenericLicenseType.DisabilityLicense : null,
          showPCard ? GenericLicenseType.PCard : null,
        ].filter(Boolean) as GenericLicenseType[],
      },
    },
  })

  // Additional licenses
  const resPassport = useGetIdentityDocumentQuery({
    fetchPolicy: 'network-only',
  })

  useActiveTabItemPress(1, () => {
    flatListRef.current?.scrollToOffset({
      offset: -150,
      animated: true,
    })
  })

  // Filter licenses
  const licenseItems = useMemo(() => {
    if (!res.loading && !res.error) {
      return (res.data?.genericLicenses ?? []).filter(({ license }) => {
        if (license.status === 'Unknown') {
          return false
        }
        if (license.type === GenericLicenseType.DisabilityLicense) {
          return showDisability
        }
        if (license.type === GenericLicenseType.PCard) {
          return showPCard
        }
        return true
      })
    }
    return []
  }, [res, showDisability, showPCard])

  // indexing list for spotlight search IOS
  useEffect(() => {
    const indexItems = licenseItems.map((item) => {
      return {
        title: item.license.type,
        uniqueIdentifier: `/wallet/${item.license.type}`,
        contentDescription: item.license.provider.id,
        domain: 'licences',
      }
    })
    if (Platform.OS === 'ios') {
      SpotlightSearch.indexItems(indexItems)
    }
  }, [licenseItems])

  const onRefresh = useCallback(() => {
    try {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current)
      }
      setLoading(true)
      res
        .refetch()
        .then(() => {
          ;(loadingTimeout as any).current = setTimeout(() => {
            setLoading(false)
          }, 1331)
        })
        .catch(() => {
          setLoading(false)
        })
    } catch (err) {
      setLoading(false)
    }
  }, [])

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<FlatListItem>) => {
      if (item.__typename === 'Skeleton') {
        return (
          <View style={{ paddingHorizontal: 16 }}>
            <Skeleton
              active
              backgroundColor={theme.color.blue100}
              overlayColor={theme.color.blue200}
              overlayOpacity={1}
              height={111}
              style={{
                borderRadius: 16,
                marginBottom: 16,
              }}
            />
          </View>
        )
      }

      if (
        item.__typename === 'GenericUserLicense' ||
        item.__typename === 'IdentityDocumentModel'
      ) {
        return <WalletItem item={item} />
      }
      return null
    },
    [theme],
  )

  const keyExtractor = useCallback((item: FlatListItem, index: number) => {
    const fallback = String(index)
    if (item.__typename === 'GenericUserLicense') {
      return item.license.type ?? fallback
    }
    if (item.__typename === 'IdentityDocumentModel') {
      return item.number ?? fallback
    }
    return (item as { id: string })?.id ?? fallback
  }, [])

  const data = useMemo<FlatListItem[]>(() => {
    if (res.loading && !res.data) {
      return Array.from({ length: 5 }).map((_, id) => ({
        id: String(id),
        __typename: 'Skeleton',
      }))
    }
    return [
      ...licenseItems,
      ...(showPassport ? resPassport?.data?.getIdentityDocument ?? [] : []),
    ] as FlatListItem[]
  }, [licenseItems, resPassport, showPassport, res.loading, res.data])

  return (
    <>
      <Animated.FlatList
        ref={flatListRef}
        testID={testIDs.SCREEN_HOME}
        style={{
          zIndex: 9,
        }}
        contentInset={{
          bottom: 32,
        }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        scrollEventThrottle={16}
        scrollToOverflowEnabled={true}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true,
          },
        )}
        ListHeaderComponent={
          Platform.OS === 'ios' ? (
            <View style={{ marginBottom: 16 }}>
              <Alert
                type="info"
                visible={!dismissed.includes('howToUseLicence')}
                message={intl.formatMessage({ id: 'wallet.alertMessage' })}
                onClose={() => dismiss('howToUseLicence')}
              />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={{ marginTop: 80, paddingHorizontal: 16 }}>
            <EmptyList
              title={intl.formatMessage({ id: 'wallet.emptyListTitle' })}
              description={intl.formatMessage({
                id: 'wallet.emptyListDescription',
              })}
              image={
                <Image
                  source={illustrationSrc}
                  style={{ width: 146, height: 198 }}
                  resizeMode="contain"
                />
              }
            />
          </View>
        }
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
      <TopLine scrollY={scrollY} />
      <BottomTabsIndicator index={1} total={5} />
    </>
  )
}

WalletScreen.options = getNavigationOptions
