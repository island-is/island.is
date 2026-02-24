import Clipboard from 'expo-clipboard'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  Animated,
  Image,
  LayoutChangeEvent,
  ListRenderItemInfo,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import styled, { useTheme } from 'styled-components/native'
import {
  DocumentComment,
  useGetDocumentQuery,
} from '@/graphql/types/schema'
import { useDateTimeFormatter } from '@/hooks/use-date-time-formatter'
import { useLocale } from '@/hooks/use-locale'
import { Alert, Button, ListItemSkeleton, TopLine, Typography } from '@/ui'
import copyIcon from '@/ui/assets/icons/copy.png'
import { createSkeletonArr } from '@/utils/create-skeleton-arr'
import {
  DocumentListItem,
  TOGGLE_ANIMATION_DURATION,
} from './_components/document-list-item'
import { ButtonDrawer } from './_components/button-drawer'

type FlatListItem = DocumentComment | { __typename: 'Skeleton'; id: string }

const CaseNumberWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  column-gap: ${({ theme }) => theme.spacing.smallGutter}px;
`

const ListWrapper = styled.View`
  flex: 1;
  margin-top: ${({ theme }) => theme.spacing[2]}px;
`

const AlertsContainer = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  padding-bottom: ${({ theme }) => theme.spacing.p4}px;
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
`

export default function DocumentCommunicationsScreen() {
  const { id: documentId, ticketId, replyEmail } = useLocalSearchParams<{
    id: string
    ticketId?: string
    replyEmail?: string
  }>()
  const locale = useLocale()
  const theme = useTheme()
  const intl = useIntl()
  const formatDate = useDateTimeFormatter()
  const [shouldScroll, setShouldScroll] = useState(false)
  const [actionsHeight, setActionsHeight] = useState(0)
  const [refetching, setRefetching] = useState(false)
  const flatListRef = useRef<Animated.FlatList>(null)
  const scrollY = useRef(new Animated.Value(0)).current

  const docRes = useGetDocumentQuery({
    variables: {
      input: {
        id: documentId,
      },
      locale,
    },
  })

  const document = docRes.data?.documentV2
  const comments = document?.ticket?.comments ?? []
  const replyable =
    !docRes.loading && document && document.replyable
      ? document.replyable
      : false
  const closedForMoreReplies = document?.closedForMoreReplies ?? false
  const isSkeleton = docRes.loading && !docRes.data

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

  useEffect(() => {
    if (!isSkeleton && comments.length > 0) {
      setShouldScroll(true)
    }
  }, [isSkeleton, comments.length])

  const keyExtractor = useCallback(
    (item: FlatListItem, index: number) => item.id ?? `comment-${index}`,
    [],
  )

  const handleContentSizeChange = () => {
    if (shouldScroll) {
      setShouldScroll(false)
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: Number.MAX_SAFE_INTEGER,
          animated: true,
        })
      }, TOGGLE_ANIMATION_DURATION + 100)
    }
  }

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
          date={item.createdDate ? formatDate(item.createdDate) : undefined}
          hasTopBorder={index !== 0}
        />
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [comments.length],
  )

  const data = useMemo(
    () => (isSkeleton ? createSkeletonArr(8) : comments),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSkeleton, docRes.data],
  ) as FlatListItem[]

  const ticketIdValue = `#${document?.ticket?.id ?? ticketId ?? ''}`

  return (
    <>
      <CaseNumberWrapper>
        <Typography variant="eyebrow" color={theme.color.purple400}>
          {intl.formatMessage({ id: 'documentCommunications.caseNumber' })}
        </Typography>
        <Typography variant="body3">{ticketIdValue}</Typography>
        <TouchableOpacity
          onPress={() => Clipboard.setStringAsync(ticketIdValue)}
          style={{ marginLeft: 4 }}
        >
          <Image
            source={copyIcon}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </CaseNumberWrapper>

      <ListWrapper>
        <TopLine scrollY={scrollY} />
        <Animated.FlatList
          ref={flatListRef}
          keyExtractor={keyExtractor}
          initialNumToRender={50}
          contentContainerStyle={{
            paddingBottom: actionsHeight,
          }}
          data={data}
          renderItem={renderItem}
          style={{ flex: 1 }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            {
              useNativeDriver: true,
            },
          )}
          onContentSizeChange={handleContentSizeChange}
          refreshControl={
            <RefreshControl refreshing={refetching} onRefresh={handleRefresh} />
          }
        />

        {(closedForMoreReplies || (replyEmail && replyable)) && (
          <AlertsContainer
            onLayout={(event: LayoutChangeEvent) => {
              setActionsHeight(event.nativeEvent.layout.height)
            }}
          >
            <SafeAreaView style={{ rowGap: theme.spacing[2] }}>
              {closedForMoreReplies && (
                <Alert
                  type="info"
                  message={intl.formatMessage({
                    id: 'documentCommunications.cannotReply',
                  })}
                  hasBorder
                />
              )}
              {replyEmail && replyable && (
                <Alert
                  type="info"
                  message={intl.formatMessage(
                    {
                      id: 'documentCommunications.initialReply',
                    },
                    {
                      email: replyEmail,
                    },
                  )}
                  hasBorder
                />
              )}
            </SafeAreaView>
          </AlertsContainer>
        )}
      </ListWrapper>

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
    </>
  )
}
