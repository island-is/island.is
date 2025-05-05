import { AlertMessage, Box, Button, Divider } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatDate, getInitials } from '@island.is/portals/my-pages/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import React, { useState } from 'react'
import { useGetDocumentTicketLazyQuery } from '../../queries/Overview.generated'
import { useDocumentContext } from '../../screens/Overview/DocumentContext'
import { messages } from '../../utils/messages'
import ReplyForm from './ReplyForm'
import ReplyHeader from './ReplyHeader'
import ReplySent from './ReplySent'
import { Reply } from '../../lib/types'
import { isDefined } from '@island.is/shared/utils'
import NoPDF from '../NoPDF/NoPDF'
import { dateFormatWithTime } from '@island.is/shared/constants'

const ReplyContainer = () => {
  const { profile } = useUserInfo()
  const { formatMessage } = useLocale()
  const {
    replies,
    replyable,
    replyOpen,
    setReplyOpen,
    setReplies,
    reply,
    activeDocument,
    closedForMoreReplies,
  } = useDocumentContext()
  const hasEmail = true //isDefined(userProfile?.email)
  const [sent, setSent] = useState<boolean>()
  const [getTicketQuery] = useGetDocumentTicketLazyQuery({
    variables: {
      input: {
        id: activeDocument?.id ?? '',
        includeDocument: true,
      },
    },
    fetchPolicy: 'no-cache',
  })

  const successfulSubmit = () => {
    setSent(true)
    setReplyOpen(false)
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
          reply.comments?.pop()
          setReplies(reply)
        }
      },
    })
  }

  const button = (
    <Box marginTop={3}>
      <Button
        variant="ghost"
        preTextIcon="undo"
        preTextIconType="outline"
        size="small"
        onClick={() => setReplyOpen(true)}
      >
        Svara pósti
      </Button>
    </Box>
  )

  const toggleReply = (id?: string | null) => {
    const updatedReplies: Reply = {
      ...replies,
      comments:
        replies?.comments?.map((reply) =>
          reply.id === id ? { ...reply, hide: !reply.hide } : reply,
        ) || [],
    }
    setReplies(updatedReplies)
  }

  if (!activeDocument) {
    return <NoPDF />
  }

  return (
    <>
      <Box>
        {replies?.comments?.map((reply) => (
          <Box
            onClick={() => toggleReply(reply.id)}
            key={reply.id}
            cursor="pointer"
          >
            <Box paddingY={1}>
              <Divider />
            </Box>
            <ReplyHeader
              initials={getInitials(reply.author ?? '')}
              title={reply.author ?? activeDocument.subject}
              hasEmail={isDefined(profile.email)}
              subTitle={formatDate(reply?.createdDate, dateFormatWithTime.is)}
              displayEmail={false}
            />
            {!reply.hide && (
              <ReplySent
                date={reply.createdDate}
                id={reply.id}
                body={reply.body}
              />
            )}
          </Box>
        ))}

        {/* {If document is marked replyable, we render the reply form} */}
        {closedForMoreReplies && (
          <AlertMessage
            type="info"
            message={
              'Ekki er hægt að svara þessum skilaboðum því sendandi hefur lokað fyrir frekari svör í þessu samtali.'
            }
          />
        )}
      </Box>

      {/* ---------------------- */}
      {/* {!replyOpen && !reply && button} */}
      {replyable && (
        <Box marginY={3}>
          <Divider />
          <ReplyHeader
            initials={getInitials(profile.name)}
            title={sent ? profile.name : formatMessage(messages.titleWord)}
            subTitle={formatMessage(messages.toWithArgs, {
              receiverName: activeDocument.sender,
            })}
            secondSubTitle={
              !sent && hasEmail
                ? formatMessage(messages.fromWithArgs, {
                    senderName: profile.email,
                  })
                : undefined
            }
            displayEmail
            hasEmail={hasEmail}
            displayCloseButton={!sent}
            onClose={() => setReplyOpen(false)}
          />

          {reply && (
            <ReplySent
              id={reply?.id}
              body={reply.body}
              intro={
                'Skilaboðin eru móttekin og mál hefur verið stofnað. Þú getur haldið áfram samskiptunum hér eða í gegnum þitt persónulega netfang. '
              }
            />
          )}
          {/* Form  */}
          {replyOpen && (
            <ReplyForm
              hasEmail={hasEmail}
              successfulSubmit={successfulSubmit}
            />
          )}
          {replyable && !replyOpen && button}
        </Box>
      )}
    </>
  )
}

export default ReplyContainer
