import { useApolloClient } from '@apollo/client'
import { dismissAllNotificationsAsync } from 'expo-notifications'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  View,
  Image,
} from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'
import { router } from 'expo-router'

import {
  Button,
  NavigationBarSheet,
  NotificationCard,
  Problem,
  ListItemSkeleton,
  EmptyList,
} from '@/ui'
import {
  GetUserNotificationsQuery,
  Notification,
  useGetUserNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkAllNotificationsAsSeenMutation,
  useMarkUserNotificationAsReadMutation,
} from '@/graphql/types/schema'
import { navigateToUniversalLink } from '@/lib/deep-linking'
import { useNotificationsStore } from '@/stores/notifications-store'
import {
  createSkeletonArr,
  SkeletonItem,
} from '@/utils/create-skeleton-arr'
import { isAndroid } from '@/utils/devices'
import { testIDs } from '@/utils/test-ids'
import settings from '@/assets/icons/settings.png'
import inboxRead from '@/assets/icons/inbox-read.png'
import emptyIllustrationSrc from '@/assets/illustrations/le-company-s3.png'
import { useBrowser } from '@/hooks/use-browser'
import { useLocale } from '@/hooks/use-locale'

const LoadingWrapper = styled.View`
  padding-vertical: ${({ theme }) => theme.spacing[3]}px;
  ${({ theme }) => isAndroid && `padding-bottom: ${theme.spacing[6]}px;`}
`

