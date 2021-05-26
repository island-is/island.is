import { useQuery } from '@apollo/client'
import {
  Alert,
  EmptyList,
  LicenceCard,
  Skeleton,
} from '@island.is/island-ui-native'
import React, { useEffect, useRef, useState } from 'react'
import { Image } from 'react-native'
import {
  Animated,
  FlatList,
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
import { LIST_LICENSES_QUERY } from '../../graphql/queries/list-licenses.query'
import { usePreferencesStore } from '../../stores/preferences-store'
import { LicenseType } from '../../types/license-type'
import { navigateTo } from '../../utils/deep-linking'
import { testIDs } from '../../utils/test-ids'
import { useThemedNavigationOptions } from '../../utils/use-themed-navigation-options'

const {
  useNavigationOptions,
  getNavigationOptions,
} = useThemedNavigationOptions(
  (theme, intl, initialized) => ({
    topBar: {
      title: {
        text: intl.formatMessage({ id: 'wallet.screenTitle' }),
      },
      background: {
        color: theme.shade.background,
      },
    },
    bottomTab: {
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

export const WalletScreen: NavigationFunctionComponent = ({ componentId }) => {
  useNavigationOptions(componentId)

  const theme = useTheme()
  const { dismiss, dismissed } = usePreferencesStore()
  const res = useQuery(LIST_LICENSES_QUERY, { client })
  const licenseItems = res?.data?.listLicenses ?? []
  const flRef = useRef<FlatList>()
  const alertVisible = !dismissed.includes('howToUseCertificates')
  const [offset, setOffset] = useState(alertVisible)
  const [loading, setLoading] = useState(res.loading)
  const isSkeleton = res.loading && !res.data
  const loadingTimeout = useRef<number>()


  // indexing list for spotlight search IOS
  useEffect(() => {
    const indexItems = licenseItems.map((item: any) => {
      return {
        title: item.title,
        uniqueIdentifier: `/wallet/${item.id}`,
        contentDescription: item.serviceProvider,
        domain: 'licence',
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

  const renderLicenseItem = ({
    item,
  }: {
    item: {
      id: string
      title: string
      serviceProvider: string
      dateTime: string
      status: string
      type: LicenseType
    }
  }) => (
    <TouchableHighlight
      style={{ marginBottom: 16, borderRadius: 16 }}
      onPress={() =>
        navigateTo(`/wallet/${item.id}`, {
          item,
          fromId: `license-${item.id}_source`,
          toId: `license-${item.id}_destination`,
        })
      }
    >
      <SafeAreaView>
        <LicenceCard
          nativeID={`license-${item.id}_source`}
          title={item.title}
          type={item.type}
          date={item.dateTime}
          status={item.status}
          agencyLogo={agencyLogo}
        />
      </SafeAreaView>
    </TouchableHighlight>
  )

  const renderSkeletonItem = () => (
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
  )

  return (
    <>
      {licenseItems.length > 0 ? (
        <>
          {offset && Platform.OS === 'ios' && (
            <Alert
              visible={alertVisible}
              type="info"
              message="Til að nota skírteini sem gild skilríki þarf að færa þau yfir í Apple Wallet."
              onClose={() => {
                dismiss('howToUseCertificates')
                flRef.current?.scrollToOffset({
                  offset: 0,
                  animated: true,
                })
              }}
              onClosed={() => {
                setOffset(false)
              }}
            />
          )}
          <Animated.FlatList
            ref={flRef as any}
            testID={testIDs.SCREEN_HOME}
            automaticallyAdjustContentInsets={false}
            contentInsetAdjustmentBehavior="never"
            contentInset={{
              top: offset ? 70 : 0,
            }}
            contentOffset={{
              x: 0,
              y: offset ? -70 : 0,
            }}
            style={{
              paddingTop: 16,
              paddingHorizontal: 16,
              zIndex: 9,
            }}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => {
                  try {
                    clearTimeout(loadingTimeout.current)
                    setLoading(true)
                    res.refetch().then(() => {
                      loadingTimeout.current = setTimeout(() => {
                        setLoading(false)
                      }, 331)
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
            keyExtractor={(item: any) => item.id}
            renderItem={isSkeleton ? renderSkeletonItem : renderLicenseItem}
          />
          <BottomTabsIndicator index={2} total={3} />
        </>
      ) : (
        <EmptyList
          title="Hér eru engin skírteini sem stendur"
          description="Þegar þú færð t.d. ökuskírteini, skotvopnaleyfi eða veiðikort frá hinu opinbera þá birtast þau hér."
          image={<Image source={illustrationSrc} height={198} width={146} />}
        />
      )}
    </>
  )
}

WalletScreen.options = getNavigationOptions
