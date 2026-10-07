import React from 'react'
import { useIntl } from 'react-intl'

import { RecipientNoticeCard } from '@/components/recipient-notice-card'
import { Typography } from '@/ui'
import {
  ClosedRecipient,
  getNextOpeningInfo,
  getOpeningHoursLabels,
  WindowLabels,
} from '@/utils/messaging-window'

/**
 * Shown whenever a recipient is closed for new conversations: why it can't be
 * messaged now, when it next opens, and the hours it keeps on each kind of day.
 *
 * Used both under the recipient dropdown and, when the user's only recipient is
 * closed, as the full-screen state — the surrounding ScrollView decides whether
 * it hugs its content or fills the sheet, so the card itself is the same.
 */
export const ClosedRecipientCard = ({
  recipient,
}: {
  recipient: ClosedRecipient
}) => {
  const intl = useIntl()

  const hours = getOpeningHoursLabels(recipient.openingHours)
  const nextOpening = getNextOpeningInfo(recipient.nextOpensAt)

  const hourRange = (window?: WindowLabels) => {
    if (!window) {
      return intl.formatMessage({
        id: 'health.messages.compose.openingHoursClosed',
      })
    }
    if (window.isAllDay) {
      return intl.formatMessage({
        id: 'health.messages.compose.openingHoursAllDay',
      })
    }
    return `${window.openLabel}–${window.closeLabel}`
  }

  // One wrapped paragraph: why it's closed, then when it opens again.
  const intro = [
    intl.formatMessage({ id: 'health.messages.compose.closedNowText' }),
    nextOpening
      ? intl.formatMessage(
          { id: 'health.messages.compose.closedNextOpensText' },
          {
            hasTime: nextOpening.opensAtMidnight ? 'false' : 'true',
            time: nextOpening.timeLabel,
            when: nextOpening.when,
            date: nextOpening.dateLabel,
          },
        )
      : undefined,
  ]
    .filter(Boolean)
    .join(' ')

  const hourLines = hours
    ? (
        [
          ['health.messages.compose.openingHoursWeekdays', hours.weekday],
          ['health.messages.compose.openingHoursWeekends', hours.weekend],
          ['health.messages.compose.openingHoursHolidays', hours.holiday],
        ] as const
      )
        .map(
          ([id, window]) =>
            `${intl.formatMessage({ id })}: ${hourRange(window)}`,
        )
        .join('\n')
    : undefined

  return (
    <RecipientNoticeCard
      title={intl.formatMessage({ id: 'health.messages.compose.closedTitle' })}
      // Composed of text nodes only — the card renders `message` inside a Text,
      // so a View here would not be allowed.
      message={
        <>
          {intro}
          {hourLines && (
            <>
              {'\n\n'}
              <Typography variant="body" weight="600">
                {intl.formatMessage({
                  id: 'health.messages.compose.openingHoursTitle',
                })}
              </Typography>
              {'\n'}
              {hourLines}
            </>
          )}
        </>
      }
    />
  )
}
