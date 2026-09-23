import { AlertMessage, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { HealthDirectorateHealthConversationRecipientAvailability as Availability } from '@island.is/api/schema'
import { messages } from '../../../lib/messages'
import { HealthConversationRecipientFragment } from '../NewHealthConversation.generated'
import { formatTimeLabel, isClosingSoon } from '../utils/messagingWindow'
import ClosedRecipientAlert from './ClosedRecipientAlert'

interface Props {
  recipient: HealthConversationRecipientFragment
}

const ConversationAvailabilityAlert = ({ recipient }: Props) => {
  const { formatMessage } = useLocale()

  if (recipient.availability === Availability.CLOSED) {
    return (
      <Box marginBottom={3}>
        <ClosedRecipientAlert recipient={recipient} />
      </Box>
    )
  }

  if (recipient.availability === Availability.NEVER) {
    return (
      <Box marginBottom={3}>
        <AlertMessage
          type="warning"
          title={formatMessage(
            messages.healthConversationMessagingNotAllowedTitle,
          )}
          message={formatMessage(
            messages.healthConversationMessagingNotAllowedText,
          )}
        />
      </Box>
    )
  }

  const closeTime = formatTimeLabel(recipient.todaysWindow?.windowClose)

  if (!isClosingSoon(recipient.closesAt) || !closeTime) return null

  return (
    <Box marginBottom={3}>
      <AlertMessage
        type="warning"
        title={formatMessage(messages.healthConversationClosingSoonTitle)}
        message={formatMessage(messages.healthConversationClosingSoonText, {
          closeTime,
        })}
      />
    </Box>
  )
}

export default ConversationAvailabilityAlert
