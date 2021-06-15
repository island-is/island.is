import { useQuery } from '@apollo/client'
import {
  Alert,
  EmptyList,
  LicenceCard,
  Skeleton,
} from '@island.is/island-ui-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { IntlShape, useIntl } from 'react-intl'
import {
  Animated,
  FlatList,
  Image,
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
import { IGenericUserLicense } from '../../graphql/fragments/license.fragment'
import { ListGenericLicensesResponse, LIST_GENERIC_LICENSES_QUERY } from '../../graphql/queries/list-licenses.query'
import { useActiveTabItemPress } from '../../hooks/use-active-tab-item-press'
import { useThemedNavigationOptions } from '../../hooks/use-themed-navigation-options'
import { navigateTo } from '../../lib/deep-linking'
import { authStore } from '../../stores/auth-store'
import { usePreferencesStore } from '../../stores/preferences-store'
import { LicenseStatus, LicenseType } from '../../types/license-type'
import { testIDs } from '../../utils/test-ids'

const {
  useNavigationOptions,
  getNavigationOptions,
} = useThemedNavigationOptions(
  (theme, intl, initialized) => ({
    topBar: {
      title: {
        text: intl.formatMessage({ id: 'wallet.screenTitle' }),
      },
    },
    bottomTab: {
      iconColor: theme.color.blue400,
      text: initialized
        ? intl.formatMessage({ id: 'wallet.bottomTabText' })
        : '',
    },
  }),
  {
    topBar: {},
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
          date={item.fetch.updated}
          status={item.license.status as LicenseStatus}
          agencyLogo={agencyLogo}
        />
      </SafeAreaView>
    </TouchableHighlight>
  )
})

export function getMockLicenseItem(intl: IntlShape) {
  const { userInfo } = authStore.getState()
  const nationalId = userInfo?.nationalId || ''
  const lastChar = nationalId.substr(-1)
  const year =
    (lastChar === '9' ? 1900 : 2000) + Number(nationalId.substr(4, 2))
  const birthDate = new Date();
  birthDate.setFullYear(year);
  birthDate.setMonth(Number(nationalId.substr(2, 2)) - 1)
  birthDate.setDate(Number(nationalId.substr(0, 2)));
  const licenseStart = new Date(birthDate)
  licenseStart.setFullYear(licenseStart.getFullYear() + 17)
  const licenseEnd = new Date(licenseStart)
  licenseEnd.setFullYear(licenseEnd.getFullYear() + 50)

  return {
    nationalId: userInfo?.nationalId,
    license: {
      type: 'DriversLicense',
      provider: {
        id: 'NationalPoliceCommissioner',
      },
      pkpass: true,
      timeout: 1,
      status: 'VALID',
    },
    pkpassUrl: '',
    fetch: {
      status: 'UPDATED',
      updated: new Date().toJSON(),
    },
    payload: {
      data: [
        {
          type: 'Value',
          name: null,
          label: '2. Eiginnafn 1. Kenninafn',
          value: userInfo?.name,
          fields: null,
        },
        {
          type: 'Value',
          name: null,
          label: '3. Fæðingardagur og fæðingarstaður',
          value: `${intl.formatDate(birthDate, { dateStyle: 'medium' })}, ${userInfo?.nat}`,
          fields: null,
        },
        {
          type: 'Group',
          name: null,
          label: null,
          value: null,
          fields: [
            {
              type: 'Value',
              name: null,
              label: '4a. Útgáfudagur',
              value: licenseStart,
              fields: null,
            },
            {
              type: 'Value',
              name: null,
              label: '4b. Lokadagur',
              value: licenseEnd,
              fields: null,
            },
            {
              type: 'Value',
              name: null,
              label: '5. Númer',
              value: '00000000',
              fields: null,
            },
          ],
        },
        {
          type: 'Value',
          name: null,
          label: '4c. Nafn útgefanda',
          value: 'Sýslumaðurinn á höfuðborgarsvæðinu',
          fields: null,
        },
        {
          type: 'Value',
          name: null,
          label: '4d. Kennitala',
          value: `${nationalId.substr(0, 6)}-${nationalId.substr(-4)}`,
          fields: null,
        },
      ],
    },
  }
}

export const WalletScreen: NavigationFunctionComponent = ({ componentId }) => {
  useNavigationOptions(componentId)

  const theme = useTheme()
  const { dismiss, dismissed } = usePreferencesStore()
  const res = useQuery<ListGenericLicensesResponse>(LIST_GENERIC_LICENSES_QUERY, { client })
  const [licenseItems, setLicenseItems] = useState<any>([])
  const flatListRef = useRef<FlatList>(null)
  const alertVisible = !dismissed.includes('howToUseCertificates')
  const [loading, setLoading] = useState(true)
  const isSkeleton = res.loading && !res.data
  const loadingTimeout = useRef<NodeJS.Timeout>()
  const intl = useIntl()

  useActiveTabItemPress(2, () => {
    flatListRef.current?.scrollToOffset({
      offset: -100,
      animated: true,
    })
  })

  useEffect(() => {
    if (!res.loading) {
      if (res.error) {
        // overwrite thing with mock user license
        setLicenseItems([getMockLicenseItem(intl)])
      } else {
        setLicenseItems(res.data?.genericLicenses || [])
      }
      setLoading(false)
    }
  }, [res.loading, res.error])

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

  useEffect(() => {
    if (res.loading) {
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [res])

  const renderLicenseItem = useCallback(
    ({ item }) => <WalletItem item={item} />,
    [],
  )

  const renderSkeletonItem = useCallback(
    () => (
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
    ),
    [],
  )

  const keyExtractor = useCallback((item: IGenericUserLicense) => item.license.type, [])

  return (
    <>
      <BottomTabsIndicator index={2} total={3} />
      {licenseItems.length > 0 ? (
        <>
          {Platform.OS === 'ios' && (
            <Alert
              visible={alertVisible}
              type="info"
              message={intl.formatMessage({ id: 'wallet.alertMessage' })}
              onClose={() => dismiss('howToUseCertificates')}
            />
          )}
          <Animated.FlatList
            ref={flatListRef}
            testID={testIDs.SCREEN_HOME}
            style={{
              paddingTop: 16,
              paddingHorizontal: 16,
              zIndex: 9,
            }}
            contentInset={{
              bottom: 32,
            }}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => {
                  try {
                    if (loadingTimeout.current) {
                      clearTimeout(loadingTimeout.current)
                    }
                    setLoading(true)
                    res.refetch().then(() => {
                      loadingTimeout.current = setTimeout(() => {
                        setLoading(false)
                      }, 331)
                    }).catch(() => {
                      setLoading(false);
                    })
                  } catch (err) {
                    setLoading(false)
                  }
                }}
              />
            }
            data={
              isSkeleton
                ? Array.from({ length: 5 }).map((_, id) => ({ id }))
                : licenseItems
            }
            keyExtractor={keyExtractor}
            renderItem={isSkeleton ? renderSkeletonItem : renderLicenseItem}
          />
        </>
      ) : (
        <EmptyList
          title={intl.formatMessage({ id: 'wallet.emptyListTitle' })}
          description={intl.formatMessage({
            id: 'wallet.emptyListDescription',
          })}
          image={<Image source={illustrationSrc} height={198} width={146} />}
        />
      )}
    </>
  )
}

WalletScreen.options = getNavigationOptions
