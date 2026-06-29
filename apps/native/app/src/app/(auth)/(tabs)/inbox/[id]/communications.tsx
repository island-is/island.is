import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  Animated,
  ListRenderItemInfo,
  RefreshControl,
  SafeAreaView,
  View,
} from 'react-native'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import styled, { useTheme } from 'styled-components/native'

import { useApolloClient } from '@apollo/client'

import { StackScreen } from '@/components/stack-screen'
import {
  DocumentComment,
  useGetDocumentQuery,
  useGetProfileQuery,
} from '@/graphql/types/schema'
import { useLocale } from '@/hooks/use-locale'
import { Alert, Button, ListItemSkeleton } from '@/ui'
import { createSkeletonArr } from '@/utils/create-skeleton-arr'
import {
  DocumentListItem,
  TOGGLE_ANIMATION_DURATION,
} from '../../../../../components/document-list-item'
import { ButtonDrawer } from '../../../../../components/button-drawer'
import { uiStore } from '@/stores/ui-store'

type FlatListItem = DocumentComment | { __typename: 'Skeleton'; id: string }

const AlertsContainer = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  padding-bottom: ${({ theme }) => theme.spacing[2]}px;
`

export default function DocumentCommunicationsScreen() {
  const { id: documentId, ticketId } = useLocalSearchParams<{
    id: string
    ticketId?: string
  }>()
  const locale = useLocale()
  const theme = useTheme()
  const intl = useIntl()
  const [refetching, setRefetching] = useState(false)
  const flatListRef = useRef<Animated.FlatList>(null)
  const scrollY = useRef(new Animated.Value(0)).current

  const client = useApolloClient()

  const docRes = useGetDocumentQuery({
    variables: {
      input: {
        id: documentId,
      },
      locale,
    },
    // The document detail screen marks the doc as opened in the local cache
    // (see use-document.ts). This query's network response would overwrite
    // that back to whatever the server has (still `opened: false` — there's
    // no read-mutation yet), so re-assert it here.
    onCompleted: (data) => {
      const cacheId = client.cache.identify({
        __typename: 'DocumentV2',
        id: data.documentV2?.id,
      })
      if (!cacheId) return
      client.cache.modify({
        id: cacheId,
        fields: { opened: () => true },
      })
    },
  })

  const profileRes = useGetProfileQuery()
  const userEmail = profileRes.data?.getUserProfile?.email ?? undefined

  const document = docRes.data?.documentV2
  const comments = document?.ticket?.comments ?? []
  const replyable =
    !docRes.loading && document && document.replyable
      ? document.replyable
      : false
  const closedForMoreReplies = document?.closedForMoreReplies ?? false
  const isSkeleton = docRes.loading && !docRes.data

  const hasUserComment = comments.some((c) => c.isZendeskAgent === false)
  const hasAgencyReply = comments.some((c) => c.isZendeskAgent === true)
  const showAwaitingReplyAlert =
    replyable && hasUserComment && !hasAgencyReply && !!userEmail

  const handleRefresh = () => {
    setRefetching(true)
    docRes.refetch().finally(() => setRefetching(false))
  }

  const onReplyPress = () => {
    if (!document?.sender?.name) {
      return
    }

    router.push({
      pathname: '/(auth)/(tabs)/inbox/[id]/reply',
      params: {
        id: documentId,
        senderName: document.sender.name,
        subject: document.subject ?? '',
      },
    })
  }

  useFocusEffect(
    useCallback(() => {
      uiStore.setState({ tabsHidden: true })
      return () => {
        uiStore.setState({ tabsHidden: false })
      }
    }, []),
  )

  useEffect(() => {
    if (!isSkeleton && comments.length > 0) {
      // Scroll to the bottom of the list after the toggle animation duration
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true })
      }, TOGGLE_ANIMATION_DURATION)
      return () => clearTimeout(timer)
    }
  }, [isSkeleton, comments.length])

  const keyExtractor = useCallback(
    (item: FlatListItem, index: number) => item.id ?? `comment-${index}`,
    [],
  )

  const ticketIdNumber = document?.ticket?.id ?? ticketId ?? ''
  const ticketIdValue = `#${ticketIdNumber}`
  const caseNumberLabel = intl.formatMessage({
    id: 'documentCommunications.caseNumber',
  })

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<FlatListItem>) => {
      if (item.__typename === 'Skeleton') {
        return <ListItemSkeleton key={item.id} showDate={false} />
      }

      return (
        <DocumentListItem
          key={item.id}
          isOpen={index === comments.length - 1}
          closeable={comments.length > 1}
          sender={item.author ?? ''}
          title={item.author ?? ''}
          body={item.body ?? undefined}
          date={
            item.createdDate
              ? intl.formatDate(new Date(item.createdDate), {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : undefined
          }
          caseNumber={ticketIdNumber || undefined}
          caseNumberLabel={caseNumberLabel}
          hasTopBorder={index !== 0}
        />
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [comments.length, ticketIdNumber, caseNumberLabel],
  )

  const data = useMemo(
    () => (isSkeleton ? createSkeletonArr(8) : comments),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSkeleton, docRes.data],
  ) as FlatListItem[]

  return (
    <>
      <StackScreen
        networkStatus={docRes.networkStatus}
        options={{
          title: document?.subject ?? '',
          headerTitleAlign: 'center',
        }}
      />
      <View style={{ flexDirection: 'column', flex: 1 }}>
        {(closedForMoreReplies || showAwaitingReplyAlert) && (
          <AlertsContainer>
            <View style={{ rowGap: theme.spacing[2] }}>
              {closedForMoreReplies && (
                <Alert
                  type="info"
                  message={intl.formatMessage({
                    id: 'documentCommunications.cannotReply',
                  })}
                  hasBorder
                />
              )}
              {showAwaitingReplyAlert && (
                <Alert
                  type="info"
                  message={intl.formatMessage(
                    {
                      id: 'documentCommunications.initialReply',
                    },
                    {
                      email: userEmail,
                      caseNumber: ticketIdValue,
                    },
                  )}
                  hasBorder
                />
              )}
            </View>
          </AlertsContainer>
        )}
        <Animated.FlatList
          ref={flatListRef}
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
          ListFooterComponent={<SafeAreaView style={{ height: 160 }} />}
        />
        {replyable && !closedForMoreReplies && (
          <ButtonDrawer>
            <SafeAreaView>
              <Button
                title={intl.formatMessage({
                  id: 'documentDetail.buttonReply',
                })}
                isTransparent
                isOutlined
                iconPosition="start"
                icon={require('@/assets/icons/reply.png')}
                onPress={onReplyPress}
              />
            </SafeAreaView>
          </ButtonDrawer>
        )}
      </View>
    </>
  )
}
