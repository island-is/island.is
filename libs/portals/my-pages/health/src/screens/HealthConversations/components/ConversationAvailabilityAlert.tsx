import { AlertMessage, AlertMessageType, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { HealthDirectorateHealthConversationRecipientBlockedReason } from '@island.is/api/schema'
import { messages } from '../../../lib/messages'
import { HealthConversationRecipientFragment } from '../NewHealthConversation.generated'
import { getMessagingWindowInfo } from '../utils/messagingWindow'

interface Props {
  recipient: HealthConversationRecipientFragment
}

interface AvailabilityAlert {
  type: AlertMessageType
  title: string
  message?: string
}

const ConversationAvailabilityAlert = ({ recipient }: Props) => {
  const { formatMessage } = useLocale()
  const blockedReason = recipient.conversationBlockedReason
  const windowInfo = getMessagingWindowInfo({
    windowOpen: recipient.messagingWindowOpen,
    windowClose: recipient.messagingWindowClose,
  })

  const alert: AvailabilityAlert | undefined =
    blockedReason ===
    HealthDirectorateHealthConversationRecipientBlockedReason.OUTSIDE_MESSAGING_WINDOW
      ? {
          type: 'info',
          title: formatMessage(messages.healthConversationClosedTitle),
          message:
            windowInfo.windowOpenLabel && windowInfo.windowCloseLabel
              ? formatMessage(messages.healthConversationClosedText, {
                  currentTime: windowInfo.currentTimeLabel,
                  openTime: windowInfo.windowOpenLabel,
                  closeTime: windowInfo.windowCloseLabel,
                })
              : undefined,
        }
      : blockedReason
      ? {
          type: 'warning',
          title: formatMessage(
            messages.healthConversationMessagingNotAllowedTitle,
          ),
          message: formatMessage(
            messages.healthConversationMessagingNotAllowedText,
          ),
        }
      : windowInfo.isClosingSoon
      ? {
          type: 'warning',
          title: formatMessage(messages.healthConversationClosingSoonTitle),
          message: formatMessage(messages.healthConversationClosingSoonText, {
            hasOpenTime: windowInfo.windowOpenLabel ? 'true' : 'false',
            openTime: windowInfo.windowOpenLabel ?? '',
            closeTime: windowInfo.windowCloseLabel,
          }),
        }
      : undefined

  if (!alert) return null

  return (
    <Box marginBottom={3}>
      <AlertMessage
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />
    </Box>
  )
}

export default ConversationAvailabilityAlert
