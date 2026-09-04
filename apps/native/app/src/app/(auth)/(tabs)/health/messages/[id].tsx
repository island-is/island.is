import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  View,
} from 'react-native'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'

import { StackScreen } from '@/components/stack-screen'
import { ButtonDrawer } from '@/components/button-drawer'
import { OfflineIcon } from '@/components/offline/offline-icon'
import {
  GetHealthConversationQuery,
  HealthDirectorateHealthConversationDirection,
  HealthDirectorateHealthConversationReplyBlockedReason,
  useArchiveHealthConversationMutation,
  useGetHealthConversationQuery,
  useMarkHealthConversationAsReadMutation,
  useStarHealthConversationMutation,
  useUnarchiveHealthConversationMutation,
  useUnstarHealthConversationMutation,
} from '@/graphql/types/schema'
import { useAuthStore } from '@/stores/auth-store'
import { uiStore } from '@/stores/ui-store'
import { useBrowser } from '@/hooks/use-browser'
import { useMyPagesLinks } from '@/lib/my-pages-links'
import {
  Alert,
  Button,
  GeneralCardSkeleton,
  ListItemSkeleton,
  ProblemTemplate,
  theme,
} from '@/ui'
import { createSkeletonArr } from '@/utils/create-skeleton-arr'
import { downloadHealthAttachment } from '@/utils/download-health-attachment'
import { HealthConversationMessageContent } from '@/components/health-conversation-message-content'
import { DocumentListItem } from '@/components/document-list-item'
import { toast } from '@/components/toast'

type ConversationMessage = NonNullable<
  GetHealthConversationQuery['healthDirectorateHealthConversation']
>['messages'][number]

type FlatListItem = ConversationMessage | { __typename: 'Skeleton'; id: string }

// Maps a reply-blocked reason to its explanatory message.
const replyBlockedMessageId = (
  reason?: HealthDirectorateHealthConversationReplyBlockedReason | null,
): string => {
  switch (reason) {
    case HealthDirectorateHealthConversationReplyBlockedReason.OutsideMessagingWindow:
      return 'health.messages.replyBlocked.outsideWindow'
    case HealthDirectorateHealthConversationReplyBlockedReason.ReplyWindowExpired:
      return 'health.messages.replyBlocked.windowExpired'
    case HealthDirectorateHealthConversationReplyBlockedReason.AwaitingStaffReply:
      return 'health.messages.replyBlocked.awaitingStaff'
    case HealthDirectorateHealthConversationReplyBlockedReason.RepliesDisabled:
      return 'health.messages.replyBlocked.repliesDisabled'
    default:
      return 'health.messages.replyBlocked.default'
  }
}

