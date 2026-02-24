import { useCallback, useMemo, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  RefreshControl,
  View,
} from 'react-native'
import { useTheme } from 'styled-components/native'

import illustrationSrc from '@/assets/illustrations/le-moving-s4.png'
import {
  ListVehiclesV2Query,
  useListVehiclesV2Query,
} from '@/graphql/types/schema'
import { useMyPagesLinks } from '@/lib/my-pages-links'
import { MoreInfoContiner } from '@/components/more-info-container/more-info-container'
import { EmptyList, GeneralCardSkeleton, TopLine } from '@/ui'
import { testIDs } from '@/utils/test-ids'
import { VehicleItem } from '@/screens/vehicles/components/vehicle-item'

const PAGE_SIZE = 15

type VehicleListItem = NonNullable<
  NonNullable<ListVehiclesV2Query['vehiclesListV2']>['vehicleList']
>[0]

type ListItem =
  | { id: number; __typename: 'Skeleton' }
  | VehicleListItem

export default function VehiclesScreen() {
  const theme = useTheme()
  const intl = useIntl()
  const flatListRef = useRef<FlatList>(null)
  const scrollY = useRef(new Animated.Value(0)).current
  const [refetching, setRefetching] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const loadingTimeout = useRef<ReturnType<typeof setTimeout>>()

  const res = useListVehiclesV2Query({
    variables: { input: { page: 1, pageSize: PAGE_SIZE } },
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

  const onRefresh = useCallback(() => {
    try {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current)
      }
      setRefetching(true)
      res
        .refetch({ input: { page: 1, pageSize: PAGE_SIZE } })
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

  const keyExtractor = useCallback(
    (item: ListItem, index: number) =>
      item.__typename === 'Skeleton'
        ? String(item.id)
        : `${item.permno}${index}`,
    [],
  )

  const data = useMemo<ListItem[]>(() => {
    if (res?.loading && !res?.data) {
      return Array.from({ length: 5 }).map((_, id) => ({
        id,
        __typename: 'Skeleton' as const,
      }))
    }
    return res?.data?.vehiclesListV2?.vehicleList || []
  }, [res.data, res.loading])

  return (
    <>
      <Animated.FlatList
        ref={flatListRef}
        testID={testIDs.SCREEN_HOME}
        style={{ paddingTop: 16, zIndex: 9 }}
        contentContainerStyle={{ paddingBottom: 16 }}
        contentInset={{ bottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={refetching} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={{ marginTop: 80, paddingHorizontal: 16 }}>
            <EmptyList
              title={<FormattedMessage id="vehicles.emptyListTitle" />}
              description={
                <FormattedMessage id="vehicles.emptyListDescription" />
              }
              image={
                <Image
                  source={illustrationSrc}
                  style={{ width: 198, height: 146 }}
                  resizeMode="contain"
                />
              }
            />
          </View>
        }
        scrollEventThrottle={16}
        scrollToOverflowEnabled
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (res.loading || loadingMore) return
          const pageNumber =
            res.data?.vehiclesListV2?.paging?.pageNumber ?? 1
          const totalPages =
            res.data?.vehiclesListV2?.paging?.totalPages ?? 1
          if (pageNumber >= totalPages) return

          setLoadingMore(true)
          res
            .fetchMore({
              variables: {
                input: { page: pageNumber + 1, pageSize: PAGE_SIZE },
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
            .then(() => setLoadingMore(false))
            .catch(() => setLoadingMore(false))
        }}
        ListFooterComponent={
          <>
            {loadingMore && (
              <View>
                <ActivityIndicator size="small" animating />
              </View>
            )}
            <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
              <MoreInfoContiner externalLinks={externalLinks} />
            </View>
          </>
        }
      />
      <TopLine scrollY={scrollY} />
    </>
  )
}
