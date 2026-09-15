import React from 'react'
import { useIntl } from 'react-intl'

import {
  GetHealthConversationRecipientsQuery,
  HealthDirectorateHealthConversationRecipientBlockedReason,
} from '@/graphql/types/schema'
import { Alert } from '@/ui'
import { getMessagingWindowInfo } from '@/utils/messaging-window'

type Recipient = NonNullable<
  GetHealthConversationRecipientsQuery['healthDirectorateHealthConversationRecipients']
>[number]

// Explains why messaging a recipient is blocked or closing soon, mirroring the
// my-pages ConversationAvailabilityAlert.
export const ConversationAvailabilityAlert = ({
  recipient,
}: {
  recipient: Recipient
}) => {
  const intl = useIntl()
  const blockedReason = recipient.conversationBlockedReason
  const windowInfo = getMessagingWindowInfo({
    windowOpen: recipient.messagingWindowOpen,
    windowClose: recipient.messagingWindowClose,
  })

  // Messaging-not-allowed keeps its own dedicated message (no window text).
  const isNotAllowed =
    !!blockedReason &&
    blockedReason !==
      HealthDirectorateHealthConversationRecipientBlockedReason.OutsideMessagingWindow

  if (isNotAllowed) {
    return (
      <Alert
        type="info"
        size="small"
        hasBorder
        title={intl.formatMessage({
          id: 'health.messages.compose.notAllowedTitle',
        })}
        message={intl.formatMessage({
          id: 'health.messages.compose.notAllowedText',
        })}
      />
    )
  }

  // The same availability text is always shown; only the title/colour change to
  // reflect closed / closing-soon / open. The window sentence embeds the
  // open/close times, so drop it when the recipient has no messaging window
  // rather than render "from  to " with blanks.
  const hasWindow =
    !!windowInfo.windowOpenLabel && !!windowInfo.windowCloseLabel
  const availabilityText = [
    hasWindow
      ? intl.formatMessage(
          { id: 'health.messages.compose.availabilityWindow' },
          {
            name: recipient.name,
            openTime: windowInfo.windowOpenLabel,
            closeTime: windowInfo.windowCloseLabel,
          },
        )
      : null,
    intl.formatMessage({ id: 'health.messages.compose.availabilityInfo' }),
  ]
    .filter(Boolean)
    .join(' ')

  const isClosed =
    blockedReason ===
    HealthDirectorateHealthConversationRecipientBlockedReason.OutsideMessagingWindow

  if (isClosed) {
    return (
      <Alert
        type="info"
        size="small"
        hasBorder
        title={intl.formatMessage({
          id: 'health.messages.compose.closedTitle',
        })}
        message={availabilityText}
      />
    )
  }

  if (windowInfo.isClosingSoon) {
    return (
      <Alert
        type="warning"
        size="small"
        hasBorder
        title={intl.formatMessage({
          id: 'health.messages.compose.closingSoonTitle',
        })}
        message={availabilityText}
      />
    )
  }

  return <Alert type="info" size="small" hasBorder message={availabilityText} />
}
