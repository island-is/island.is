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
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  formSubmit,
  getInitials,
  m,
} from '@island.is/portals/my-pages/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import { Problem } from '@island.is/react-spa/shared'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { messages } from '../../lib/messages'
import HealthMessageActionBar from './HealthMessageActionBar'
import {
  useGetHealthMessageDetailQuery,
  useMarkHealthMessageAsReadMutation,
  useStarHealthMessageDetailMutation,
  useUnstarHealthMessageDetailMutation,
  useArchiveHealthMessageDetailMutation,
  useUnarchiveHealthMessageDetailMutation,
  useReplyToHealthMessageMutation,
} from './HealthMessageDetail.generated'

type UseParams = {
  id: string
}

const CircleLogo = ({ organization }: { organization: string }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    borderRadius="full"
    background="blue100"
    style={{ minWidth: 48, height: 48, flexShrink: 0 }}
  >
    <Text variant="h5" as="p">
      {getInitials(organization)}
    </Text>
  </Box>
)

const UserInitialsAvatar = ({ name }: { name: string }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    borderRadius="full"
    background="blueberry100"
    style={{ width: 48, height: 48, flexShrink: 0 }}
  >
    <Text variant="h5" as="p">
      {getInitials(name)}
    </Text>
  </Box>
)

const formatMessageDateTime = (iso: string, locale: string) => {
  const d = new Date(iso)
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

const HealthMessageDetail = () => {
  useNamespaces('sp.health')
  const { formatMessage, lang } = useLocale()
  const { id } = useParams() as UseParams
  const userInfo = useUserInfo()
  const location = useLocation()
  const justCreated =
    (location.state as { justCreated?: boolean } | null)?.justCreated ?? false

  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const replyRef = useRef<HTMLDivElement>(null)

  const { data, loading, error } = useGetHealthMessageDetailQuery({
    variables: { id },
  })

  const [markAsRead] = useMarkHealthMessageAsReadMutation()
  const [starMessage] = useStarHealthMessageDetailMutation({
    refetchQueries: ['GetHealthMessageDetail'],
  })
  const [unstarMessage] = useUnstarHealthMessageDetailMutation({
    refetchQueries: ['GetHealthMessageDetail'],
  })
  const [archiveMessage] = useArchiveHealthMessageDetailMutation({
    refetchQueries: ['GetHealthMessageDetail'],
  })
  const [unarchiveMessage] = useUnarchiveHealthMessageDetailMutation({
    refetchQueries: ['GetHealthMessageDetail'],
  })
  const [replyToMessage, { loading: replySending }] =
    useReplyToHealthMessageMutation({
      refetchQueries: ['GetHealthMessageDetail'],
    })

  const item = data?.healthDirectorateHealthMessage

  // Mark as read once when the thread first loads and hasn't been read yet
  useEffect(() => {
    if (item?.isRead === false) {
      markAsRead({ variables: { id } })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id])

  if (loading) {
    return (
      <Box padding={6}>
        <CardLoader />
      </Box>
    )
  }

  if (error) {
    return (
      <Box padding={6}>
        <Problem error={error} noBorder={false} />
      </Box>
    )
  }

  if (!item) {
    return (
      <Box padding={6}>
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(messages.healthMessageNotFound)}
        />
      </Box>
    )
  }

  const handleReply = async () => {
    if (!replyText.trim()) return
    await replyToMessage({
      variables: {
        id,
        input: { messageTextContent: replyText },
      },
    })
    setReplyText('')
    setReplyOpen(false)
  }

  return (
    <GridContainer>
      <GridRow marginTop={2}>
        <GridColumn span={['12/12', '12/12', '10/12']}>
          <Box
            background="white"
            borderColor="blue200"
            borderWidth="standard"
            borderRadius="large"
            paddingTop={3}
            paddingBottom={5}
            paddingX={5}
          >
            {/* Header: subject + actions */}
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              marginBottom={3}
            >
              <Text variant="h3" as="h1">
                {item.title}
              </Text>
              <HealthMessageActionBar
                bookmarked={item.isStarred}
                archived={item.isArchived}
                onReply={item.patientCanReply !== false ? () => {
                  setReplyOpen(true)
                  setTimeout(
                    () =>
                      replyRef.current?.scrollIntoView({ behavior: 'smooth' }),
                    50,
                  )
                } : undefined}
                onFav={() => {
                  if (item.isStarred) {
                    unstarMessage({ variables: { id } })
                  } else {
                    starMessage({ variables: { id } })
                  }
                }}
                onStash={() => {
                  if (item.isArchived) {
                    unarchiveMessage({ variables: { id } })
                  } else {
                    archiveMessage({ variables: { id } })
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
                      <UserInitialsAvatar name={userInfo.profile.name ?? ''} />
                    ) : (
                      <CircleLogo organization={senderName} />
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
                        {formatMessageDateTime(msg.messageSentAt, lang)}
                      </Text>
                    </Box>
                  </Box>

                  {/* Body */}
                  {msg.messageTextContent && (
                    <Box
                      marginBottom={4}
                      style={{ fontWeight: 'lighter', whiteSpace: 'pre-line' }}
                    >
                      {msg.messageTextContent}
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
                  title={formatMessage(messages.healthMessageSentTitle)}
                  message={formatMessage(messages.healthMessageSentText)}
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
                    <UserInitialsAvatar name={userInfo.profile.name ?? ''} />
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
                        {formatMessage(messages.healthMessageTo, {
                          arg: item.lastSenderGroupName ?? '',
                        })}
                      </Text>
                    </Box>
                  </Box>
                  <Button
                    circle
                    icon="close"
                    colorScheme="light"
                    aria-label={formatMessage(messages.healthMessageCloseReply)}
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
                  />
                </Box>

                <Box display="flex" justifyContent="flexEnd">
                  <Button
                    size="small"
                    onClick={handleReply}
                    loading={replySending}
                    disabled={!replyText.trim()}
                  >
                    {formatMessage(messages.healthMessageSend)}
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

export default HealthMessageDetail
