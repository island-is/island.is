import React, { useCallback, useMemo, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  RefreshControl,
  View,
} from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { useTheme } from 'styled-components/native'

import illustrationSrc from '../../assets/illustrations/le-moving-s4.png'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import {
  ListVehiclesV2Query,
  useListVehiclesV2Query,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { EmptyList, GeneralCardSkeleton, TopLine } from '../../ui'
import { testIDs } from '../../utils/test-ids'
import { VehicleItem } from './components/vehicle-item'

import { MoreInfoContiner } from '../../components/more-info-container/more-info-container'
import { useMyPagesLinks } from '../../lib/my-pages-links'

const { useNavigationOptions, getNavigationOptions } =
  createNavigationOptionHooks((theme, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({ id: 'vehicles.screenTitle' }),
      },
    },
  }))

type VehicleListItem = NonNullable<
  NonNullable<ListVehiclesV2Query['vehiclesListV2']>['vehicleList']
>[0]

type ListItem =
  | {
      id: number
      __typename: 'Skeleton'
    }
  | VehicleListItem

const Empty = () => (
  <View style={{ marginTop: 80, paddingHorizontal: 16 }}>
    <EmptyList
      title={<FormattedMessage id="vehicles.emptyListTitle" />}
      description={<FormattedMessage id="vehicles.emptyListDescription" />}
      image={
        <Image
          source={illustrationSrc}
          style={{ width: 198, height: 146 }}
          resizeMode="contain"
        />
      }
    />
  </View>
)

const input = {
  page: 1,
  pageSize: 15,
}

export const VehiclesScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
  const theme = useTheme()
  const intl = useIntl()

  const flatListRef = useRef<FlatList>(null)
  const [refetching, setRefetching] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const scrollY = useRef(new Animated.Value(0)).current
  const loadingTimeout = useRef<ReturnType<typeof setTimeout>>()

  const res = useListVehiclesV2Query({
    variables: {
      input,
    },
  })

  useConnectivityIndicator({
    componentId,
    queryResult: res,
    refetching,
  })

  const myPagesLinks = useMyPagesLinks()

  const externalLinks = [
    {
      link: myPagesLinks.ownerLookup,
      title: intl.formatMessage({ id: 'vehicle.links.ownerLookup' }),
    },
    {
      link: myPagesLinks.vehicleHistory,
      title: intl.formatMessage({ id: 'vehicle.links.vehicleHistory' }),
    },
    {
      link: myPagesLinks.reportOwnerChange,
      title: intl.formatMessage({ id: 'vehicle.links.reportOwnerChange' }),
    },
    {
      link: myPagesLinks.returnCertificate,
      title: intl.formatMessage({ id: 'vehicle.links.returnCertificate' }),
    },
    {
      link: myPagesLinks.nameConfidentiality,
      title: intl.formatMessage({ id: 'vehicle.links.nameConfidentiality' }),
    },
  ]

  // What to do when refreshing
  const onRefresh = useCallback(() => {
    try {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current)
      }
      setRefetching(true)
      res
        .refetch({
          input: {
            ...input,
            page: 1,
          },
        })
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
  }, [res])

  // Render item
  const renderItem = useCallback(
    ({ item, index }: { item: ListItem; index: number }) => {
      if (item.__typename === 'Skeleton') {
        return (
          <View style={{ paddingHorizontal: theme.spacing[2] }}>
            <GeneralCardSkeleton height={156} />
          </View>
        )
      }

      return <VehicleItem item={item} index={index} />
    },
    [],
  )

  // Extract key of data
  const keyExtractor = useCallback(
    (item: ListItem, index: number) =>
      item.__typename === 'Skeleton'
        ? String(item.id)
        : `${item.permno}${index}`,
    [],
  )

  // Return skeleton items or real data
  const data = useMemo<ListItem[]>(() => {
    if (res?.loading && !res?.data) {
      return Array.from({ length: 5 }).map((_, id) => ({
        id,
        __typename: 'Skeleton',
      }))
    }
    return res?.data?.vehiclesListV2?.vehicleList || []
  }, [res.data, res.loading])

  return (
    <>
      <Animated.FlatList
        ref={flatListRef}
        testID={testIDs.SCREEN_VEHICLES}
        style={{
          paddingTop: 16,
          zIndex: 9,
        }}
        contentContainerStyle={{
          paddingBottom: 16,
        }}
        contentInset={{
          bottom: 32,
        }}
        refreshControl={
          <RefreshControl refreshing={refetching} onRefresh={onRefresh} />
        }
        ListEmptyComponent={Empty}
        scrollEventThrottle={16}
        scrollToOverflowEnabled={true}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true,
          },
        )}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={() => {
          if (res.loading) {
            return
          }
          const pageNumber = res.data?.vehiclesListV2?.paging?.pageNumber ?? 1
          const totalPages = res.data?.vehiclesListV2?.paging?.totalPages ?? 1
          if (pageNumber >= totalPages) {
            return
          }
          setLoadingMore(true)
          return res
            .fetchMore({
              variables: {
                input: {
                  ...input,
                  page: pageNumber + 1,
                },
              },
              updateQuery(prev, { fetchMoreResult }) {
                return {
                  vehiclesListV2: {
                    ...fetchMoreResult.vehiclesListV2,
                    vehicleList: [
                      ...(prev.vehiclesListV2?.vehicleList ?? []),
                      ...(fetchMoreResult.vehiclesListV2?.vehicleList ?? []),
                    ],
                  },
                }
              },
            })
            .then(() => {
              setLoadingMore(false)
            })
        }}
        ListFooterComponent={
          <>
            {loadingMore ? (
              <View>
                <ActivityIndicator size="small" animating />
              </View>
            ) : null}
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
          </>
        }
      />

      <TopLine scrollY={scrollY} />

      <BottomTabsIndicator index={2} total={3} />
    </>
  )
}

VehiclesScreen.options = getNavigationOptions
