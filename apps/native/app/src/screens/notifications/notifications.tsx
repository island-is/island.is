import {
  Button,
  NavigationBarSheet,
  NotificationCard,
  Skeleton,
  Problem,
} from '@ui'
import { useApolloClient } from '@apollo/client'

import { dismissAllNotificationsAsync } from 'expo-notifications'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { ActivityIndicator, FlatList, SafeAreaView } from 'react-native'
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
  useMarkAllNotificationsAsReadMutation,
  useMarkAllNotificationsAsSeenMutation,
  useMarkUserNotificationAsReadMutation,
} from '../../graphql/types/schema'

import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { navigateTo, navigateToNotification } from '../../lib/deep-linking'
import { useNotificationsStore } from '../../stores/notifications-store'
import {
  createSkeletonArr,
  SkeletonItem,
} from '../../utils/create-skeleton-arr'
import { isAndroid } from '../../utils/devices'
import { testIDs } from '../../utils/test-ids'
import settings from '../../assets/icons/settings.png'
import inboxRead from '../../assets/icons/inbox-read.png'

const LoadingWrapper = styled.View`
  padding-vertical: ${({ theme }) => theme.spacing[3]}px;
  ${({ theme }) => isAndroid && `padding-bottom: ${theme.spacing[6]}px;`}
`

const ButtonWrapper = styled.View`
  flex-direction: row;
  margin-horizontal: ${({ theme }) => theme.spacing[2]}px;
  margin-top: ${({ theme }) => theme.spacing[2]}px;
`

const DEFAULT_PAGE_SIZE = 50

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
  const client = useApolloClient()
  const [loadingMore, setLoadingMore] = useState(false)
  const updateNavigationUnseenCount = useNotificationsStore(
    ({ updateNavigationUnseenCount }) => updateNavigationUnseenCount,
  )

  const { data, loading, error, fetchMore } = useGetUserNotificationsQuery({
    variables: { input: { limit: DEFAULT_PAGE_SIZE } },
  })
  const showError = error && !data

  const [markUserNotificationAsRead] = useMarkUserNotificationAsReadMutation()
  const [markAllUserNotificationsAsSeen] =
    useMarkAllNotificationsAsSeenMutation()

  const [markAllUserNotificationsAsRead] =
    useMarkAllNotificationsAsReadMutation({
      onCompleted: (d) => {
        if (d.markAllNotificationsRead?.success) {
          // If all notifications are marked as read, update cache to reflect that
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

    return data?.userNotifications?.data || []
  }, [data, loading])

  const onNotificationPress = useCallback((notification: Notification) => {
    // Mark notification as read and seen
    void markUserNotificationAsRead({ variables: { id: notification.id } })

    navigateToNotification({
      componentId,
      link: notification.message?.link?.url,
    })
  }, [])

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
            uri: `${item.sender.logoUrl}?w=64&h=64&fit=pad&fm=png`,
          }
        }
        unread={!item.metadata.read}
        onPress={() => onNotificationPress(item)}
        testID={testIDs.NOTIFICATION_CARD_BUTTON}
      />
    )
  }

  const keyExtractor = useCallback(
    (item: ListItem) => item.id.toString(),
    [memoizedData],
  )

  return (
    <>
      <NavigationBarSheet
        componentId={componentId}
        title={intl.formatMessage({ id: 'notifications.screenTitle' })}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{ marginHorizontal: 16 }}
        showLoading={loading && !!data}
      />
      <SafeAreaView style={{ flex: 1 }} testID={testIDs.SCREEN_NOTIFICATIONS}>
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
            onPress={() => navigateTo('/settings', componentId)}
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

NotificationsScreen.options = getNavigationOptions