const ButtonWrapper = styled.View`
  flex-direction: row;
  margin-horizontal: ${({ theme }) => theme.spacing[2]}px;
  margin-top: ${({ theme }) => theme.spacing[2]}px;
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

const DEFAULT_PAGE_SIZE = 50

const FALLBACK_ICON_URL =
  'https://images.ctfassets.net/8k0h54kbe6bj/6XhCz5Ss17OVLxpXNVDxAO/d3d6716bdb9ecdc5041e6baf68b92ba6/coat_of_arms.svg'

type NotificationItem = NonNullable<
  NonNullable<GetUserNotificationsQuery['userNotifications']>['data']
>[0]

export type EmptyItem = {
  id: string
  __typename: 'Empty'
}

type ListItem = SkeletonItem | NotificationItem | EmptyItem

export default function NotificationsScreen() {
  const { openBrowser } = useBrowser()
  const intl = useIntl()
  const theme = useTheme()
  const client = useApolloClient()
  const [loadingMore, setLoadingMore] = useState(false)
  const updateNavigationUnseenCount = useNotificationsStore(
    ({ updateNavigationUnseenCount }) => updateNavigationUnseenCount,
  )

  const { data, loading, error, fetchMore } = useGetUserNotificationsQuery({
    variables: { input: { limit: DEFAULT_PAGE_SIZE }, locale: useLocale() },
  })
  const showError = error && !data

  const [markUserNotificationAsRead] = useMarkUserNotificationAsReadMutation()
  const [markAllUserNotificationsAsSeen] =
    useMarkAllNotificationsAsSeenMutation()

  const [markAllUserNotificationsAsRead] =
    useMarkAllNotificationsAsReadMutation({
      onCompleted: (d) => {
        if (d.markAllNotificationsRead?.success) {
          for (const notification of data?.userNotifications?.data || []) {
            client.cache.modify({
              id: client.cache.identify(notification),
              fields: {
                metadata(existingMetadata) {
                  return {
                    ...existingMetadata,
                    read: true,
                  }
                },
              },
            })
          }
        }
      },
    })

  // On mount, mark all notifications as seen and update all screens navigation badge to 0
  useEffect(() => {
    void markAllUserNotificationsAsSeen().then(() =>
      updateNavigationUnseenCount(0),
    )
  }, [])

  useEffect(() => {
    void dismissAllNotificationsAsync()
  })

  const memoizedData = useMemo<ListItem[]>(() => {
    if (loading && !data) {
      return createSkeletonArr(9)
    }

    if (data?.userNotifications?.data?.length === 0) {
      return [{ id: '0', __typename: 'Empty' }]
    }

    return data?.userNotifications?.data || []
  }, [data, loading])

  const onNotificationPress = useCallback(
    (notification: Notification) => {
      void markUserNotificationAsRead({ variables: { id: notification.id } })

      navigateToUniversalLink({
        link: notification.message?.link?.url,
        openBrowser,
      })
    },
    [markUserNotificationAsRead, openBrowser],
  )

  const handleEndReached = async () => {
    if (
      loadingMore ||
      loading ||
      (data && !data?.userNotifications?.pageInfo.hasNextPage)
    )
      return

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
                ...(fetchMoreResult.userNotifications?.data || []),
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
      return <ListItemSkeleton multilineMessage />
    }

    if (item.__typename === 'Empty') {
      return (
        <View style={{ marginTop: 80 }}>
          <EmptyList
            title={intl.formatMessage({ id: 'notifications.emptyListTitle' })}
            description={intl.formatMessage({
              id: 'notifications.emptyListDescription',
            })}
            image={
              <Image
                source={emptyIllustrationSrc}
                style={{ width: 134, height: 176 }}
                resizeMode="contain"
              />
            }
          />
        </View>
      )
    }

    return (
      <NotificationCard
        key={item.id}
        id={item.id}
        title={item.message.title}
        message={item.message.displayBody}
        date={new Date(item.metadata.sent)}
        icon={{
          uri: `${
            item.sender.logoUrl ?? FALLBACK_ICON_URL
          }?w=64&h=64&fit=pad&fm=png`,
        }}
        unread={!item.metadata.read}
        onPress={() => onNotificationPress(item)}
        testID={testIDs.NOTIFICATION_CARD_BUTTON}
      />
    )
  }

  const keyExtractor = useCallback((item: ListItem) => item.id.toString(), [])

  return (
    <>
      <NavigationBarSheet
        componentId="notifications"
        title={intl.formatMessage({ id: 'notifications.screenTitle' })}
        onClosePress={() => router.back()}
        style={{ marginHorizontal: 16 }}
        showLoading={loading && !!data}
      />
      <SafeAreaView style={{ flex: 1 }} testID={testIDs.SCREEN_NOTIFICATIONS}>
        {showError ? (
          <Problem type="error" withContainer />
        ) : (
          <FlatList
            style={{ flex: 1, marginTop: theme.spacing[2] }}
            data={memoizedData}
            keyExtractor={keyExtractor}
            renderItem={renderNotificationItem}
            onEndReachedThreshold={0.5}
            onEndReached={handleEndReached}
            scrollEventThrottle={16}
            scrollToOverflowEnabled
            ListHeaderComponent={
              <ButtonWrapper>
                <Button
                  isOutlined
                  isUtilityButton
                  title={intl.formatMessage({
                    id: 'notifications.markAllAsRead',
                    defaultMessage: 'Merkja allt lesið',
                  })}
                  style={{
                    marginRight: theme.spacing[2],
                    maxWidth: 145,
                  }}
                  icon={inboxRead}
                  iconStyle={{ tintColor: theme.color.blue400 }}
                  onPress={() => markAllUserNotificationsAsRead()}
                />
                <Button
                  isOutlined
                  isUtilityButton
                  title={intl.formatMessage({
                    id: 'notifications.settings',
                    defaultMessage: 'Mínar stillingar',
                  })}
                  onPress={() => router.navigate('/settings')}
                  icon={settings}
                  style={{
                    maxWidth: 145,
                  }}
                  iconStyle={{
                    tintColor: theme.color.blue400,
                    resizeMode: 'contain',
                  }}
                />
              </ButtonWrapper>
            }
            ListFooterComponent={
              loadingMore && !error ? (
                <LoadingWrapper>
                  <ActivityIndicator
                    size="small"
                    animating
                    color={theme.color.blue400}
                  />
                </LoadingWrapper>
              ) : null
            }
          />
        )}
      </SafeAreaView>
    </>
  )
}
