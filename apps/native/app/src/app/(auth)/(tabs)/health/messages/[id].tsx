import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import {
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  SafeAreaView,
  View,
} from 'react-native'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'

import { StackScreen } from '@/components/stack-screen'
import { ButtonDrawer } from '@/components/button-drawer'
import {
  GetHealthConversationQuery,
  HealthDirectorateHealthConversationDirection,
  useGetHealthConversationQuery,
  useMarkHealthConversationAsReadMutation,
} from '@/graphql/types/schema'
import { useAuthStore } from '@/stores/auth-store'
import { uiStore } from '@/stores/ui-store'
import {
  Alert,
  Button,
  GeneralCardSkeleton,
  ListItemSkeleton,
  theme,
} from '@/ui'
import { createSkeletonArr } from '@/utils/create-skeleton-arr'
import { DocumentListItem } from '@/components/document-list-item'

type ConversationMessage = NonNullable<
  GetHealthConversationQuery['healthDirectorateHealthConversation']
>['messages'][number]

type FlatListItem = ConversationMessage | { __typename: 'Skeleton'; id: string }

export default function HealthMessageDetailScreen() {
  const { id, justCreated } = useLocalSearchParams<{
    id: string
    justCreated?: string
  }>()
  const intl = useIntl()
  const client = useApolloClient()
  const userName = useAuthStore((s) => s.userInfo?.name)
  const [refetching, setRefetching] = useState(false)

  const res = useGetHealthConversationQuery({
    variables: { id },
    notifyOnNetworkStatusChange: true,
  })

  const conversation = res.data?.healthDirectorateHealthConversation
  const messages = useMemo(() => conversation?.messages ?? [], [conversation])
  const isSkeleton = res.loading && !res.data

  const [markAsRead] = useMarkHealthConversationAsReadMutation({
    // Fire-and-forget: the server state self-corrects on the next load.
    onError: () => undefined,
  })

  // Once the thread has rendered the user has seen it, so clear the unread
  // state on the list's cache entry right away — rather than waiting for the mutation.
  useEffect(() => {
    if (conversation?.isRead === false) {
      const cacheId = client.cache.identify({
        __typename: 'HealthDirectorateHealthConversation',
        id,
      })
      if (cacheId) {
        client.cache.modify({ id: cacheId, fields: { isRead: () => true } })
      }
      markAsRead({ variables: { input: { id } } })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation?.id])

  const handleRefresh = () => {
    setRefetching(true)
    res.refetch().finally(() => setRefetching(false))
  }

  // Hide the tab bar while viewing a conversation (matches the inbox
  // communications screen).
  useFocusEffect(
    useCallback(() => {
      uiStore.setState({ tabsHidden: true })
      return () => {
        uiStore.setState({ tabsHidden: false })
      }
    }, []),
  )

  const keyExtractor = useCallback(
    (item: FlatListItem, index: number) => item.id ?? `message-${index}`,
    [],
  )

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<FlatListItem>) => {
      if (item.__typename === 'Skeleton') {
        return <ListItemSkeleton key={item.id} showDate={false} />
      }

      // The patient's own name isn't returned in the message entries (only
      // STAFF senders carry `senderGroupName`), so fall back to the profile
      // name for patient messages — matching the web (my-pages) behaviour.
      const isPatient =
        item.direction === HealthDirectorateHealthConversationDirection.Patient
      const senderName = isPatient
        ? userName ?? ''
        : item.senderGroupName ?? conversation?.lastSenderGroupName ?? ''

      const sentAt = new Date(item.messageSentAt)
      const dateTime = item.messageSentAt
        ? `${intl.formatDate(sentAt, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })} - ${intl.formatTime(sentAt, {
            hour: '2-digit',
            minute: '2-digit',
          })}`
        : undefined

      return (
        <DocumentListItem
          key={item.id}
          isOpen={index === messages.length - 1}
          closeable={messages.length > 1}
          sender={senderName}
          title={senderName}
          body={item.messageTextContent ?? undefined}
          date={dateTime}
          hasTopBorder={index !== 0}
        />
      )
    },
    [messages.length, intl, userName, conversation?.lastSenderGroupName],
  )

  const data = useMemo(
    () => (isSkeleton ? createSkeletonArr(8) : messages),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSkeleton, res.data],
  ) as FlatListItem[]

  return (
    <>
      <StackScreen
        networkStatus={res.networkStatus}
        options={{
          title: conversation?.title ?? '',
          headerTitleAlign: 'center',
        }}
      />
      <View style={{ flexDirection: 'column', flex: 1 }}>
        <FlatList
          keyExtractor={keyExtractor}
          initialNumToRender={50}
          data={data}
          renderItem={renderItem}
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={refetching} onRefresh={handleRefresh} />
          }
          contentContainerStyle={{ flexGrow: 1 }}
          contentInsetAdjustmentBehavior="automatic"
          automaticallyAdjustContentInsets
          ListHeaderComponent={
            justCreated === 'true' && conversation ? (
              <View
                style={{
                  paddingHorizontal: theme.spacing[2],
                  paddingTop: theme.spacing[2],
                }}
              >
                <Alert
                  type="success"
                  title={intl.formatMessage({
                    id: 'health.messages.sentTitle',
                  })}
                  message={intl.formatMessage({
                    id: 'health.messages.sentText',
                  })}
                  hasBorder
                />
              </View>
            ) : null
          }
          ListFooterComponent={
            <SafeAreaView
              style={{ height: conversation?.patientCanReply ? 160 : 24 }}
            />
          }
        />
        {isSkeleton || conversation ? (
          <ButtonDrawer>
            <SafeAreaView>
              {isSkeleton ? (
                <GeneralCardSkeleton height={48} />
              ) : conversation?.patientCanReply ? (
                <Button
                  title={intl.formatMessage({
                    id: 'health.messages.replyButton',
                  })}
                  isTransparent
                  isOutlined
                  iconPosition="start"
                  icon={require('@/assets/icons/reply.png')}
                  onPress={() =>
                    router.push({
                      pathname: '/health/messages/new',
                      params: {
                        conversationId: id,
                        recipientName: conversation?.lastSenderGroupName ?? '',
                        subject: conversation?.title ?? '',
                      },
                    })
                  }
                />
              ) : (
                <Alert
                  type="info"
                  message={intl.formatMessage({
                    id: 'health.messages.cannotReply',
                  })}
                  hasBorder
                />
              )}
            </SafeAreaView>
          </ButtonDrawer>
        ) : null}
      </View>
    </>
  )
}
