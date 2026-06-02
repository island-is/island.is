import {
  AlertMessage,
  Box,
  Button,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  formSubmit,
  formatDateWithTime,
  m,
} from '@island.is/portals/my-pages/core'
import { MessageActions } from './components/MessageActions'
import ConversationAvatar from './components/ConversationAvatar'
import { useUserInfo } from '@island.is/react-spa/bff'
import { Problem } from '@island.is/react-spa/shared'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { messages } from '../../lib/messages'
import {
  useGetHealthConversationDetailQuery,
  useMarkHealthConversationAsReadMutation,
  useStarHealthConversationDetailMutation,
  useUnstarHealthConversationDetailMutation,
  useArchiveHealthConversationDetailMutation,
  useUnarchiveHealthConversationDetailMutation,
  useReplyToHealthConversationMutation,
} from './HealthConversationDetail.generated'

type UseParams = {
  id: string
}

const HealthConversationDetail = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  const { id } = useParams() as UseParams
  const userInfo = useUserInfo()
  const location = useLocation()
  const justCreated =
    (location.state as { justCreated?: boolean } | null)?.justCreated ?? false

  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const replyRef = useRef<HTMLDivElement>(null)
  const replyInputRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (replyOpen) {
      replyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      replyInputRef.current?.focus()
    }
  }, [replyOpen])

  const { data, loading, error } = useGetHealthConversationDetailQuery({
    variables: { id },
  })

  const [markAsRead] = useMarkHealthConversationAsReadMutation({
    refetchQueries: ['GetHealthConversations'],
  })
  const onMutationError = () => toast.error(formatMessage(m.errorTitle))

  const [starMessage] = useStarHealthConversationDetailMutation({
    refetchQueries: ['GetHealthConversationDetail'],
    onError: onMutationError,
  })
  const [unstarMessage] = useUnstarHealthConversationDetailMutation({
    refetchQueries: ['GetHealthConversationDetail'],
    onError: onMutationError,
  })
  const [archiveMessage] = useArchiveHealthConversationDetailMutation({
    refetchQueries: ['GetHealthConversationDetail'],
    onError: onMutationError,
  })
  const [unarchiveMessage] = useUnarchiveHealthConversationDetailMutation({
    refetchQueries: ['GetHealthConversationDetail'],
    onError: onMutationError,
  })
  const [replyToMessage, { loading: replySending }] =
    useReplyToHealthConversationMutation({
      refetchQueries: ['GetHealthConversationDetail'],
    })

  const item = data?.healthDirectorateHealthConversation

  // Mark as read once when the thread first loads and hasn't been read yet
  useEffect(() => {
    if (item?.isRead === false) {
      markAsRead({ variables: { input: { id } } })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id])

  if (loading) {
    return (
      <GridContainer>
        <GridRow marginTop={2}>
          <GridColumn span={['12/12', '12/12', '12/12', '10/12']}>
            <Box padding={6}>
              <CardLoader />
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    )
  }

  if (error) {
    return (
      <GridContainer>
        <GridRow marginTop={2}>
          <GridColumn span={['12/12', '12/12', '12/12', '10/12']}>
            <Box padding={6}>
              <Problem error={error} noBorder={false} />
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    )
  }

  if (!item) {
    return (
      <GridContainer>
        <GridRow marginTop={2}>
          <GridColumn span={['12/12', '12/12', '12/12', '10/12']}>
            <Box padding={6}>
              <Problem
                type="no_data"
                noBorder={false}
                title={formatMessage(messages.healthConversationNotFound)}
              />
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    )
  }

  const handleReply = async () => {
    if (!replyText.trim()) return
    try {
      await replyToMessage({
        variables: {
          input: { id, messageTextContent: replyText },
        },
      })
      setReplyText('')
      setReplyOpen(false)
    } catch {
      toast.error(formatMessage(m.errorTitle))
    }
  }

  return (
    <GridContainer>
      <GridRow marginTop={2}>
        <GridColumn span={['12/12', '12/12', '12/12', '10/12']}>
          <Box
            background="white"
            borderColor="blue200"
            borderWidth="standard"
            borderRadius="large"
            paddingTop={3}
            paddingBottom={[3, 3, 5]}
            paddingX={[2, 2, 5]}
          >
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              marginBottom={0}
            >
              <Text variant="h3" as="h1">
                {item.title}
              </Text>
              <MessageActions
                bookmarked={item.isStarred}
                archived={item.isArchived}
                onReply={
                  item.patientCanReply !== false
                    ? () => setReplyOpen(true)
                    : undefined
                }
                onFav={() => {
                  if (item.isStarred) {
                    unstarMessage({ variables: { input: { id } } })
                  } else {
                    starMessage({ variables: { input: { id } } })
                  }
                }}
                onStash={() => {
                  if (item.isArchived) {
                    unarchiveMessage({ variables: { input: { id } } })
                  } else {
                    archiveMessage({ variables: { input: { id } } })
                  }
                }}
              />
            </Box>

            {/* Message thread */}
            {item.messages.map((msg, index) => {
              const isPatient = msg.direction === 'PATIENT'
              const senderName = isPatient
                ? userInfo.profile.name ?? ''
                : msg.senderGroupName ?? item.lastSenderGroupName ?? ''

              return (
                <Box key={msg.id}>
                  {index > 0 && (
                    <Box paddingY={1}>
                      <Divider />
                    </Box>
                  )}

                  {/* Sender info */}
                  <Box
                    display="flex"
                    flexDirection="row"
                    paddingTop={3}
                    marginBottom={3}
                  >
                    {isPatient ? (
                      <ConversationAvatar
                        variant="user"
                        name={userInfo.profile.name ?? ''}
                      />
                    ) : (
                      <ConversationAvatar
                        variant="organization"
                        name={senderName}
                      />
                    )}
                    <Box
                      display="flex"
                      flexDirection="column"
                      marginLeft={2}
                      justifyContent="center"
                    >
                      <Text variant="eyebrow" fontWeight="medium" truncate>
                        {senderName}
                      </Text>
                      <Text variant="medium">
                        {formatDateWithTime(msg.messageSentAt)}
                      </Text>
                    </Box>
                  </Box>

                  {/* Body */}
                  {msg.messageTextContent && (
                    <Box marginBottom={4} style={{ whiteSpace: 'pre-line' }}>
                      <Text fontWeight="light">{msg.messageTextContent}</Text>
                    </Box>
                  )}

                  {/* Attachments */}
                  {msg.attachments.length > 0 && (
                    <Box
                      display="flex"
                      flexWrap="wrap"
                      columnGap={2}
                      rowGap={1}
                      marginBottom={3}
                    >
                      {msg.attachments.map((file) => (
                        <Button
                          key={file.id}
                          variant="utility"
                          icon="document"
                          iconType="outline"
                          onClick={() => formSubmit(file.downloadServiceURL)}
                        >
                          {file.fileName}
                        </Button>
                      ))}
                    </Box>
                  )}
                </Box>
              )
            })}

            {/* Reply button — below thread, hidden when form is open */}
            {!replyOpen && item.patientCanReply !== false && (
              <Box marginTop={6}>
                <Button
                  variant="ghost"
                  size="small"
                  preTextIcon="document"
                  preTextIconType="outline"
                  onClick={() => setReplyOpen(true)}
                >
                  {formatMessage(m.replyDocument)}
                </Button>
              </Box>
            )}

            {/* Sent confirmation banner */}
            {justCreated && !replyOpen && (
              <Box marginTop={4}>
                <AlertMessage
                  type="success"
                  title={formatMessage(messages.healthConversationSentTitle)}
                  message={formatMessage(messages.healthConversationSentText)}
                />
              </Box>
            )}

            {/* Reply form */}
            {replyOpen && (
              <div ref={replyRef}>
                <Box paddingY={1}>
                  <Divider />
                </Box>

                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="spaceBetween"
                  paddingTop={3}
                  marginBottom={3}
                >
                  <Box display="flex" flexDirection="row">
                    <ConversationAvatar
                      variant="user"
                      name={userInfo.profile.name ?? ''}
                    />
                    <Box
                      display="flex"
                      flexDirection="column"
                      marginLeft={2}
                      justifyContent="center"
                    >
                      <Text variant="eyebrow" fontWeight="medium" truncate>
                        {userInfo.profile.name ?? ''}
                      </Text>
                      <Text variant="medium">
                        {formatMessage(messages.healthConversationTo, {
                          arg: item.lastSenderGroupName ?? '',
                        })}
                      </Text>
                    </Box>
                  </Box>
                  <Button
                    circle
                    icon="close"
                    colorScheme="light"
                    aria-label={formatMessage(
                      messages.healthConversationCloseReply,
                    )}
                    onClick={() => setReplyOpen(false)}
                  />
                </Box>

                <Box marginBottom={3}>
                  <Input
                    textarea
                    rows={6}
                    name="reply-message"
                    label={formatMessage(m.messages)}
                    backgroundColor="blue"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    ref={replyInputRef}
                  />
                </Box>

                <Box display="flex" justifyContent="flexEnd">
                  <Button
                    size="small"
                    onClick={handleReply}
                    loading={replySending}
                    disabled={!replyText.trim()}
                  >
                    {formatMessage(messages.healthConversationSend)}
                  </Button>
                </Box>
              </div>
            )}
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default HealthConversationDetail
