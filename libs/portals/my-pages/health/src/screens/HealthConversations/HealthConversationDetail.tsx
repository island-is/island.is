import {
  Box,
  Button,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  formSubmit,
  formatDateWithTime,
  m,
  useIsPhoneWidth,
} from '@island.is/portals/my-pages/core'
import { MessageActions } from './components/MessageActions'
import CertificateAction from './components/CertificateAction'
import ConversationAvatar from './components/ConversationAvatar'
import ConversationBackButton from './components/ConversationBackButton'
import ConversationCancelSubmit from './components/ConversationCancelSubmit'
import ConversationMessageBody from './components/ConversationMessageBody'
import ConversationReplyForm from './components/ConversationReplyForm'
import MobileActionFooter from './components/MobileActionFooter'
import ReplyBlockedAlert from './components/ReplyBlockedAlert'
import { useUserInfo } from '@island.is/react-spa/bff'
import { Problem } from '@island.is/react-spa/shared'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
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
  const { isPhoneWidth } = useIsPhoneWidth()
  const [searchParams, setSearchParams] = useSearchParams()
  const certificatePaymentReturnId = searchParams.get('certificatePayment')
  const certificatePaymentCancelled = searchParams.get(
    'certificatePaymentCancelled',
  )

  useEffect(() => {
    if (!certificatePaymentCancelled) return
    toast.warning(
      formatMessage(messages.healthConversationCertificatePaymentCancelled),
      { toastId: 'certificatePaymentCancelled' },
    )
    searchParams.delete('certificatePaymentCancelled')
    setSearchParams(searchParams, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [certificatePaymentCancelled])

  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState('')

  const isMobileReplyView = replyOpen && isPhoneWidth
  const replyRef = useRef<HTMLDivElement>(null)
  const replyInputRef = useRef<HTMLTextAreaElement | null>(null)
  const replyTriggerRef = useRef<HTMLElement | null>(null)

  const openReply = () => {
    replyTriggerRef.current = document.activeElement as HTMLElement | null
    setReplyOpen(true)
  }

  useEffect(() => {
    if (replyOpen) {
      replyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      replyInputRef.current?.focus()
    } else {
      replyTriggerRef.current?.focus()
    }
  }, [replyOpen])

  const { data, loading, error, refetch } =
    useGetHealthConversationDetailQuery({
      fetchPolicy: 'cache-and-network',
      variables: { id },
    })

  const handleCertificatePaid = () => {
    toast.success(
      formatMessage(messages.healthConversationCertificatePaymentSuccess),
      { toastId: 'certificatePaymentSuccess' },
    )
    refetch()
    if (certificatePaymentReturnId) {
      searchParams.delete('certificatePayment')
      setSearchParams(searchParams, { replace: true })
    }
  }

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

  if (loading && !data) {
    return (
      <GridContainer>
        <GridRow marginTop={[1, 0, 0]}>
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
        <GridRow marginTop={[1, 0, 0]}>
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
        <GridRow marginTop={[1, 0, 0]}>
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

  /* There's no explicit "recipient" for an existing thread yet so we need this
  to approximate it */
  const latestStaffMessage = [...item.messages]
    .reverse()
    .find((msg) => msg.direction === 'STAFF')
  const replyToName = latestStaffMessage
    ? item.organization?.name ?? latestStaffMessage.senderGroupName ?? undefined
    : undefined

  const handleBack = () => {
    /* On mobile, replying takes over the screen, so back should return to the
    the thread first. On desktop the reply form is just appended below
    the (still visible) thread, so back always leaves the conversation.  */
    if (isMobileReplyView) {
      setReplyOpen(false)
    } else {
      navigate(HealthPaths.HealthConversations)
    }
  }

  return (
    <GridContainer>
      <GridRow marginTop={[1, 0, 0]}>
        <GridColumn span={['12/12', '12/12', '12/12', '10/12']}>
          <Box
            className={styles.messageCard}
            background="white"
            paddingTop={[2, 2, 3]}
            paddingBottom={[10, 5, 5]}
            paddingX={[2, 5, 5]}
          >
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              marginBottom={1}
              className={styles.detailHeader}
            >
              <Box className={styles.backButton}>
                <ConversationBackButton onClick={handleBack} />
              </Box>
              {!isMobileReplyView && (
                <MessageActions
                  bookmarked={item.isStarred}
                  archived={item.isArchived}
                  onReply={
                    !replyOpen && item.patientCanReply !== false
                      ? openReply
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

            {isMobileReplyView ? (
              /* Mobile takes over the screen while replying: the thread is
              hidden and only the recipient + reply form are shown. */
              <ConversationReplyForm
                ref={replyRef}
                replyToName={replyToName}
                value={replyText}
                onChange={setReplyText}
                inputRef={replyInputRef}
              />
            ) : (
              <>
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
                        justifyContent="spaceBetween"
                        alignItems="center"
                        paddingTop={index > 0 ? 3 : 0}
                        marginBottom={3}
                      >
                        <Box display="flex" flexDirection="row">
                          {isPatient ? (
                            <ConversationAvatar
                              variant="user"
                              name={userInfo.profile.name ?? ''}
                              large
                            />
                          ) : (
                            <ConversationAvatar
                              variant="organization"
                              logoUrl={item.organization?.logoUrl ?? undefined}
                              large
                            />
                          )}
                          <Box
                            display="flex"
                            flexDirection="column"
                            marginLeft={2}
                            justifyContent="center"
                          >
                            <Text
                              variant="eyebrow"
                              fontWeight="medium"
                              truncate
                            >
                              {senderName}
                            </Text>
                            <Text variant="medium">
                              {formatDateWithTime(msg.messageSentAt)}
                            </Text>
                          </Box>
                        </Box>
                        {msg.attachments.length > 0 && (
                          <Icon
                            icon="attach"
                            size="small"
                            color="black"
                            type="outline"
                            className={styles.attachmentIcon}
                          />
                        )}
                      </Box>

                      {/* Body */}
                      <ConversationMessageBody message={msg} />

                      {/* Certificate */}
                      {(msg.certificateId || msg.requiresPayment) && (
                        <CertificateAction
                          certificateId={msg.certificateId}
                          requiresPayment={msg.requiresPayment}
                          paid={msg.paid}
                          pendingPaymentId={msg.pendingPaymentId}
                          isReturningFromPayment={
                            !!msg.certificateId &&
                            msg.certificateId === certificatePaymentReturnId
                          }
                          onPaid={handleCertificatePaid}
                        />
                      )}

                      {/* Attachments */}
                      {msg.attachments.length > 0 &&
                        !(msg.requiresPayment && !msg.paid) && (
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
                                onClick={() =>
                                  formSubmit(file.downloadServiceURL)
                                }
                              >
                                {file.fileName}
                              </Button>
                            ))}
                          </Box>
                        )}
                    </Box>
                  )
                })}

                {/* Reply form — desktop only; mobile branches above */}
                {replyOpen && (
                  <ConversationReplyForm
                    ref={replyRef}
                    withSenderHeader
                    senderName={userInfo.profile.name ?? ''}
                    replyToName={replyToName}
                    value={replyText}
                    onChange={setReplyText}
                    inputRef={replyInputRef}
                  />
                )}
              </>
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
                  fluid={isPhoneWidth}
                />
              ) : item.patientCanReply === false ? (
                <ReplyBlockedAlert reason={item.replyBlockedReason} />
              ) : (
                <Button
                  variant="ghost"
                  size="medium"
                  preTextIcon="undo"
                  preTextIconType="outline"
                  onClick={openReply}
                  fluid={isPhoneWidth}
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
