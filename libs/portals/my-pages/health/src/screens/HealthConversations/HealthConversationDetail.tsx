import {
  AlertMessage,
  Box,
  Button,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  Input,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  formSubmit,
  formatDateWithTime,
  m,
} from '@island.is/portals/my-pages/core'
import { MessageActions } from './components/MessageActions'
import ConversationAvatar from './components/ConversationAvatar'
import ConversationCancelSubmit from './components/ConversationCancelSubmit'
import ConversationMessageBody from './components/ConversationMessageBody'
import MobileActionFooter from './components/MobileActionFooter'
import { useUserInfo } from '@island.is/react-spa/bff'
import { Problem } from '@island.is/react-spa/shared'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useWindowSize } from 'react-use'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import * as styles from './HealthConversations.css'
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
  const navigate = useNavigate()
  const location = useLocation()
  const justCreated =
    (location.state as { justCreated?: boolean } | null)?.justCreated ?? false
  const { width } = useWindowSize()
  const isMobileWidth = width < theme.breakpoints.sm

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

  const lastMessageIsFromPatient =
    item.messages[item.messages.length - 1]?.direction === 'PATIENT'

  return (
    <GridContainer>
      <GridRow marginTop={[1, 1, 2]}>
        <GridColumn span={['12/12', '12/12', '12/12', '10/12']}>
          <Box
            className={styles.messageCard}
            background="white"
            paddingTop={[2, 2, 3]}
            paddingBottom={[10, 10, 5]}
            paddingX={[2, 2, 5]}
          >
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              marginBottom={1}
            >
              <Box className={styles.backButton}>
                <Button
                  variant="text"
                  size="default"
                  aria-label={formatMessage(m.goBack)}
                  onClick={() => {
                    if (replyOpen) {
                      setReplyOpen(false)
                    } else {
                      navigate(HealthPaths.HealthConversations)
                    }
                  }}
                  colorScheme="light"
                >
                  <Icon icon="arrowBack" type="filled" />
                </Button>
              </Box>
              {!replyOpen && (
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
              )}
            </Box>

            <Text variant="h4" as="h1" marginBottom={2}>
              {item.title}
            </Text>

            {/* Message thread */}
            {item.messages.map((msg, index) => {
              const isPatient = msg.direction === 'PATIENT'
              const senderName = isPatient
                ? userInfo.profile.name ?? ''
                : item.organization?.name ?? msg.senderGroupName ?? ''

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
                    paddingTop={index > 0 ? 3 : 0}
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
                        logoUrl={item.organization?.logoUrl ?? undefined}
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
                  <ConversationMessageBody message={msg} />

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
                  paddingTop={3}
                  marginBottom={3}
                >
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
                        arg: item.organization?.name ?? '',
                      })}
                    </Text>
                  </Box>
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
              </div>
            )}

            <MobileActionFooter>
              {replyOpen ? (
                <ConversationCancelSubmit
                  cancelLabel={formatMessage(messages.cancel)}
                  submitLabel={formatMessage(messages.healthConversationSend)}
                  onCancel={() => setReplyOpen(false)}
                  onSubmit={handleReply}
                  submitDisabled={!replyText.trim()}
                  loading={replySending}
                  fluid={isMobileWidth}
                />
              ) : item.patientCanReply === false ? (
                <AlertMessage
                  type="info"
                  message={formatMessage(
                    lastMessageIsFromPatient
                      ? messages.healthConversationReplyClosedShortText
                      : messages.healthConversationReplyClosedText,
                  )}
                />
              ) : (
                <Button
                  variant="ghost"
                  size="medium"
                  preTextIcon="undo"
                  preTextIconType="outline"
                  onClick={() => setReplyOpen(true)}
                  fluid={isMobileWidth}
                >
                  {formatMessage(m.replyDocument)}
                </Button>
              )}
            </MobileActionFooter>
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default HealthConversationDetail
