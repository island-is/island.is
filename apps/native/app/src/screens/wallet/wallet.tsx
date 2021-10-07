import { useQuery } from '@apollo/client'
import {
  Alert,
  EmptyList,
  LicenceCard,
  Skeleton,
  TopLine,
} from '@island.is/island-ui-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  Animated,
  FlatList,
  Image,
  View,
  Platform,
  RefreshControl,
  SafeAreaView,
  TouchableHighlight,
} from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import SpotlightSearch from 'react-native-spotlight-search'
import { useTheme } from 'styled-components/native'
import illustrationSrc from '../../assets/illustrations/le-moving-s6.png'
import agencyLogo from '../../assets/temp/agency-logo.png'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { client } from '../../graphql/client'
import {
  GenericUserLicenseStatus,
  IGenericUserLicense,
} from '../../graphql/fragments/license.fragment'
import {
  ListGenericLicensesResponse,
  LIST_GENERIC_LICENSES_QUERY,
} from '../../graphql/queries/list-licenses.query'
import { useActiveTabItemPress } from '../../hooks/use-active-tab-item-press'
import { useThemedNavigationOptions } from '../../hooks/use-themed-navigation-options'
import { navigateTo } from '../../lib/deep-linking'
import { usePreferencesStore } from '../../stores/preferences-store'
import { LicenseStatus, LicenseType } from '../../types/license-type'
import { getRightButtons } from '../../utils/get-main-root'
import { testIDs } from '../../utils/test-ids'
import { ButtonRegistry } from '../../utils/component-registry'

const {
  useNavigationOptions,
  getNavigationOptions,
} = useThemedNavigationOptions(
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

const WalletItem = React.memo(({ item }: { item: IGenericUserLicense }) => {
  return (
    <View style={{ paddingHorizontal: 16 }}>
      <TouchableHighlight
        style={{ marginBottom: 16, borderRadius: 16 }}
        onPress={() =>
          navigateTo(`/wallet/${item.license.type}`, {
            item,
            fromId: `license-${item.license.type}_source`,
            toId: `license-${item.license.type}_destination`,
          })
        }
      >
        <SafeAreaView>
          <LicenceCard
            nativeID={`license-${item.license.type}_source`}
            title={item.license.type}
            type={item.license.type as LicenseType}
            date={new Date(Number(item.fetch.updated))}
            status={
              item.license.status === GenericUserLicenseStatus.HasLicense
                ? LicenseStatus.VALID
                : LicenseStatus.NOT_VALID
            }
            agencyLogo={agencyLogo}
          />
        </SafeAreaView>
      </TouchableHighlight>
    </View>
  )
})

export const WalletScreen: NavigationFunctionComponent = ({ componentId }) => {
  useNavigationOptions(componentId)

  const theme = useTheme()
  const { dismiss, dismissed } = usePreferencesStore()
  const res = useQuery<ListGenericLicensesResponse>(
    LIST_GENERIC_LICENSES_QUERY,
    { client, fetchPolicy: 'network-only' },
  )
  const [licenseItems, setLicenseItems] = useState<any>([])
  const flatListRef = useRef<FlatList>(null)
  const alertVisible = !dismissed.includes('howToUseCertificates')
  const [loading, setLoading] = useState(false)
  const isSkeleton = res.loading && !res.data
  const loadingTimeout = useRef<number>()
  const intl = useIntl()
  const scrollY = useRef(new Animated.Value(0)).current

  useActiveTabItemPress(2, () => {
    flatListRef.current?.scrollToOffset({
      offset: -100,
      animated: true,
    })
  })

  useEffect(() => {
    if (!res.loading) {
      if (!res.error) {
        setLicenseItems(res.data?.genericLicenses || [])
      }
    }
  }, [res])

  // indexing list for spotlight search IOS
  useEffect(() => {
    const indexItems = licenseItems.map((item: any) => {
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
  }, [licenseItems.length])

  const onRefresh = useCallback(() => {
    try {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current)
      }
      setLoading(true)
      res
        .refetch()
        .then(() => {
          (loadingTimeout as any).current = setTimeout(() => {
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

  const renderItem = useCallback(({ item }) => {
    if (item.type === 'skeleton') {
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

    if (item.type === 'empty') {
      return (
        <View style={{ marginTop: 80, paddingHorizontal: 16 }}>
          <EmptyList
            title={intl.formatMessage({ id: 'wallet.emptyListTitle' })}
            description={intl.formatMessage({
              id: 'wallet.emptyListDescription',
            })}
            image={<Image source={illustrationSrc} height={198} width={146} />}
          />
        </View>
      )
    }

    if (item.type === 'alert') {
      return (
        Platform.OS === 'ios' ? (
          <View style={{ marginBottom: 16 }}>
            <Alert
              visible={alertVisible}
              type="info"
              message={intl.formatMessage({ id: 'wallet.alertMessage' })}
              onClose={() => dismiss('howToUseCertificates')}
            />
          </View>
        ) : null
      )
    }

    return <WalletItem item={item} />
  }, [])

  const keyExtractor = useCallback(
    (item: any) => item?.license?.type ?? item?.id,
    [],
  )

  const emptyItems = [{ id: '0', type: 'empty' }]
  const skeletonItems = Array.from({ length: 5 }).map((_, id) => ({
    id,
    type: 'skeleton',
  }))
  const alertItems = [{ id: '99', type: 'alert' }];

  const isEmpty =
    licenseItems.length === 0 || licenseItems?.[0]?.fetch?.status === 'Error'

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
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true,
          },
        )}
        data={isSkeleton ? skeletonItems : isEmpty ? emptyItems : [...alertItems, ...licenseItems]}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
      <TopLine scrollY={scrollY} />
      <BottomTabsIndicator index={2} total={3} />
    </>
  )
}

WalletScreen.options = getNavigationOptions
