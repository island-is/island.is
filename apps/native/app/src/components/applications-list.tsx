import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  Animated,
  FlatList,
  Image,
  ListRenderItemInfo,
  RefreshControl,
  SafeAreaView,
  View,
} from 'react-native'
import { useTheme } from 'styled-components'

import {
  Badge,
  badgeColorSchemes,
  EmptyList,
  Problem,
  StatusCard,
  StatusCardSkeleton,
  TopLine,
} from '@/ui'
import illustrationSrc from '@/assets/illustrations/le-jobs-s3.png'
import {
  Application,
  ListApplicationsQueryResult,
} from '@/graphql/types/schema'
import { useBrowser } from '@/hooks/use-browser'
import { getApplicationUrl } from '@/utils/applications-utils'
import { createSkeletonArr } from '@/utils/create-skeleton-arr'
import { getBadgeVariant } from '../utils/applications/get-badge-variant'

type FlatListItem =
  | Application
  | { __typename: 'Skeleton'; id: string }
  | { __typename: 'Empty'; id: string }

interface ApplicationsListProps {
  applicationsRes: ListApplicationsQueryResult
  displayProgress: boolean
  displayDescription: boolean
  onRefetch: (refetching: boolean) => void
}

export const ApplicationsList = ({
  applicationsRes,
  displayDescription,
  displayProgress,
  onRefetch,
}: ApplicationsListProps) => {
  const { openBrowser } = useBrowser()
  const theme = useTheme()
  const [refetching, setRefetching] = useState(false)
  const intl = useIntl()
  const flatListRef = useRef<FlatList>(null)
  const scrollY = useRef(new Animated.Value(0)).current

  const applications = useMemo(
    () => applicationsRes.data?.applicationApplications ?? [],
    [applicationsRes],
  )

  const showError = applicationsRes.error && !applicationsRes.data

  const onRefresh = useCallback(async () => {
    setRefetching(true)
    onRefetch(true)

    try {
      await applicationsRes.refetch()
    } catch (e) {
      // noop
    } finally {
      setRefetching(false)
      onRefetch(false)
    }
  }, [applicationsRes])

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<FlatListItem>) => {
      if (item.__typename === 'Skeleton') {
        return (
          <View style={{ marginHorizontal: theme.spacing[2] }}>
            <StatusCardSkeleton />
          </View>
        )
      }

      if (item.__typename === 'Empty') {
        return (
          <View style={{ marginTop: 80, paddingHorizontal: 16 }}>
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
        )
      }

      const badgeVariant =
        item?.actionCard?.tag?.variant ?? getBadgeVariant(item)

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
              variant={badgeVariant as keyof typeof badgeColorSchemes}
            />
          }
          progress={
            displayProgress
              ? item.actionCard?.draftFinishedSteps ?? 0
              : undefined
          }
          progressTotalSteps={
            displayProgress ? item.actionCard?.draftTotalSteps ?? 0 : undefined
          }
          progressMessage={
            displayProgress
              ? intl.formatMessage(
                  {
                    id: 'applicationStatusCard.draftProgress',
                  },
                  {
                    draftFinishedSteps: item.actionCard?.draftFinishedSteps,
                    draftTotalSteps: item.actionCard?.draftTotalSteps,
                  },
                )
              : undefined
          }
          description={
            displayDescription
              ? item.actionCard?.pendingAction?.title ??
                intl.formatMessage(
                  { id: 'applicationStatusCard.description' },
                  { state: item.status || 'unknown' },
                )
              : undefined
          }
          actions={[
            {
              text: intl.formatMessage({
                id: 'applicationStatusCard.openButtonLabel',
              }),
              onPress() {
                openBrowser(getApplicationUrl(item))
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
      return createSkeletonArr(5)
    }
    if (applications.length === 0) {
      return [{ id: '0', __typename: 'Empty' }]
    }
    return applications
  }, [
    applicationsRes.loading,
    applicationsRes.data,
    applications,
  ]) as FlatListItem[]

  return (
    <View>
      {showError ? (
        <Problem withContainer />
      ) : (
        <SafeAreaView>
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
            scrollToOverflowEnabled
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              {
                useNativeDriver: true,
              },
            )}
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
          />
          <TopLine scrollY={scrollY} />
        </SafeAreaView>
      )}
    </View>
  )
}
