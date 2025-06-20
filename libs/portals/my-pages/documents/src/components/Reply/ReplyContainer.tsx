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
import { useState } from 'react'
import { Reply, ReplyState } from '../../lib/types'
import { useGetDocumentTicketLazyQuery } from '../../queries/Overview.generated'
import { useDocumentContext } from '../../screens/Overview/DocumentContext'
import { messages } from '../../utils/messages'
import NoPDF from '../NoPDF/NoPDF'
import ReplyForm from './ReplyForm'
import ReplyHeader from './ReplyHeader'
import ReplySent from './ReplySent'

const ReplyContainer = () => {
  const { formatMessage } = useLocale()
  const { profile } = useUserInfo()
  const { replyState, activeDocument, setReplyState } = useDocumentContext()

  const [sent, setSent] = useState<boolean>()
  const [showAllReplies, setShowAllReplies] = useState(false)
  const [getTicketQuery, { loading }] = useGetDocumentTicketLazyQuery({
    variables: {
      input: {
        id: activeDocument?.id ?? '',
        includeDocument: true,
      },
    },
    fetchPolicy: 'no-cache',
  })

  const { data: userProfile } = useUserProfile()
  const userEmail = userProfile?.email
  const hasEmail = isDefined(userEmail)
  const userName = profile.name
  const { isMobile } = useIsMobile()
  const replies = replyState?.replies

  const successfulSubmit = () => {
    setSent(true)
    changeReplyState({ replyOpen: false }) // Close the reply form after sending
  }

  const changeReplyState = (partial: Partial<ReplyState>) => {
    setReplyState((prev) => {
      return {
        ...prev,
        reply: partial.reply ?? prev?.reply,
        replyable: partial.replyable ?? prev?.replyable ?? false,
        replyOpen: partial.replyOpen ?? prev?.replyOpen ?? false,
        replies: partial.replies ?? prev?.replies,
        closedForMoreReplies:
          partial.closedForMoreReplies ?? prev?.closedForMoreReplies ?? false,
      }
    })
  }
  const button = (
    <Box marginTop={3}>
      <Button
        variant="ghost"
        preTextIcon="undo"
        preTextIconType="outline"
        size="small"
        onClick={() => {
          if (sent && replyState?.reply) {
            setSent(false)
            getTicketQuery({
              onCompleted: (data) => {
                const ticket = data?.documentV2?.ticket
                if (ticket?.comments) {
                  const reply: Reply = {
                    id: ticket?.id,
                    createdDate: ticket?.createdDate,
                    updatedDate: ticket?.updatedDate,
                    subject: ticket?.subject,
                    authorId: ticket?.authorId,
                    status: ticket?.status,
                    comments: ticket?.comments?.map((item, index) => {
                      if (index === (ticket?.comments?.length ?? 0) - 2) {
                        return {
                          ...item,
                          hide: false,
                        }
                      } else
                        return {
                          ...item,
                          hide: true,
                        }
                    }),
                  }
                  changeReplyState({
                    replies: reply,
                    reply: sent ? replyState?.reply : undefined,
                  })
                }
              },
            })
          }
          changeReplyState({
            replyOpen: true,
          })
        }}
      >
        {formatMessage(messages.sendMessage)}
      </Button>
    </Box>
  )

  const toggleReply = (id?: string | null) => {
    if (!replies) return
    const updatedReplies: Reply = {
      ...replies,
      comments:
        replies?.comments?.map((reply) =>
          reply.id === id ? { ...reply, hide: !reply.hide } : reply,
        ) || [],
    }
    changeReplyState({ replies: updatedReplies })
  }

  const toggleShowAllReplies = () => {
    setShowAllReplies(!showAllReplies)
  }

  if (!activeDocument) {
    return <NoPDF />
  }

  const repliesLength = replies?.comments?.length ?? 0
  const lastReply = replies?.comments?.[repliesLength - 1] ?? null
  const lastReplyID = replies?.id ?? null
  const hideReplies = isMobile && replyState?.replyOpen

  return (
    <>
      <Box>
        {/* Show only the last reply, other replies are hidden behind "Show all messages" button */}
        {/* Hide replies when on mobile and the reply form is open */}
        {!hideReplies &&
        !showAllReplies &&
        repliesLength > (isMobile ? 2 : 4) ? (
          <>
            <Box paddingY={3}>
              <Divider />
            </Box>
            <Box display="flex" justifyContent="center" width="full">
              <Button
                variant="text"
                size="small"
                onClick={() => toggleShowAllReplies()}
              >
                {formatMessage(messages.showAllRepliesWithArgs, {
                  repliesLength: repliesLength,
                })}
              </Button>
            </Box>
            <Box>
              <Box paddingY={3}>
                <Divider />
              </Box>
              <ReplyHeader
                caseNumber={lastReplyID ?? undefined}
                initials={getInitials(lastReply?.author ?? '')}
                title={lastReply?.author ?? activeDocument.subject}
                hasEmail={isDefined(userEmail)}
                subTitle={formatDate(lastReply?.createdDate, dateFormat.is)}
                displayEmail={false}
              />
              <ReplySent body={lastReply?.body} />
            </Box>
          </>
        ) : // Show all replies
        hideReplies ? undefined : (
          replies?.comments?.map((reply) => (
            <Box
              onClick={() => toggleReply(reply.id)}
              key={reply.id}
              cursor="pointer"
            >
              <Box paddingY={1}>
                <Divider />
              </Box>
              <ReplyHeader
                caseNumber={replies.id ?? undefined}
                initials={getInitials(reply.author ?? '')}
                title={reply.author ?? activeDocument.subject}
                hasEmail={isDefined(userEmail)}
                subTitle={formatDate(reply?.createdDate, dateFormat.is)}
                displayEmail={false}
              />
              {!reply.hide && <ReplySent body={reply.body} />}
            </Box>
          ))
        )}

        {/* If the thread is closed, we display a info message */}
        {replyState?.closedForMoreReplies && (
          <AlertMessage
            type="info"
            message={formatMessage(messages.closedForReplies)}
          />
        )}
      </Box>
      {/* Newly sent reply displayed */}
      {sent && replyState?.reply && (
        <>
          <Divider />
          <ReplyHeader
            initials={getInitials(userName)}
            title={sent ? userName : formatMessage(messages.titleWord)}
            subTitle={formatMessage(messages.toWithArgs, {
              receiverName: activeDocument.sender,
            })}
            secondSubTitle={
              !sent && hasEmail
                ? formatMessage(messages.fromWithArgs, {
                    senderName: userEmail,
                  })
                : undefined
            }
            displayEmail
            hasEmail={hasEmail}
            displayCloseButton={!sent}
            onClose={() => changeReplyState({ replyOpen: false })}
          />

          <ReplySent
            body={replyState.reply.body}
            intro={formatMessage(messages.replySent, {
              email: userEmail,
              caseNumber: replyState.reply.id,
            })}
          />
        </>
      )}

      {replyState?.replyable && replyState?.replyOpen && (
        <Box marginY={3} height="full">
          {!isMobile && <Divider />}
          <ReplyHeader
            initials={getInitials(userName)}
            title={isMobile ? activeDocument.subject : userName}
            subTitle={formatMessage(messages.toWithArgs, {
              receiverName: activeDocument.sender,
            })}
            secondSubTitle={
              !sent && hasEmail
                ? formatMessage(messages.fromWithArgs, {
                    senderName: userEmail,
                  })
                : undefined
            }
            displayEmail
            hasEmail={hasEmail}
            displayCloseButton={!sent}
            onClose={() => changeReplyState({ replyOpen: false })}
          />
          {sent && replyState.reply && (
            <ReplySent
              body={replyState.reply.body}
              intro={formatMessage(messages.replySent, {
                email: userEmail,
              })}
            />
          )}
          {/* Form  */}
          {!loading && replyState.replyOpen && (
            <ReplyForm
              hasEmail={hasEmail}
              successfulSubmit={successfulSubmit}
            />
          )}
        </Box>
      )}
      {replyState?.replyable && !replyState?.replyOpen && button}
    </>
  )
}

export default ReplyContainer
