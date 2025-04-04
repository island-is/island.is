import { Box, Button, Divider } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getInitials } from '@island.is/portals/my-pages/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import React from 'react'
import { useDocumentContext } from '../../screens/Overview/DocumentContext'
import { messages } from '../../utils/messages'
import ReplyForm from './ReplyForm'
import ReplyHeader from './ReplyHeader'

interface Props {
  sender: string
}

const ReplyContainer: React.FC<Props> = ({ sender }) => {
  const { profile } = useUserInfo()
  const { formatMessage } = useLocale()
  const { replyable, replyOpen, setReplyOpen } = useDocumentContext()
  const hasEmail = true //isDefined(userProfile?.email)
  const [sent, setSent] = React.useState({ sent: false, date: '' })

  const successfulSubmit = (date: string) => {
    alert('success' + date)
    setSent({ sent: true, date: date })
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

  if (!replyOpen) {
    return button
  }

  if (replyOpen) {
    return (
      <Box marginTop={3}>
        <Divider />
        <ReplyHeader
          initials={getInitials(profile.name)}
          title={sent.sent ? profile.name : formatMessage(messages.titleWord)}
          subTitle={
            sent.sent
              ? sent.date
              : formatMessage(messages.toWithArgs, {
                  receiverName: sender,
                })
          }
          secondSubTitle={
            !sent.sent && hasEmail
              ? formatMessage(messages.fromWithArgs, {
                  senderName: profile.email,
                })
              : undefined
          }
          hasEmail={hasEmail}
          displayCloseButton={!sent.sent}
          onClose={() => setReplyOpen(false)}
          displayEmail
        />
        {/* Form  */}
        <ReplyForm hasEmail={hasEmail} successfulSubmit={successfulSubmit} />
        {sent.sent && replyable && button}
      </Box>
    )
  }
}

export default ReplyContainer
