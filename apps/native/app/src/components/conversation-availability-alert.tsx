import React from 'react'
import { useIntl } from 'react-intl'

import { ClosedRecipientCard } from '@/components/closed-recipient-card'
import { RecipientNoticeCard } from '@/components/recipient-notice-card'
import {
  GetHealthConversationRecipientsQuery,
  HealthDirectorateHealthConversationRecipientAvailability,
} from '@/graphql/types/schema'
import { Alert } from '@/ui'
import { formatTimeLabel, isClosingSoon } from '@/utils/messaging-window'

type Recipient = NonNullable<
  GetHealthConversationRecipientsQuery['healthDirectorateHealthConversationRecipients']
>[number]

// Explains why messaging a recipient is blocked or closing soon, mirroring the
// my-pages ConversationAvailabilityAlert. The two states where sending is
// impossible take a card, rendered in place of the form; closing soon keeps the
// form usable and only warns above it.
export const ConversationAvailabilityAlert = ({
  recipient,
}: {
  recipient: Recipient
}) => {
  const intl = useIntl()

  // Closed for now: its own card, listing when the recipient next opens and the
  // hours it keeps on each kind of day.
  if (
    recipient.availability ===
    HealthDirectorateHealthConversationRecipientAvailability.Closed
  ) {
    return <ClosedRecipientCard recipient={recipient} />
  }

  // Messaging-not-allowed gets the same card, with its own message (no opening
  // hours to show). Keyed off canCreateConversation rather than the
  // availability enum: an availability this client doesn't know is dropped to
  // undefined, and a recipient that can't be messaged must never fall through
  // to the closing-soon branch and render nothing.
  if (!recipient.canCreateConversation) {
    return (
      <RecipientNoticeCard
        title={intl.formatMessage({
          id: 'health.messages.compose.notAllowedTitle',
        })}
        message={intl.formatMessage({
          id: 'health.messages.compose.notAllowedText',
        })}
      />
    )
  }

  // Open: warn only when the window is about to close. An all-day window has no
  // closesAt, so it never warns.
  const closeTime = formatTimeLabel(recipient.todaysWindow?.windowClose)
  if (!isClosingSoon(recipient.closesAt) || !closeTime) {
    return null
  }

  return (
    <Alert
      type="warning"
      size="small"
      hasBorder
      title={intl.formatMessage({
        id: 'health.messages.compose.closingSoonTitle',
      })}
      message={intl.formatMessage(
        { id: 'health.messages.compose.closingSoonText' },
        { closeTime },
      )}
    />
  )
}
