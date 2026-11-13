import { Application } from '@island.is/application/types'
import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { Box, Tag, Text, Tooltip } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { parentalLeaveFormMessages } from '../../../lib/messages'
import {
  formatPeriods,
  getApplicationAnswers,
  getChangeBaseline,
  periodsHaveChanged,
} from '../../../lib/parentalLeaveUtils'

interface ReviewScreenProps {
  application: Application
  goToScreen?: (id: string) => void
}

const Periods: FC<React.PropsWithChildren<ReviewScreenProps>> = ({
  application,
  goToScreen,
}) => {
  const { formatMessage, formatDateFns } = useLocale()
  const periods = formatPeriods(application, formatMessage)
  const { periods: currentPeriods } = getApplicationAnswers(application.answers)
  const baseline = getChangeBaseline(application.externalData)

  const hasChanges =
    !!baseline &&
    baseline.periods.length > 0 &&
    periodsHaveChanged(baseline.periods, currentPeriods)

  return (
    <ReviewGroup isEditable editAction={() => goToScreen?.('periods')} isLast>
      <Box display="flex" alignItems="center" columnGap={1} marginBottom={3}>
        <Text variant="h3">
          {formatMessage(parentalLeaveFormMessages.shared.periodsSection)}
        </Text>
        <Tooltip
          text={formatMessage(parentalLeaveFormMessages.shared.periodsTooltip)}
        />
        {hasChanges && (
          <Tag variant="purple">
            {formatMessage(parentalLeaveFormMessages.shared.changesMadeTag)}
          </Tag>
        )}
      </Box>
      <Box>
        {periods.map((period, index) => {
          const value = period.actualDob
            ? formatMessage(
                parentalLeaveFormMessages.reviewScreen.periodActualDob,
                {
                  duration: period.duration,
                },
              )
            : `${formatDateFns(period.startDate)} — ${formatDateFns(
                period.endDate,
              )}`

          return (
            <DataValue
              key={`SummaryTimeline-${index}`}
              label={period.title}
              value={value ?? ''}
            />
          )
        })}
      </Box>
    </ReviewGroup>
  )
}

export default Periods
