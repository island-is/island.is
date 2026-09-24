import React, { useCallback, useMemo, useRef, useState } from 'react'
import { NetworkStatus } from '@apollo/client'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageSourcePropType,
  Pressable,
  RefreshControl,
  View,
} from 'react-native'
import { router } from 'expo-router'
import { useTheme } from 'styled-components/native'

import composeIcon from '@/assets/icons/compose.png'
import filterIcon from '@/assets/icons/filter-icon.png'
import illustrationSrc from '@/assets/illustrations/le-company-s3.png'
import { OfflineIcon } from '@/components/offline/offline-icon'
import { StackScreen } from '@/components/stack-screen'
import {
  HealthDirectorateHealthConversationStatusFilter,
  useGetHealthConversationsQuery,
} from '@/graphql/types/schema'
import { useThrottleState } from '@/hooks/use-throttle-state'
import { useHealthMessagesFilterStore } from '@/stores/health-messages-filter-store'
import { useOrganizationsStore } from '@/stores/organizations-store'
import { pushOnce } from '@/utils/push-once'
import { EmptyList, ListItem, ListItemSkeleton, Problem, SearchBar } from '@/ui'

const DEFAULT_PAGE_SIZE = 50

export default function HealthMessagesScreen() {
  const intl = useIntl()
  const theme = useTheme()
  const [query, setQuery] = useState('')
  const search = useThrottleState(query)
  const { starred, archived } = useHealthMessagesFilterStore()
  const { getSenderLogo } = useOrganizationsStore()
  const [loadingMore, setLoadingMore] = useState(false)

  // The search is served by the endpoint (it matches the conversation title or
  // its group name), so filtering locally would only ever see the loaded pages.
  const input = useMemo(
    () => ({
      limit: DEFAULT_PAGE_SIZE,
      search: search.trim() || undefined,
      starred: starred || undefined,
      status: archived
        ? HealthDirectorateHealthConversationStatusFilter.Archived
        : undefined,
    }),
    [search, starred, archived],
  )

  const messagesRes = useGetHealthConversationsQuery({
    notifyOnNetworkStatusChange: true,
    variables: { input },
  })

  const page = messagesRes.data?.healthDirectoratePaginatedHealthConversations
  const conversations = page?.data ?? []

  const showSearch = conversations.length > 0 || query.length > 0

  // `cache-and-network` hands back a persisted empty inbox before the network
  // reply lands, so `data` being set is no proof we have rows — that flashed the
  // empty state on open. Refresh keeps its spinner instead.
  const showSkeletons =
    messagesRes.loading &&
    messagesRes.networkStatus !== NetworkStatus.refetch &&
    conversations.length === 0

  const [refetching, setRefetching] = useState(false)
  const loadingTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  const onRefresh = useCallback(async () => {
    try {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current)
      }
      setRefetching(true)
      await messagesRes.refetch()
      // Keep the spinner visible a moment after the (often instant) refetch
      // resolves so the refresh feels real — matches the inbox.
      loadingTimeout.current = setTimeout(() => {
        setRefetching(false)
      }, 1331)
    } catch (err) {
      setRefetching(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadMore = useCallback(async () => {
    if (loadingMore || messagesRes.loading || !page?.pageInfo.hasNextPage) {
      return
    }
    setLoadingMore(true)
    try {
      await messagesRes.fetchMore({
        variables: {
          input: { ...input, after: page.pageInfo.endCursor ?? undefined },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          const next =
            fetchMoreResult?.healthDirectoratePaginatedHealthConversations
          if (!next?.data.length) {
            return prev
          }
          return {
            healthDirectoratePaginatedHealthConversations: {
              ...next,
              data: [
                ...(prev.healthDirectoratePaginatedHealthConversations?.data ??
                  []),
                ...next.data,
              ],
            },
          }
        },
      })
    } catch {
      // Swallowed: the next onEndReached retries the same page.
    }
    setLoadingMore(false)
  }, [loadingMore, messagesRes, page, input])

  // A single icon segment within the shared header pill.
  const renderHeaderIconSegment = (
    icon: ImageSourcePropType,
    onPress: () => void,
    accessibilityLabel: string,
  ) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={{
        width: 46,
        height: 46,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        source={icon}
        resizeMode="contain"
        style={{ width: 20, height: 20, tintColor: theme.color.blue400 }}
      />
    </Pressable>
  )

  // The header applies its own (glass on iOS 26) background, so the icons are
  // rendered plain here to avoid a doubled-up background.
  const headerActions = (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {/* The custom `headerRight` opts out of the native header items, so the
          loading/offline indicator is rendered here instead. */}
      <OfflineIcon networkStatus={messagesRes.networkStatus} />
      {renderHeaderIconSegment(
        filterIcon,
        () => router.push('/health/messages/filter'),
        intl.formatMessage({ id: 'health.messages.filter.screenTitle' }),
      )}
      {renderHeaderIconSegment(
        composeIcon,
        () => router.push('/health/messages/new'),
        intl.formatMessage({ id: 'health.messages.compose.newTitle' }),
      )}
    </View>
  )

  return (
    <View style={{ flex: 1 }}>
      <StackScreen
        networkStatus={messagesRes.networkStatus}
        options={{
          title: intl.formatMessage({ id: 'health.messages.screenTitle' }),
          headerTitleAlign: 'center',
          headerRight: () => headerActions,
        }}
      />
      <FlatList
        style={{ flex: 1 }}
        data={conversations}
        keyExtractor={(item) => item.id}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        onEndReachedThreshold={0.5}
        onEndReached={loadMore}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: theme.spacing[3] }}>
              <ActivityIndicator
                size="small"
                animating
                color={theme.color.blue400}
              />
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={refetching} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          showSearch ? (
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: theme.spacing[2],
                paddingVertical: theme.spacing[1],
              }}
            >
              <SearchBar
                placeholder={intl.formatMessage({
                  id: 'health.messages.searchPlaceholder',
                })}
                value={query}
                onChangeText={setQuery}
              />
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              pushOnce({
                pathname: '/health/messages/[id]',
                params: { id: item.id },
              })
            }
          >
            <ListItem
              title={item.organization?.name ?? item.lastSenderGroupName ?? ''}
              subtitle={item.title ?? ''}
              date={item.lastMessageSentAt ?? undefined}
              unread={!item.isRead}
              starred={item.isStarred}
              attachment={item.hasAttachment}
              icon={getSenderLogo(item.organization, 75)}
            />
          </Pressable>
        )}
        ListEmptyComponent={
          showSkeletons ? (
            <View>
              {Array.from({ length: 8 }).map((_, index) => (
                <ListItemSkeleton key={index} />
              ))}
            </View>
          ) : messagesRes.error ? (
            <View style={{ marginHorizontal: 16, marginTop: 24 }}>
              <Problem
                type="error"
                error={messagesRes.error}
                title={intl.formatMessage({ id: 'problem.error.title' })}
                message={intl.formatMessage({
                  id: 'health.messages.errorMessage',
                })}
              />
            </View>
          ) : (
            <View
              style={{
                marginTop: theme.spacing[15],
                paddingHorizontal: theme.spacing[2],
              }}
            >
              <EmptyList
                title={
                  <FormattedMessage id="health.messages.noMessagesTitle" />
                }
                description={
                  <FormattedMessage id="health.messages.noMessagesText" />
                }
                image={
                  <Image
                    source={illustrationSrc}
                    style={{ width: 134, height: 204 }}
                    resizeMode="contain"
                  />
                }
              />
            </View>
          )
        }
      />
    </View>
  )
}
