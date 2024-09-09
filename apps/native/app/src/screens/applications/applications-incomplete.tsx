import { Badge, EmptyList, StatusCard, StatusCardSkeleton, TopLine } from '@ui'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  Animated,
  FlatList,
  Image,
  ListRenderItemInfo,
  RefreshControl,
  View,
} from 'react-native'
import { useTheme } from 'styled-components'
import { NavigationFunctionComponent } from 'react-native-navigation'
import illustrationSrc from '../../assets/illustrations/le-jobs-s3.png'
import {
  Application,
  ApplicationResponseDtoStatusEnum,
  useListApplicationsQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { useBrowser } from '../../lib/use-browser'
import { getApplicationUrl } from '../../utils/applications-utils'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'

type FlatListItem = Application | { __typename: 'Skeleton'; id: string }

const { useNavigationOptions, getNavigationOptions } =
  createNavigationOptionHooks(
    (theme, intl) => ({
      topBar: {
        title: {
          text: intl.formatMessage({ id: 'applications.unfinished' }),
        },
        noBorder: true,
      },
    }),
    {
      bottomTabs: {
        visible: false,
        drawBehind: true,
      },
    },
  )

export const ApplicationsIncompleteScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
  const { openBrowser } = useBrowser()
  const theme = useTheme()
  const [refetching, setRefetching] = useState(false)
  const intl = useIntl()
  const flatListRef = useRef<FlatList>(null)
  const scrollY = useRef(new Animated.Value(0)).current

  const applicationsRes = useListApplicationsQuery({
    variables: {
      input: {
        status: [ApplicationResponseDtoStatusEnum.Draft],
      },
    },
  })

  console.log(applicationsRes)

  const applications = useMemo(
    () => applicationsRes.data?.applicationApplications ?? [],
    [applicationsRes],
  )

  useConnectivityIndicator({
    componentId,
    refetching,
    queryResult: [applicationsRes],
  })

  const onRefresh = useCallback(async () => {
    setRefetching(true)

    try {
      await applicationsRes.refetch()
    } catch (e) {
      // noop
    } finally {
      setRefetching(false)
    }
  }, [applicationsRes])

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<FlatListItem>) => {
      if (item.__typename === 'Skeleton') {
        return <StatusCardSkeleton />
      }

      return (
        <StatusCard
          key={item.id}
          title={item.name ?? ''}
          date={new Date(item.created)}
          badge={
            <Badge
              title={intl.formatMessage(
                { id: 'applicationStatusCard.status' },
                { state: item.status || 'unknown' },
              )}
              titleColor={theme.color.blue400}
              type="blue"
            />
          }
          progress={undefined}
          description={intl.formatMessage(
            { id: 'applicationStatusCard.description' },
            { state: item.status || 'unknown' },
          )}
          actions={[
            {
              text: intl.formatMessage({
                id: 'applicationStatusCard.openButtonLabel',
              }),
              onPress() {
                openBrowser(getApplicationUrl(item), componentId)
              },
            },
          ]}
          institution={item.institution ?? ''}
          style={{ marginHorizontal: theme.spacing[2] }}
        />
      )
    },
    [theme],
  )

  const keyExtractor = useCallback((item: FlatListItem) => {
    return item.id.toString()
  }, [])

  const data = useMemo(() => {
    if (applicationsRes.loading && !applicationsRes.data) {
      return Array.from({ length: 7 }).map((_, id) => ({
        id: String(id),
        type: 'skeleton',
      }))
    }
    if (applications.length === 0) {
      return [{ id: '0', type: 'empty' }]
    }
    return applications
  }, [
    applicationsRes.loading,
    applicationsRes.data,
    applications,
  ]) as FlatListItem[]

  return (
    <>
      <Animated.FlatList
        ref={flatListRef}
        contentContainerStyle={{
          paddingBottom: theme.spacing[2],
          paddingTop: theme.spacing[2],
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
        ListEmptyComponent={
          <View style={{ flex: 1 }}>
            <EmptyList
              title={intl.formatMessage({ id: 'applications.emptyTitle' })}
              description={intl.formatMessage({
                id: 'applications.emptyDescription',
              })}
              image={
                <Image
                  source={illustrationSrc}
                  style={{ height: 210, width: 167 }}
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

ApplicationsIncompleteScreen.options = getNavigationOptions
