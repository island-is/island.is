import { ReviewGroup } from '@island.is/application/ui-components'
import { SummaryTimeline } from '../../components/SummaryTimeline/SummaryTimeline'
import { ReviewGroupProps } from './props'
import {
  formatPeriods,
  getApplicationExternalData,
  getBeginningOfMonth3MonthsAgo,
} from '../../../lib/parentalLeaveUtils'
import { useLocale } from '@island.is/localization'
import { errorMessages } from '../../..'
import addDays from 'date-fns/addDays'

export const Periods = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
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
      <SummaryTimeline application={application} />
      {(!applicationFundId || applicationFundId === '') &&
        periods.length > 0 &&
        new Date(periods[0].startDate) <
          addDays(getBeginningOfMonth3MonthsAgo(), -1) && (
          <p style={{ color: '#B30038', fontSize: '14px', fontWeight: '500' }}>
            {formatMessage(errorMessages.startDateInThePast)}
          </p>
        )}
    </ReviewGroup>
  )
}
