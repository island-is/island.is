import React, { useCallback, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
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
import heartIcon from '@/assets/icons/health.png'
import documentIcon from '@/assets/icons/reader.png'
import illustrationSrc from '@/assets/illustrations/le-company-s3.png'
import { StackScreen } from '@/components/stack-screen'
import {
  HealthDirectorateHealthConversationStatusFilter,
  useGetHealthConversationsQuery,
} from '@/graphql/types/schema'
import { useHealthMessagesFilterStore } from '@/stores/health-messages-filter-store'
import {
  EmptyList,
  GeneralCardSkeleton,
  ListItem,
  Problem,
  SearchBar,
} from '@/ui'

export default function HealthMessagesScreen() {
  const intl = useIntl()
  const theme = useTheme()
  const [query, setQuery] = useState('')
  const { starred, archived } = useHealthMessagesFilterStore()

  const messagesRes = useGetHealthConversationsQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      input: {
        starred: starred || undefined,
        status: archived
          ? HealthDirectorateHealthConversationStatusFilter.Archived
          : undefined,
      },
    },
  })

  const conversations =
    messagesRes.data?.healthDirectorateHealthConversations ?? []

  const filteredConversations = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      return conversations
    }
    return conversations.filter((conversation) => {
      const title = conversation.title?.toLowerCase() ?? ''
      const sender = conversation.lastSenderGroupName?.toLowerCase() ?? ''
      return title.includes(q) || sender.includes(q)
    })
  }, [conversations, query])

  const showSearch = conversations.length > 0 || query.length > 0

  const [refetching, setRefetching] = useState(false)

  const onRefresh = useCallback(async () => {
    setRefetching(true)
    try {
      await messagesRes.refetch()
    } catch (e) {
      // noop
    } finally {
      setRefetching(false)
    }
  }, [messagesRes])

  // A single icon segment within the shared header pill.
  const renderHeaderIconSegment = (
    icon: ImageSourcePropType,
    onPress: () => void,
  ) => (
    <Pressable
      onPress={onPress}
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
      {renderHeaderIconSegment(filterIcon, () =>
        router.push('/health/messages/filter'),
      )}
      {renderHeaderIconSegment(composeIcon, () => {
        // TODO: navigate to the new-message / compose flow once it exists.
      })}
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
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
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
          <ListItem
            title={item.lastSenderGroupName ?? ''}
            subtitle={item.title ?? ''}
            date={item.lastMessageSentAt ?? undefined}
            unread={!item.isRead}
            starred={item.isStarred}
            icon={item.hasAttachment ? documentIcon : heartIcon}
          />
        )}
        ListEmptyComponent={
          messagesRes.loading && !messagesRes.data ? (
            <View>
              {Array.from({ length: 6 }).map((_, index) => (
                <GeneralCardSkeleton height={72} key={index} />
              ))}
            </View>
          ) : messagesRes.error ? (
            <View style={{ marginHorizontal: 16, marginTop: 24 }}>
              <Problem
                type="error"
                title={intl.formatMessage({ id: 'problem.error.title' })}
                message={intl.formatMessage({
                  id: 'health.messages.errorMessage',
                })}
                tag={messagesRes.error.message}
              />
            </View>
          ) : (
            <EmptyList
              title={<FormattedMessage id="health.messages.noMessagesTitle" />}
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
          )
        }
      />
    </View>
  )
}
