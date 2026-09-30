import { AlertMessage } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { HealthDirectorateHealthConversationReplyAvailability as ReplyAvailability } from '@island.is/api/schema'
import { messages } from '../../../lib/messages'

interface Props {
  availability: Exclude<ReplyAvailability, ReplyAvailability.CAN_REPLY>
  replyWindowDays?: number | null
}

const ReplyBlockedAlert = ({ availability, replyWindowDays }: Props) => {
  const { formatMessage } = useLocale()

  const message = () => {
    switch (availability) {
      case ReplyAvailability.WAITING:
        return formatMessage(
          messages.healthConversationReplyBlockedAwaitingAcknowledgementText,
        )
      case ReplyAvailability.EXPIRED:
        return replyWindowDays != null
          ? formatMessage(
              messages.healthConversationReplyBlockedWindowExpiredDaysText,
              { days: replyWindowDays },
            )
          : formatMessage(
              messages.healthConversationReplyBlockedWindowExpiredText,
            )
      case ReplyAvailability.NEVER:
      default:
        return formatMessage(messages.healthConversationReplyBlockedGenericText)
    }
  }

  return <AlertMessage type="info" message={message()} />
}

export default ReplyBlockedAlert
