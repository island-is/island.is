import { NavigationBarSheet, NotificationCard, Skeleton } from '@ui'
import { dismissAllNotificationsAsync } from 'expo-notifications'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  TouchableHighlight,
  View,
} from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import { useTheme } from 'styled-components'

import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { navigateToNotification } from '../../lib/deep-linking'
import { testIDs } from '../../utils/test-ids'
import {
  GetUserNotificationsQuery,
  Notification,
  useGetUserNotificationsQuery,
  useMarkUserNotificationAsReadMutation,
} from '../../graphql/types/schema'

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

type ListItem =
  | {
      id: number
      __typename: 'Skeleton'
    }
  | NotificationItem

export const NotificationsScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
  const intl = useIntl()
  const theme = useTheme()
  const [loadingMore, setLoadingMore] = useState(false)

  const res = useGetUserNotificationsQuery({
    fetchPolicy: 'network-only',
    variables: { input: { limit: DEFAULT_PAGE_SIZE, before: '', after: '' } },
  })

  const [markUserNotificationAsRead] = useMarkUserNotificationAsReadMutation()

  const onNotificationPress = useCallback((notification: Notification) => {
    // Mark notification as read and seen
    markUserNotificationAsRead({ variables: { id: notification.id } })
    navigateToNotification(notification, componentId)
  }, [])

  useEffect(() => {
    dismissAllNotificationsAsync()
  })

  const SkeletonItem = () => {
    const theme = useTheme()
    return (
      <View>
        <Skeleton
          active
          overlayColor={{
            dark: theme.shades.dark.shade200,
            light: theme.color.blue200,
          }}
          overlayOpacity={1}
          height={126}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: theme.color.blue200,
          }}
        />
      </View>
    )
  }

  // Return skeleton items or real data
  const data = useMemo<ListItem[]>(() => {
    if (res?.loading && !res?.data) {
      return Array.from({ length: 5 }).map((_, id) => ({
        id,
        __typename: 'Skeleton',
      }))
    }
    return res?.data?.userNotifications?.data || []
  }, [res.data, res.loading])

  const renderNotificationItem = ({ item }: { item: ListItem }) => {
    if (item?.__typename === 'Skeleton') {
      return <SkeletonItem />
    } else {
      return (
        <TouchableHighlight
          underlayColor={
            theme.isDark ? theme.shades.dark.shade100 : theme.color.blue100
          }
          onPress={() => onNotificationPress(item)}
          testID={testIDs.NOTIFICATION_CARD_BUTTON}
        >
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
            unread={!item.metadata.read}
            onPress={() => onNotificationPress(item)}
          />
        </TouchableHighlight>
      )
    }
  }

  const keyExtractor = useCallback((item: ListItem) => {
    return item.id.toString()
  }, [])

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
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderNotificationItem}
          onEndReachedThreshold={0.1}
          onEndReached={() => {
            if (loadingMore || res.loading) {
              return
            }
            setLoadingMore(true)

            // TODO: Fix fetchMore so it is only called once and all previous data is kept
            return res
              .fetchMore({
                variables: {
                  input: {
                    limit: DEFAULT_PAGE_SIZE,
                    before: '',
                    after:
                      res?.data?.userNotifications?.pageInfo.endCursor ?? '',
                  },
                },
                updateQuery: (prevResult, { fetchMoreResult }) => {
                  if (
                    fetchMoreResult?.userNotifications?.data.length &&
                    prevResult?.userNotifications?.data.length
                  ) {
                    fetchMoreResult.userNotifications.data = [
                      ...prevResult.userNotifications.data,
                      ...fetchMoreResult.userNotifications.data,
                    ]
                    return fetchMoreResult
                  }
                  return prevResult
                },
              })
              .finally(() => setLoadingMore(false))
          }}
          ListFooterComponent={
            loadingMore ? (
              <View>
                <ActivityIndicator size="small" animating />
              </View>
            ) : null
          }
        />
      </SafeAreaView>
    </>
  )
}

NotificationsScreen.options = getNavigationOptions
