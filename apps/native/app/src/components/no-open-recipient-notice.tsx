import React from 'react'
import { useIntl } from 'react-intl'

import { ClosedRecipientCard } from '@/components/closed-recipient-card'
import { RecipientNoticeCard } from '@/components/recipient-notice-card'
import {
  GetHealthConversationRecipientsQuery,
  HealthDirectorateHealthConversationRecipientAvailability,
} from '@/graphql/types/schema'

type Recipient = NonNullable<
  GetHealthConversationRecipientsQuery['healthDirectorateHealthConversationRecipients']
>[number]

/**
 * Fills the compose sheet when nothing can be sent: none registered, or all of
 * them blocked. Says which.
 */
export const NoOpenRecipientNotice = ({
  recipients,
}: {
  recipients: Recipient[]
}) => {
  const intl = useIntl()

  const isClosed = (recipient: Recipient) =>
    recipient.availability ===
    HealthDirectorateHealthConversationRecipientAvailability.Closed

  // A single recipient is named; closed-for-now gets its hours.
  const soleRecipient = recipients.length === 1 ? recipients[0] : undefined
  if (soleRecipient) {
    return isClosed(soleRecipient) ? (
      <ClosedRecipientCard recipient={soleRecipient} />
    ) : (
      <RecipientNoticeCard
        title={intl.formatMessage({
          id: 'health.messages.compose.soleBlockedTitle',
        })}
        message={intl.formatMessage(
          { id: 'health.messages.compose.soleBlockedText' },
          { name: soleRecipient.name },
        )}
      />
    )
  }

  // Several, all blocked: no one set of hours to list.
  if (recipients.some(isClosed)) {
    return (
      <RecipientNoticeCard
        title={intl.formatMessage({
          id: 'health.messages.compose.closedTitle',
        })}
        message={intl.formatMessage({
          id: 'health.messages.compose.closedNowText',
        })}
      />
    )
  }

  // None registered, or none of them offers messaging at all.
  return (
    <RecipientNoticeCard
      title={intl.formatMessage({
        id: 'health.messages.compose.noRecipient',
      })}
      message={intl.formatMessage({
        id: 'health.messages.compose.noRecipientText',
      })}
    />
  )
}
