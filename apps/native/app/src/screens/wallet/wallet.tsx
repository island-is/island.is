import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  Animated,
  FlatList,
  Image,
  Linking,
  ListRenderItemInfo,
  RefreshControl,
  View,
} from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import SpotlightSearch from 'react-native-spotlight-search'
import styled, { useTheme } from 'styled-components/native'
import { useNavigationComponentDidAppear } from 'react-native-navigation-hooks'

import { syncLicenseWidgetData } from '../../lib/widget-sync'
import {
  Alert,
  Button,
  EmptyList,
  GeneralCardSkeleton,
  TabButtons,
  TopLine,
  Typography,
} from '../../ui'
import illustrationSrc from '../../assets/illustrations/le-retirement-s3.png'
import refreshIcon from '../../assets/icons/refresh.png'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import {
  GenericLicenseType,
  GenericUserLicense,
  useListLicensesQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { usePreferencesStore } from '../../stores/preferences-store'
import { isIos } from '../../utils/devices'
import { getRightButtons } from '../../utils/get-main-root'
import { testIDs } from '../../utils/test-ids'
import { WalletItem } from './components/wallet-item'
import { useLocale } from '../../hooks/use-locale'
import { useFeatureFlag } from '../../contexts/feature-flag-provider'
import { INCLUDED_LICENSE_TYPES } from '../wallet-pass/wallet-pass.constants'
import { evaluateUrl } from '../../lib/deep-linking'

const Tabs = styled.View`
  margin-top: ${({ theme }) => theme.spacing[1]}px;
  margin-horizontal: ${({ theme }) => theme.spacing[2]}px;
`

type FlatListItem =
  | GenericUserLicense
  | { __typename: 'Skeleton'; id: string }
  | { __typename: 'Error'; id: string }

const getSkeletonArr = (): FlatListItem[] =>
  Array.from({ length: 5 }).map((_, id) => ({
    id: String(id),
    __typename: 'Skeleton',
  }))

const { useNavigationOptions, getNavigationOptions } =
  createNavigationOptionHooks(
    (theme, intl, initialized) => ({
      topBar: {
        title: {
          text: intl.formatMessage({ id: 'wallet.screenTitle' }),
        },
        rightButtons: initialized
          ? getRightButtons({
              icons: ['licenseScan'],
              theme: theme,
            })
          : [],
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
  const [refetching, setRefetching] = useState(false)
  const loadingTimeout = useRef<ReturnType<typeof setTimeout>>()
  const intl = useIntl()
  const scrollY = useRef(new Animated.Value(0)).current
  const { dismiss, dismissed } = usePreferencesStore()
  const [hiddenContent, setHiddenContent] = useState(isIos)
  const isBarcodeEnabled = useFeatureFlag('isBarcodeEnabled', false)
  const isIdentityDocumentEnabled = useFeatureFlag(
    'isIdentityDocumentEnabled',
    false,
  )
  const [selectedTab, setSelectedTab] = useState(0)

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url?.includes('wallet/')) {
        return evaluateUrl(url)
      }
    })
  }, [])

  // Query list of licenses
  const res = useListLicensesQuery({
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
  })

  useConnectivityIndicator({
    componentId,
    rightButtons: getRightButtons({ icons: ['licenseScan'] }),
    queryResult: res,
    refetching,
  })

  // Filter licenses
  const licenseItems = useMemo(() => {
    if ((!res.loading && !res.error) || res.data) {
      return (res.data?.genericLicenseCollection?.licenses ?? []).filter(
        ({ license }) => {
          if (license.status === 'Unknown') {
            return false
          }
          return true
        },
      )
    }

    return []
  }, [res])

  useEffect(() => {
    if (licenseItems) {
      // Update available licenses in the widgets
      // @todo remove the data on logout/session expired.
      syncLicenseWidgetData(licenseItems)
    }
  }, [licenseItems])

  const lastUpdatedFormatted = useMemo(() => {
    const lastUpdated = licenseItems.find((item) => item.fetch.updated)?.fetch
      .updated

    return lastUpdated
      ? intl.formatDate(new Date(parseInt(lastUpdated, 10)))
      : undefined
  }, [licenseItems, intl])

  const hasChildLicenses = licenseItems.some(
    (license) => license.isOwnerChildOfUser,
  )

  // indexing list for spotlight search IOS
  useEffect(() => {
    const indexItems = licenseItems.map((item) => {
      return {
        title: item.payload?.metadata?.name ?? item.license.type,
        type: item.license.type,
        uniqueIdentifier: `/wallet/${item.license.type}/${item.payload?.metadata?.licenseId}`,
        contentDescription: item.license.provider.id,
        domain: 'licences',
      }
    })
    if (isIos) {
      SpotlightSearch.indexItems(indexItems)
    }
  }, [licenseItems])

  const refetch = res.refetch
  const onRefresh = useCallback(() => {
    try {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current)
      }
      setRefetching(true)
      refetch()
        .then(() => {
          loadingTimeout.current = setTimeout(() => {
            setRefetching(false)
          }, 1331)
        })
        .catch(() => {
          setRefetching(false)
        })
    } catch (err) {
      setRefetching(false)
    }
  }, [refetch])

  // Using the onRefresh function when pressing the update button in ios is buggy,
  // it scrolls the list half out of view when done - so we do it manually instead
  const programmaticScrollWhenRefreshing = () => {
    flatListRef.current?.scrollToOffset({ offset: -300, animated: true })
    res
      .refetch()
      .then(() => {
        // Ofsetting to 0 scrolls the top of the list out of view, so we offset to -150
        flatListRef.current?.scrollToOffset({ offset: -150, animated: true })
      })
      .catch(() => {
        flatListRef.current?.scrollToOffset({ offset: -150, animated: true })
      })
  }

  useNavigationComponentDidAppear(() => {
    setHiddenContent(false)
  }, componentId)

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<FlatListItem>) => {
      if (item.__typename === 'Skeleton') {
        return (
          <View style={{ paddingHorizontal: theme.spacing[2] }}>
            <GeneralCardSkeleton height={80} />
          </View>
        )
      }

      if (
        item.__typename === 'GenericUserLicense' &&
        selectedTab === 0 &&
        !item.isOwnerChildOfUser
      ) {
        return <WalletItem item={item} />
      } else if (
        item.__typename === 'GenericUserLicense' &&
        selectedTab === 1 &&
        item.isOwnerChildOfUser
      ) {
        return <WalletItem item={item} />
      }
      return null
    },
    [theme, selectedTab],
  )

  const keyExtractor = useCallback((item: FlatListItem, index: number) => {
    const fallback = String(index)
    const type = item.__typename

    if (type === 'GenericUserLicense') {
      return `${item.license.type}-${fallback}`
    }

    return (item as { id: string })?.id ?? fallback
  }, [])

  const data = useMemo<FlatListItem[]>(() => {
    if (res.loading && !res.data) {
      return getSkeletonArr()
    }

    return [...licenseItems] as FlatListItem[]
  }, [licenseItems, res.loading, res.data])

  // Fix for a bug in react-native-navigation where the large title is not visible on iOS with bottom tabs https://github.com/wix/react-native-navigation/issues/6717
  if (hiddenContent) {
    return null
  }

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
          <RefreshControl refreshing={refetching} onRefresh={onRefresh} />
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
          (isIos && !isBarcodeEnabled) || hasChildLicenses ? (
            <View style={{ marginBottom: 16 }}>
              {isIos && !isBarcodeEnabled && (
                <Alert
                  type="info"
                  visible={!dismissed.includes('howToUseLicence')}
                  message={intl.formatMessage({ id: 'wallet.alertMessage' })}
                  onClose={() => dismiss('howToUseLicence')}
                />
              )}
              {hasChildLicenses && (
                <Tabs>
                  <TabButtons
                    buttons={[
                      {
                        title: intl.formatMessage({
                          id: 'wallet.yourLicenses',
                        }),
                      },
                      {
                        title: intl.formatMessage({
                          id: 'wallet.childLicenses',
                        }),
                      },
                    ]}
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                  />
                </Tabs>
              )}
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
        ListFooterComponent={
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: theme.spacing[3],
            }}
          >
            {lastUpdatedFormatted && (
              <Typography variant="body3">
                {intl.formatMessage(
                  { id: 'wallet.lastUpdated' },
                  { date: lastUpdatedFormatted },
                )}
              </Typography>
            )}
            <Button
              onPress={() =>
                isIos ? programmaticScrollWhenRefreshing() : onRefresh()
              }
              title={intl.formatMessage({ id: 'wallet.update' })}
              isTransparent={true}
              icon={refreshIcon}
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
