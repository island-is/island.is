import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import addDays from 'date-fns/addDays'
import { errorMessages, parentalLeaveFormMessages } from '../../../lib/messages'
import {
  formatPeriods,
  getApplicationExternalData,
  getBeginningOfMonth3MonthsAgo,
} from '../../../lib/parentalLeaveUtils'
import { ReviewGroupProps } from './props'

export const Periods = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage, formatDateFns } = useLocale()
  const { applicationFundId } = getApplicationExternalData(
    application.externalData,
  )
  const periods = formatPeriods(application, formatMessage)

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('periods')}
      isLast={true}
    >
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
      {(!applicationFundId || applicationFundId === '') &&
        periods.length > 0 &&
        new Date(periods[0].startDate) <
          addDays(getBeginningOfMonth3MonthsAgo(), -1) && (
          <p style={{ color: '#B30038', fontSize: '14px', fontWeight: 500 }}>
            {formatMessage(errorMessages.startDateInThePast)}
          </p>
        )}
    </ReviewGroup>
  )
}