export default function HealthMessageDetailScreen() {
  const { id, justCreated } = useLocalSearchParams<{
    id: string
    justCreated?: string
  }>()
  const intl = useIntl()
  const client = useApolloClient()
  const myPagesLinks = useMyPagesLinks()
  const userName = useAuthStore((s) => s.userInfo?.name)
  const [refetching, setRefetching] = useState(false)

  const res = useGetHealthConversationQuery({
    variables: { id },
    notifyOnNetworkStatusChange: true,
  })
  const { refetch } = res

  const loadingTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)
  // Clear the pending spinner-delay timeout on unmount so it can't fire
  // setRefetching after the screen is gone.
  useEffect(() => {
    return () => {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current)
      }
    }
  }, [])
  // Refetch the conversation, keeping the refresh spinner visible a moment after
  // the (often instant) refetch resolves so it feels real — matches the inbox.
  const refreshConversation = useCallback(async () => {
    try {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current)
      }
      setRefetching(true)
      await refetch()
      loadingTimeout.current = setTimeout(() => {
        setRefetching(false)
      }, 1331)
    } catch {
      setRefetching(false)
    }
  }, [refetch])

  const { openBrowser } = useBrowser()
  // openBrowser is a fresh closure each render; read it through a ref so the
  // pay handler below stays stable.
  const openBrowserRef = useRef(openBrowser)
  openBrowserRef.current = openBrowser

  // Open My Pages to pay in the in-app browser. openBrowser resolves when the
  // browser is dismissed, so refetch right after — a completed payment comes
  // back as paid: true and the certificate becomes available.
  const handleCertificatePayPress = useCallback(async () => {
    await openBrowserRef.current(myPagesLinks.healthMessageDetail(id))
    // Show the same refresh spinner as pull-to-refresh while we re-fetch, so the
    // user gets feedback that the certificate is being updated after payment.
    await refreshConversation()
  }, [myPagesLinks, id, refreshConversation])

  const conversation = res.data?.healthDirectorateHealthConversation
  const messages = useMemo(() => conversation?.messages ?? [], [conversation])
  const isSkeleton = res.loading && !res.data

  const [markAsRead] = useMarkHealthConversationAsReadMutation({
    // Fire-and-forget: the server state self-corrects on the next load.
    onError: () => undefined,
  })

  const [archiveConversation] = useArchiveHealthConversationMutation()
  const [unarchiveConversation] = useUnarchiveHealthConversationMutation()
  const [starConversation] = useStarHealthConversationMutation()
  const [unstarConversation] = useUnstarHealthConversationMutation()

  // Optimistic overrides so the header icon flips instantly on tap; fall back to
  // the server value until the user toggles. Reverted if the mutation fails.
  const [archivedOverride, setArchivedOverride] = useState<boolean | null>(null)
  const [starredOverride, setStarredOverride] = useState<boolean | null>(null)
  const isArchived = archivedOverride ?? conversation?.isArchived ?? false
  const isStarred = starredOverride ?? conversation?.isStarred ?? false

  // The list and detail queries normalize to separate cache entries, so keep
  // both in sync. Filtered-list membership is corrected by refetching
  // GetHealthConversations.
  const setConversationField = (
    field: 'isArchived' | 'isStarred' | 'isRead',
    value: boolean,
  ) => {
    for (const __typename of [
      'HealthDirectorateHealthConversation',
      'HealthDirectorateHealthConversationDetail',
    ] as const) {
      const cacheId = client.cache.identify({ __typename, id })
      if (cacheId) {
        client.cache.modify({ id: cacheId, fields: { [field]: () => value } })
      }
    }
  }

  const onToggleArchive = async () => {
    const archive = !isArchived
    setArchivedOverride(archive)
    try {
      const mutation = archive ? archiveConversation : unarchiveConversation
      await mutation({
        variables: { input: { id } },
        refetchQueries: ['GetHealthConversations'],
      })
      setConversationField('isArchived', archive)
      toast.success(
        intl.formatMessage({
          id: archive
            ? 'health.messages.archiveSuccess'
            : 'health.messages.unarchiveSuccess',
        }),
      )
    } catch {
      setArchivedOverride(!archive)
      toast.error(
        intl.formatMessage({
          id: archive
            ? 'health.messages.archiveError'
            : 'health.messages.unarchiveError',
        }),
      )
    }
  }

  const onToggleStar = async () => {
    const star = !isStarred
    setStarredOverride(star)
    try {
      const mutation = star ? starConversation : unstarConversation
      await mutation({
        variables: { input: { id } },
        refetchQueries: ['GetHealthConversations'],
      })
      setConversationField('isStarred', star)
      toast.success(
        intl.formatMessage({
          id: star
            ? 'health.messages.starSuccess'
            : 'health.messages.unstarSuccess',
        }),
      )
    } catch {
      setStarredOverride(!star)
      toast.error(
        intl.formatMessage({
          id: star
            ? 'health.messages.starError'
            : 'health.messages.unstarError',
        }),
      )
    }
  }

  // Once the thread has rendered the user has seen it, so clear the unread
  // state on the cache entries right away — rather than waiting for the mutation.
  useEffect(() => {
    if (conversation?.isRead === false) {
      setConversationField('isRead', true)
      markAsRead({ variables: { input: { id } } })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation?.id])

  const [downloadingAttachmentId, setDownloadingAttachmentId] = useState<
    string | null
  >(null)

  const handleAttachmentPress = useCallback(
    async (attachment: { id: string; fileName: string; url: string }) => {
      setDownloadingAttachmentId(attachment.id)
      try {
        await downloadHealthAttachment({
          url: attachment.url,
          fileName: attachment.fileName,
        })
      } catch (error) {
        console.error('Failed to download health attachment', error)
        toast.error(
          intl.formatMessage({ id: 'health.messages.attachmentError' }),
        )
      } finally {
        setDownloadingAttachmentId(null)
      }
    },
    [intl],
  )

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
        : conversation?.organization?.name ??
          item.senderGroupName ??
          conversation?.lastSenderGroupName ??
          ''

      // The certificate attached to this message needs paying before it can be
      // accessed. The app can't take the payment natively, so — matching the
      // compose flow's certificate notice — we point the user to My Pages.
      const isUnpaidCertificate = !!item.requiresPayment && !item.paid
      const certificateAmountLabel =
        item.amountIsk != null ? `${intl.formatNumber(item.amountIsk)} kr.` : ''

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
          logoUrl={
            isPatient ? undefined : conversation?.organization?.logoUrl ?? null
          }
          title={senderName}
          bodyContent={
            item.content || isUnpaidCertificate ? (
              <View style={{ rowGap: theme.spacing[2] }}>
                {item.content ? (
                  <HealthConversationMessageContent content={item.content} />
                ) : null}
                {isUnpaidCertificate ? (
                  <ProblemTemplate
                    variant="info"
                    showIcon
                    title={intl.formatMessage({
                      id: 'health.messages.certificatePayment.title',
                    })}
                    message={intl.formatMessage(
                      { id: 'health.messages.certificatePayment.text' },
                      { amount: certificateAmountLabel },
                    )}
                    detailLink={{
                      text: intl.formatMessage({
                        id: 'health.messages.certificatePayment.link',
                      }),
                      url: myPagesLinks.healthMessageDetail(id),
                      onPress: handleCertificatePayPress,
                    }}
                  />
                ) : null}
              </View>
            ) : undefined
          }
          date={dateTime}
          hasTopBorder={index !== 0}
          attachments={item.attachments.map((attachment) => ({
            id: attachment.id,
            label: attachment.fileName,
            loading: downloadingAttachmentId === attachment.id,
            onPress: () =>
              handleAttachmentPress({
                id: attachment.id,
                fileName: attachment.fileName,
                url: attachment.downloadServiceURL,
              }),
          }))}
        />
      )
    },
    [
      messages.length,
      intl,
      userName,
      id,
      myPagesLinks,
      handleCertificatePayPress,
      conversation?.lastSenderGroupName,
      conversation?.organization?.name,
      conversation?.organization?.logoUrl,
      downloadingAttachmentId,
      handleAttachmentPress,
    ],
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
          // Android centers a long title over the back arrow; left-align there
          // so it truncates next to it instead. iOS reserves the button space.
          headerTitleAlign: Platform.OS === 'android' ? 'left' : 'center',
          headerRight: conversation
            ? () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {/* Custom headerRight opts out of the native items API, so the
                      loading/offline indicator is rendered here instead. */}
                  <OfflineIcon networkStatus={res.networkStatus} />
                  <Pressable onPress={onToggleArchive} hitSlop={8}>
                    <Image
                      source={
                        isArchived
                          ? require('@/assets/icons/tray-filled.png')
                          : require('@/assets/icons/tray.png')
                      }
                      style={{
                        width: 24,
                        height: 24,
                        tintColor: theme.color.blue400,
                        marginHorizontal: 8,
                      }}
                    />
                  </Pressable>
                  <Pressable onPress={onToggleStar} hitSlop={8}>
                    <Image
                      source={
                        isStarred
                          ? require('@/assets/icons/star-filled.png')
                          : require('@/assets/icons/star.png')
                      }
                      style={{
                        width: 24,
                        height: 24,
                        tintColor: theme.color.blue400,
                        marginHorizontal: 8,
                      }}
                    />
                  </Pressable>
                </View>
              )
            : undefined,
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
            <RefreshControl
              refreshing={refetching}
              onRefresh={refreshConversation}
            />
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
                        recipientName:
                          conversation?.organization?.name ??
                          conversation?.lastSenderGroupName ??
                          '',
                        subject: conversation?.title ?? '',
                      },
                    })
                  }
                />
              ) : (
                <Alert
                  type="info"
                  size="small"
                  message={intl.formatMessage({
                    id: replyBlockedMessageId(conversation?.replyBlockedReason),
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


