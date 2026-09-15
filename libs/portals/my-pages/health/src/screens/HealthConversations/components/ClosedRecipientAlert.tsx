import { Box, Icon, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../../lib/messages'
import { HealthConversationRecipientFragment } from '../NewHealthConversation.generated'
import {
  getNextOpeningInfo,
  getOpeningHoursLabels,
} from '../utils/messagingWindow'

interface Props {
  recipient: Pick<
    HealthConversationRecipientFragment,
    'name' | 'openingHours' | 'nextOpensAt'
  >
}

/**
 * Gray "closed for new messages" alert with the moon icon — a custom design
 * that matches no AlertMessage variant.
 */
const ClosedRecipientAlert = ({ recipient }: Props) => {
  const { formatMessage } = useLocale()

  const hours = getOpeningHoursLabels(recipient.openingHours)
  const nextOpening = getNextOpeningInfo(recipient.nextOpensAt)

  const hourRange = (window?: { openLabel: string; closeLabel: string }) =>
    window
      ? `${window.openLabel}–${window.closeLabel}`
      : formatMessage(messages.healthConversationOpeningHoursClosed)

  return (
    <Box
      padding={[1, 1, 2]}
      borderRadius="large"
      background="dark100"
      borderColor="dark200"
      borderWidth="standard"
      data-testid="closedRecipientAlert"
    >
      <Box display="flex" alignItems="flexStart">
        <Box display="flex" marginRight={[1, 1, 2]}>
          <Icon size="large" type="outline" color="dark350" icon="moon" />
        </Box>
        <Box display="flex" width="full" flexDirection="column">
          <Text as="h5" variant="h5" marginBottom={1}>
            {formatMessage(messages.healthConversationClosedTitle)}
          </Text>
          <Text variant="small">
            {formatMessage(messages.healthConversationClosedNowText)}
          </Text>
          {nextOpening && (
            <Text variant="small" fontWeight="semiBold">
              {formatMessage(messages.healthConversationClosedNextOpensText, {
                time: nextOpening.timeLabel,
                when: nextOpening.when,
                date: nextOpening.dateLabel,
              })}
            </Text>
          )}
          {hours && (
            <Box marginTop={2}>
              <Text variant="small" fontWeight="semiBold">
                {formatMessage(messages.healthConversationOpeningHoursTitle)}
              </Text>
              <Box component="ul" paddingLeft={3}>
                {(
                  [
                    [
                      messages.healthConversationOpeningHoursWeekdays,
                      hours.weekday,
                    ],
                    [
                      messages.healthConversationOpeningHoursWeekends,
                      hours.weekend,
                    ],
                    [
                      messages.healthConversationOpeningHoursHolidays,
                      hours.holiday,
                    ],
                  ] as const
                ).map(([label, window]) => (
                  <li key={label.id} style={{ listStyleType: 'disc' }}>
                    <Text variant="small">
                      {`${formatMessage(label)}: ${hourRange(window)}`}
                    </Text>
                  </li>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default ClosedRecipientAlert
