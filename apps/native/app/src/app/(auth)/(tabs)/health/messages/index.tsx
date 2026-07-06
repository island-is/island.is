import React, { useCallback } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { FlatList, Image, RefreshControl, View } from 'react-native'

import heartIcon from '@/assets/icons/health.png'
import documentIcon from '@/assets/icons/reader.png'
import illustrationSrc from '@/assets/illustrations/le-company-s3.png'
import { StackScreen } from '@/components/stack-screen'
import { useGetHealthConversationsQuery } from '@/graphql/types/schema'
import { EmptyList, GeneralCardSkeleton, ListItem, Problem } from '@/ui'

export default function HealthMessagesScreen() {
  const intl = useIntl()

  const messagesRes = useGetHealthConversationsQuery({
    notifyOnNetworkStatusChange: true,
  })

  const conversations =
    messagesRes.data?.healthDirectorateHealthConversations ?? []

  const onRefresh = useCallback(() => {
    messagesRes.refetch()
  }, [messagesRes])

  return (
    <View style={{ flex: 1 }}>
      <StackScreen
        networkStatus={messagesRes.networkStatus}
        options={{
          title: intl.formatMessage({ id: 'health.messages.screenTitle' }),
        }}
      />
      <FlatList
        style={{ flex: 1 }}
        data={conversations}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={messagesRes.loading && !!messagesRes.data}
            onRefresh={onRefresh}
          />
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
