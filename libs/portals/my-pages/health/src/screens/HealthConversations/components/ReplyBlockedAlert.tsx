import { MessageDescriptor } from 'react-intl'
import { AlertMessage, AlertMessageType, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { HealthDirectorateHealthConversationReplyBlockedReason } from '@island.is/api/schema'
import { messages } from '../../../lib/messages'

interface Props {
  reason?: HealthDirectorateHealthConversationReplyBlockedReason | null
}

interface ReasonAlert {
  type: AlertMessageType
  title?: MessageDescriptor
  text: MessageDescriptor
}

const reasonMessageMap: Record<
  HealthDirectorateHealthConversationReplyBlockedReason,
  ReasonAlert
> = {
  [HealthDirectorateHealthConversationReplyBlockedReason.MISSING_RECIPIENT]: {
    type: 'info',
    text: messages.healthConversationReplyBlockedMissingRecipientText,
  },
  [HealthDirectorateHealthConversationReplyBlockedReason.REPLIES_DISABLED]: {
    type: 'info',
    text: messages.healthConversationReplyBlockedRepliesDisabledText,
  },
  [HealthDirectorateHealthConversationReplyBlockedReason.NO_REPLY_GROUP]: {
    type: 'info',
    text: messages.healthConversationReplyBlockedNoReplyGroupText,
  },
  [HealthDirectorateHealthConversationReplyBlockedReason.MESSAGING_NOT_ALLOWED]:
    {
      type: 'info',
      text: messages.healthConversationReplyBlockedMessagingNotAllowedText,
    },
  [HealthDirectorateHealthConversationReplyBlockedReason.OUTSIDE_MESSAGING_WINDOW]:
    {
      type: 'info',
      text: messages.healthConversationReplyBlockedOutsideWindowText,
    },
  [HealthDirectorateHealthConversationReplyBlockedReason.REPLY_WINDOW_EXPIRED]:
    {
      type: 'info',
      text: messages.healthConversationReplyBlockedWindowExpiredText,
    },
  [HealthDirectorateHealthConversationReplyBlockedReason.AWAITING_STAFF_REPLY]:
    {
      type: 'success',
      title: messages.healthConversationReplyBlockedAwaitingStaffReplyTitle,
      text: messages.healthConversationReplyBlockedAwaitingStaffReplyText,
    },
}

const ReplyBlockedAlert = ({ reason }: Props) => {
  const { formatMessage } = useLocale()

  if (!reason) return null

  const entry = reasonMessageMap[reason]

  return (
    <Box marginTop={4}>
      <AlertMessage
        type={entry.type}
        title={entry.title ? formatMessage(entry.title) : undefined}
        message={formatMessage(entry.text)}
      />
    </Box>
  )
}

export default ReplyBlockedAlert
