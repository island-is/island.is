import { AlertMessage, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { HealthDirectorateHealthConversationRecipientBlockedReason } from '@island.is/api/schema'
import { messages } from '../../../lib/messages'
import { HealthConversationRecipientFragment } from '../NewHealthConversation.generated'
import { getClosingSoonInfo, getTodaysWindow } from '../utils/messagingWindow'
import ClosedRecipientAlert from './ClosedRecipientAlert'

interface Props {
  recipient: HealthConversationRecipientFragment
}

const ConversationAvailabilityAlert = ({ recipient }: Props) => {
  const { formatMessage } = useLocale()
  const blockedReason = recipient.conversationBlockedReason

  if (
    blockedReason ===
    HealthDirectorateHealthConversationRecipientBlockedReason.OUTSIDE_MESSAGING_WINDOW
  ) {
    return (
      <Box marginBottom={3}>
        <ClosedRecipientAlert recipient={recipient} />
      </Box>
    )
  }

  if (blockedReason) {
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

  const closingSoon = getClosingSoonInfo(getTodaysWindow(recipient))

  if (!closingSoon.isClosingSoon) return null

  return (
    <Box marginBottom={3}>
      <AlertMessage
        type="warning"
        title={formatMessage(messages.healthConversationClosingSoonTitle)}
        message={formatMessage(messages.healthConversationClosingSoonText, {
          hasOpenTime: closingSoon.openLabel ? 'true' : 'false',
          openTime: closingSoon.openLabel ?? '',
          closeTime: closingSoon.closeLabel,
        })}
      />
    </Box>
  )
}

export default ConversationAvailabilityAlert
