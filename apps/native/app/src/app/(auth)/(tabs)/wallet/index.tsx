import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  Animated,
  FlatList,
  Image,
  ListRenderItemInfo,
  RefreshControl,
  TouchableNativeFeedback,
  View,
} from 'react-native'
import SpotlightSearch from 'react-native-spotlight-search'
import styled, { useTheme } from 'styled-components/native'

import refreshIcon from '@/assets/icons/refresh.png'
import illustrationSrc from '@/assets/illustrations/le-retirement-s3.png'
import { useFeatureFlag } from '@/components/providers/feature-flag-provider'
import {
  GenericLicenseType,
  GenericUserLicense,
  useListLicensesQuery,
} from '@/graphql/types/schema'
import { useLocale } from '@/hooks/use-locale'
import { syncLicenseWidgetData } from '@/lib/widget-sync'
import { INCLUDED_LICENSE_TYPES } from '@/constants/wallet.constants'
import { WalletItem } from '../../../../components/wallet-item'
import { usePreferencesStore } from '@/stores/preferences-store'
import {
  Alert,
  Button,
  EmptyList,
  GeneralCardSkeleton,
  TabButtons,
  Typography,
} from '@/ui'
import { isIos } from '@/utils/devices'
import { testIDs } from '@/utils/test-ids'
import { router, Stack } from 'expo-router'

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

export default function WalletScreen() {
  const theme = useTheme()
  const flatListRef = useRef<FlatList>(null)
  const [refetching, setRefetching] = useState(false)
  const loadingTimeout = useRef<ReturnType<typeof setTimeout>>()
  const intl = useIntl()
  const scrollY = useRef(new Animated.Value(0)).current
  const { dismiss, dismissed } = usePreferencesStore()
  const isBarcodeEnabled = useFeatureFlag('isBarcodeEnabled', false)
  const isIdentityDocumentEnabled = useFeatureFlag(
    'isIdentityDocumentEnabled',
    false,
  )
  const [selectedTab, setSelectedTab] = useState(0)

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

  // Index items for spotlight search on iOS
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

  const programmaticScrollWhenRefreshing = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
    onRefresh()
  }

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

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: intl.formatMessage({ id: 'wallet.screenTitle' }),
          headerRight: () => (
            <>
              <TouchableNativeFeedback
                onPress={() => router.navigate('/wallet/scanner')}
              >
                <Image
                  source={require('@/assets/icons/navbar-scan.png')}
                  style={{ width: 32, height: 32 }}
                />
              </TouchableNativeFeedback>
            </>
          ),
        }}
      />
      <FlatList
        ref={flatListRef}
        testID={testIDs.SCREEN_HOME}
        style={{
          zIndex: 9,
        }}
        contentInset={{
          bottom: 32,
        }}
        contentContainerStyle={{
          paddingTop: theme.spacing[2],
        }}
        refreshControl={
          <RefreshControl refreshing={refetching} onRefresh={onRefresh} />
        }
        scrollEventThrottle={16}
        scrollToOverflowEnabled={true}
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
    </>
  )
}
