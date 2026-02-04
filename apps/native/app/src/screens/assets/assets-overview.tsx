import React, { useCallback, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  Animated,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  TouchableHighlight,
  View,
} from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { useTheme } from 'styled-components/native'

import illustrationSrc from '../../assets/illustrations/le-moving-s1.png'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { MoreInfoContiner } from '../../components/more-info-container/more-info-container'
import { useListAssetsQuery } from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { navigateTo } from '../../lib/deep-linking'
import { useMyPagesLinks } from '../../lib/my-pages-links'
import { AssetCard, EmptyList, Skeleton, TopLine } from '../../ui'
import { testIDs } from '../../utils/test-ids'

const { useNavigationOptions, getNavigationOptions } =
  createNavigationOptionHooks((theme, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({ id: 'assetsOvervies.screenTitle' }),
      },
    },
  }))

const AssetItem = React.memo(({ item }: { item: any }) => {
  const theme = useTheme()
  const postNumber =
    item?.defaultAddress?.postNumber !== null
      ? item?.defaultAddress?.postNumber
      : ''

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <TouchableHighlight
        underlayColor={
          theme.isDark ? theme.shades.dark.shade100 : theme.color.blue100
        }
        style={{ marginBottom: 16, borderRadius: 16 }}
        onPress={() => {
          navigateTo(`/asset/${item.propertyNumber}`, {
            item,
          })
        }}
      >
        <SafeAreaView>
          <AssetCard
            address={item?.defaultAddress?.displayShort}
            city={`${postNumber} ${item?.defaultAddress?.municipality}`}
            number={item?.propertyNumber}
          />
        </SafeAreaView>
      </TouchableHighlight>
    </View>
  )
})

export const AssetsOverviewScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)

  const flatListRef = useRef<FlatList>(null)
  const [refetching, setRefetching] = useState(false)
  const intl = useIntl()
  const theme = useTheme()
  const scrollY = useRef(new Animated.Value(0)).current
  const loadingTimeout = useRef<number>()

  const assetsRes = useListAssetsQuery({
    variables: {
      input: {
        cursor: '1',
      },
    },
  })

  useConnectivityIndicator({
    componentId,
    queryResult: assetsRes,
    refetching,
  })

  const isSkeleton = assetsRes.loading && !assetsRes.data
  const assetsList = assetsRes?.data?.assetsOverview?.properties || []

  const myPagesLinks = useMyPagesLinks()
  const externalLinks = [
    {
      link: myPagesLinks.mortgageCertificate,
      title: intl.formatMessage({ id: 'assets.links.mortgageCertificate' }),
    },
  ]

  const onRefresh = useCallback(() => {
    try {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current)
      }
      setRefetching(true)
      assetsRes
        .refetch()
        .then(() => {
          ;(loadingTimeout as any).current = setTimeout(() => {
            setRefetching(false)
          }, 1331)
        })
        .catch(() => {
          setRefetching(false)
        })
    } catch (err) {
      setRefetching(false)
    }
  }, [])

  const paginate = () => {
    const newCursor = Math.ceil(
      assetsList.length /
        (assetsRes?.data?.assetsOverview?.paging?.pageSize ?? 0) +
        1,
    )

    if (
      newCursor > (assetsRes?.data?.assetsOverview?.paging?.totalPages ?? 1)
    ) {
      return
    }

    if (assetsRes.fetchMore && assetsList.length > 0) {
      assetsRes.fetchMore({
        variables: {
          input: {
            cursor: newCursor,
          },
        },
        updateQuery: (prevResult: any, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult

          if (
            fetchMoreResult?.assetsOverview?.properties &&
            prevResult.assetsOverview?.properties
          ) {
            fetchMoreResult.assetsOverview.properties = [
              ...(prevResult.assetsOverview?.properties ?? []),
              ...(fetchMoreResult.assetsOverview?.properties ?? []),
            ]
          }
          return fetchMoreResult
        },
      })
    }
  }

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === 'skeleton') {
      return (
        <View style={{ paddingHorizontal: 16 }}>
          <Skeleton
            active
            backgroundColor={{
              dark: theme.shades.dark.shade300,
              light: theme.color.blue100,
            }}
            overlayColor={{
              dark: theme.shades.dark.shade200,
              light: theme.color.blue200,
            }}
            overlayOpacity={1}
            height={104}
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
            title={intl.formatMessage({ id: 'assetsOverview.emptyListTitle' })}
            description={intl.formatMessage({
              id: 'assetsOverview.emptyListDescription',
            })}
            image={
              <Image
                source={illustrationSrc}
                style={{ width: 145, height: 192 }}
                resizeMode="contain"
              />
            }
          />
        </View>
      )
    }

    return <AssetItem item={item} />
  }

  const keyExtractor = useCallback(
    (item: any) => item?.propertyNumber ?? item?.id,
    [],
  )

  const emptyItems = [{ id: '0', type: 'empty' }]
  const skeletonItems = Array.from({ length: 5 }).map((_, id) => ({
    id,
    type: 'skeleton',
  }))

  const isEmpty = assetsList.length === 0
  return (
    <>
      <Animated.FlatList
        ref={flatListRef}
        testID={testIDs.SCREEN_HOME}
        style={{
          paddingTop: 16,
          zIndex: 9,
        }}
        contentInset={{
          bottom: 32,
        }}
        contentContainerStyle={{
          paddingBottom: 16,
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
        onEndReached={() => paginate()}
        onEndReachedThreshold={0.5}
        data={isSkeleton ? skeletonItems : isEmpty ? emptyItems : assetsList}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListFooterComponent={
          isEmpty ? null : (
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            >
              <MoreInfoContiner
                externalLinks={externalLinks}
                componentId={componentId}
              />
            </View>
          )
        }
      />
      <TopLine scrollY={scrollY} />
      <BottomTabsIndicator index={4} total={5} />
    </>
  )
}

AssetsOverviewScreen.options = getNavigationOptions
