import { ReviewGroup } from '@island.is/application/ui-components'
import { SummaryTimeline } from '../../components/SummaryTimeline/SummaryTimeline'
import { ReviewGroupProps } from './props'
import {
  formatPeriods,
  getApplicationExternalData,
  getLastDayOfLastMonth,
} from '../../../lib/parentalLeaveUtils'
import { useLocale } from '@island.is/localization'
import { errorMessages } from '../../..'

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
        new Date(periods[0].startDate).getTime() <
          getLastDayOfLastMonth().getTime() && (
          <p style={{ color: '#B30038', fontSize: '14px', fontWeight: '500' }}>
            {formatMessage(errorMessages.startDateInThePast)}
          </p>
        )}
    </ReviewGroup>
  )
}
