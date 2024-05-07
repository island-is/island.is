import { NavigationBarSheet, NotificationCard, Skeleton } from '@ui'
import { dismissAllNotificationsAsync } from 'expo-notifications'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { ActivityIndicator, FlatList, SafeAreaView, View } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'
import {
  GetUserNotificationsQuery,
  Notification,
  useGetUserNotificationsQuery,
  useMarkAllNotificationsAsSeenMutation,
  useMarkUserNotificationAsReadMutation,
} from '../../graphql/types/schema'

import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { navigateToNotification } from '../../lib/deep-linking'
import {
  createSkeletonArr,
  SkeletonItem,
} from '../../utils/create-skeleton-arr'
import { testIDs } from '../../utils/test-ids'

const LoadingWrapper = styled.View`
  padding-vertical: ${({ theme }) => theme.spacing[3]}px;
`

const DEFAULT_PAGE_SIZE = 15

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks(() => ({
    topBar: {
      visible: false,
    },
  }))

type NotificationItem = NonNullable<
  NonNullable<GetUserNotificationsQuery['userNotifications']>['data']
>[0]

type ListItem = SkeletonItem | NotificationItem

export const NotificationsScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
  const intl = useIntl()
  const theme = useTheme()
  const [loadingMore, setLoadingMore] = useState(false)

  const { data, loading, fetchMore, updateQuery } =
    useGetUserNotificationsQuery({
      fetchPolicy: 'network-only',
      variables: { input: { limit: DEFAULT_PAGE_SIZE } },
    })

  const [markUserNotificationAsRead] = useMarkUserNotificationAsReadMutation()
  const [markAllUserNotificationsAsSeen] =
    useMarkAllNotificationsAsSeenMutation()

  // On mount, mark all notifications as seen
  useEffect(() => {
    // void markAllUserNotificationsAsSeen()
  }, [])

  useEffect(() => {
    void dismissAllNotificationsAsync()
  })

  const memoizedData = useMemo<ListItem[]>(() => {
    if (loading && !data) {
      return createSkeletonArr(9)
    }

    return data?.userNotifications?.data || []
  }, [data, loading])

  const onNotificationPress = useCallback((notification: Notification) => {
    // Mark notification as read and seen
    void markUserNotificationAsRead({ variables: { id: notification.id } })
    navigateToNotification(notification, componentId)
  }, [])

  const handleEndReached = async () => {
    if (loadingMore || loading) return

    setLoadingMore(true)

    try {
      await fetchMore({
        variables: {
          input: {
            limit: DEFAULT_PAGE_SIZE,
            after: data?.userNotifications?.pageInfo.endCursor ?? undefined,
          },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (
            !fetchMoreResult ||
            !fetchMoreResult.userNotifications?.pageInfo?.hasNextPage
          ) {
            return prev
          }

          return {
            userNotifications: {
              ...fetchMoreResult.userNotifications,
              data: [
                ...(prev.userNotifications?.data || []),
                ...fetchMoreResult.userNotifications?.data,
              ],
            },
          }
        },
      })
    } catch (e) {
      // TODO handle error
    }

    setLoadingMore(false)
  }

  const renderNotificationItem = ({ item }: { item: ListItem }) => {
    if (item.__typename === 'Skeleton') {
      return (
        <Skeleton
          active
          overlayColor={{
            dark: theme.shades.dark.shade200,
            light: theme.color.blue200,
          }}
          overlayOpacity={1}
          height={103}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: theme.color.blue200,
          }}
        />
      )
    }

    return (
      <NotificationCard
        key={item.id}
        id={item.id}
        title={item.message.title}
        message={item.message.displayBody}
        date={new Date(item.metadata.sent)}
        icon={
          item.sender?.logoUrl && {
            uri: `${item.sender.logoUrl}?w=64&h=64&fit=pad&bg=white&fm=png`,
          }
        }
        underlayColor={
          theme.isDark ? theme.shades.dark.shade100 : theme.color.blue100
        }
        unread={!item.metadata.read}
        onPress={() => onNotificationPress(item)}
        testID={testIDs.NOTIFICATION_CARD_BUTTON}
      />
    )
  }

  const keyExtractor = useCallback(
    (item: ListItem, index: number) => item.id.toString(),
    [memoizedData],
  )

  return (
    <>
      <NavigationBarSheet
        componentId={componentId}
        title={intl.formatMessage({ id: 'notifications.screenTitle' })}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{ marginHorizontal: 16 }}
      />
      <SafeAreaView style={{ flex: 1 }} testID={testIDs.SCREEN_NOTIFICATIONS}>
        <FlatList
          style={{ flex: 1, paddingTop: 16 }}
          data={memoizedData}
          keyExtractor={keyExtractor}
          renderItem={renderNotificationItem}
          onEndReachedThreshold={0.5}
          onEndReached={handleEndReached}
          scrollEventThrottle={16}
          scrollToOverflowEnabled
          ListFooterComponent={
            loadingMore ? (
              <LoadingWrapper>
                <ActivityIndicator size="small" animating />
              </LoadingWrapper>
            ) : null
          }
        />
      </SafeAreaView>
    </>
  )
}

NotificationsScreen.options = getNavigationOptions
