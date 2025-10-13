import { AlertMessage, Box, Button, Divider } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  formatDate,
  getInitials,
  useIsMobile,
} from '@island.is/portals/my-pages/core'
import { useUserProfile } from '@island.is/portals/my-pages/graphql'
import { useUserInfo } from '@island.is/react-spa/bff'
import { dateFormat } from '@island.is/shared/constants'
import { isDefined } from '@island.is/shared/utils'
import { useCallback, useEffect, useState } from 'react'
import { ReplyState } from '../../lib/types'
import { useGetDocumentTicketQuery } from '../../queries/Overview.generated'
import { useDocumentContext } from '../../screens/Overview/DocumentContext'
import { messages } from '../../utils/messages'
import ReplyForm from './ReplyForm'
import ReplyHeader from './ReplyHeader'
import ReplySent from './ReplySent'

const ReplyContainer = () => {
  const { formatMessage } = useLocale()
  const { profile } = useUserInfo()
  const { replyState, activeDocument, setReplyState } = useDocumentContext()

  const [sent, setSent] = useState<boolean>(false)
  const [showAllReplies, setShowAllReplies] = useState(true)

  const { data, loading, refetch } = useGetDocumentTicketQuery({
    skip: !activeDocument?.id,
    variables: {
      input: {
        id: activeDocument?.id ?? '',
        includeDocument: true,
      },
    },
    fetchPolicy: 'no-cache',
    onError: (err) => {
      console.error('Failed to fetch ticket data:', err)
    },
  })

  const { data: userProfile } = useUserProfile()

  const allRepliesData = data?.documentV2?.ticket?.comments ?? []
  const userEmail = userProfile?.email ?? profile?.email
  const hasEmail = isDefined(userEmail)
  const userName = profile?.name ?? ''
  const replies = replyState?.replies
  const repliesLength = replies?.comments?.length ?? 0

  const { isMobile } = useIsMobile()

  useEffect(() => {
    if (repliesLength > (isMobile ? 2 : 4)) {
      setShowAllReplies(false)
    }
  }, [repliesLength, isMobile])

  const successfulSubmit = useCallback(() => {
    refetch?.()
    setSent(true)
    changeReplyState({ replyOpen: false })
  }, [refetch])

  const changeReplyState = useCallback(
    (partial: Partial<ReplyState>) => {
      if (!setReplyState) {
        console.warn('setReplyState is not available')
        return
      }

      setReplyState((prev) => {
        if (!prev) {
          return {
            sentReply: partial.sentReply,
            replyable: partial.replyable ?? false,
            replyOpen: partial.replyOpen ?? false,
            replies: partial.replies,
            closedForMoreReplies: partial.closedForMoreReplies ?? false,
          }
        }

        return {
          ...prev,
          sentReply: partial.sentReply ?? prev.sentReply,
          replyable: partial.replyable ?? prev.replyable ?? false,
          replyOpen: partial.replyOpen ?? prev.replyOpen ?? false,
          replies: partial.replies ?? prev.replies,
          closedForMoreReplies:
            partial.closedForMoreReplies ?? prev.closedForMoreReplies ?? false,
        }
      })
    },
    [setReplyState],
  )

  const toggleShowAllReplies = useCallback(() => {
    setShowAllReplies((prev) => !prev)
  }, [])

  const handleReplyButtonClick = useCallback(() => {
    if (sent && replyState?.sentReply) {
      setSent(false)
    }
    changeReplyState({
      replyOpen: true,
      sentReply: undefined,
    })
  }, [sent, replyState?.sentReply, changeReplyState])

  const handleCloseReply = useCallback(() => {
    changeReplyState({ replyOpen: false })
  }, [changeReplyState])

  const hideReplies = isMobile && replyState?.replyOpen
  const lastReply = replies?.comments?.at?.(-1)
  const repliesComments =
    sent && showAllReplies ? replies?.comments?.slice(0, -1) : replies?.comments

  const shouldShowExpandButton =
    !hideReplies && !showAllReplies && repliesLength > (isMobile ? 2 : 4)

  const button = (
    <Box marginTop={3}>
      <Button
        variant="ghost"
        preTextIcon="undo"
        preTextIconType="outline"
        size="small"
        onClick={handleReplyButtonClick}
      >
        {formatMessage(messages.sendMessage)}
      </Button>
    </Box>
  )

  return (
    <>
      <Box>
        {shouldShowExpandButton ? (
          <>
            <Box paddingY={3}>
              <Divider />
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              width="full"
              paddingBottom={sent ? 3 : 0}
            >
              <Button
                variant="text"
                size="small"
                onClick={toggleShowAllReplies}
              >
                {formatMessage(messages.showAllRepliesWithArgs, {
                  repliesLength: repliesLength,
                })}
              </Button>
            </Box>
            {!sent && lastReply && (
              <Box>
                <Box paddingY={3}>
                  <Divider />
                </Box>
                <ReplyHeader
                  caseNumber={replies?.id ?? ''}
                  initials={
                    !lastReply.isZendeskAgent
                      ? getInitials(userName)
                      : undefined
                  }
                  avatar={activeDocument?.img}
                  title={lastReply.author ?? activeDocument?.subject ?? ''}
                  hasEmail={hasEmail}
                  subTitle={
                    lastReply.createdDate
                      ? formatDate(lastReply.createdDate, dateFormat.is)
                      : ''
                  }
                  displayEmail={false}
                />
                <ReplySent body={lastReply.body ?? ''} />
              </Box>
            )}
          </>
        ) : !hideReplies ? (
          repliesComments?.map((reply, index) => (
            <Box key={reply.id || `reply-${index}`}>
              <Box paddingY={1}>
                <Divider />
              </Box>
              <ReplyHeader
                caseNumber={replies?.id ?? ''}
                initials={
                  !reply.isZendeskAgent ? getInitials(userName) : undefined
                }
                avatar={activeDocument?.img}
                title={
                  !reply.isZendeskAgent
                    ? reply.author ?? userName
                    : activeDocument?.sender ?? activeDocument?.subject ?? ''
                }
                hasEmail={hasEmail}
                subTitle={
                  reply.createdDate
                    ? formatDate(reply.createdDate, dateFormat.is)
                    : ''
                }
                displayEmail={false}
              />
              <ReplySent body={reply.body ?? ''} />
            </Box>
          ))
        ) : null}

        {replyState?.closedForMoreReplies && (
          <AlertMessage
            type="info"
            message={formatMessage(messages.closedForReplies)}
          />
        )}
      </Box>

      {sent && replyState?.sentReply && (
        <>
          <Divider />
          <ReplyHeader
            caseNumber={replyState.sentReply.id ?? ''}
            initials={getInitials(userName)}
            title={userName}
            subTitle={
              replies?.comments?.length
                ? formatDate(
                    replies.comments[replies.comments.length - 1]?.createdDate,
                  )
                : ''
            }
            secondSubTitle={
              !sent && hasEmail
                ? formatMessage(messages.fromWithArgs, {
                    senderName: userEmail ?? '',
                  })
                : undefined
            }
          />
          <ReplySent
            body={replyState.sentReply.body ?? ''}
            intro={formatMessage(messages.replySent, {
              email: replyState.sentReply.email ?? userEmail ?? '',
              caseNumber: replyState.sentReply.id ?? '',
            })}
          />
        </>
      )}

      {replyState?.replyable && replyState?.replyOpen && (
        <Box marginY={3} height="full">
          {!isMobile && <Divider />}
          <ReplyHeader
            initials={getInitials(userName)}
            title={isMobile ? activeDocument?.subject ?? '' : userName}
            subTitle={formatMessage(messages.toWithArgs, {
              receiverName: activeDocument?.sender ?? '',
            })}
            secondSubTitle={
              !sent && hasEmail
                ? formatMessage(messages.fromWithArgs, {
                    senderName: userEmail ?? '',
                  })
                : undefined
            }
            displayEmail
            hasEmail={hasEmail}
            displayCloseButton={!sent}
            onClose={handleCloseReply}
          />

          {!loading && replyState.replyOpen && (
            <ReplyForm
              hasEmail={hasEmail}
              successfulSubmit={successfulSubmit}
            />
          )}
        </Box>
      )}

      {!replyState?.closedForMoreReplies &&
        replyState?.replyable &&
        !replyState?.replyOpen &&
        button}
    </>
  )
}

export default ReplyContainer
