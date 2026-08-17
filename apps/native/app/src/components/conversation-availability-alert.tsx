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

  if (
    blockedReason ===
    HealthDirectorateHealthConversationRecipientBlockedReason.OutsideMessagingWindow
  ) {
    return (
      <Alert
        type="info"
        hasBorder
        title={intl.formatMessage({
          id: 'health.messages.compose.closedTitle',
        })}
        message={
          windowInfo.windowOpenLabel && windowInfo.windowCloseLabel
            ? intl.formatMessage(
                { id: 'health.messages.compose.closedText' },
                {
                  currentTime: windowInfo.currentTimeLabel,
                  openTime: windowInfo.windowOpenLabel,
                  closeTime: windowInfo.windowCloseLabel,
                },
              )
            : undefined
        }
      />
    )
  }

  if (blockedReason) {
    return (
      <Alert
        type="info"
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

  if (windowInfo.isClosingSoon) {
    return (
      <Alert
        type="warning"
        hasBorder
        title={intl.formatMessage({
          id: 'health.messages.compose.closingSoonTitle',
        })}
        message={intl.formatMessage(
          { id: 'health.messages.compose.closingSoonText' },
          {
            hasOpenTime: windowInfo.windowOpenLabel ? 'true' : 'false',
            openTime: windowInfo.windowOpenLabel ?? '',
            closeTime: windowInfo.windowCloseLabel ?? '',
          },
        )}
      />
    )
  }

  return null
}
