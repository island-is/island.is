import { Application } from '@island.is/application/types'
import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { parentalLeaveFormMessages } from '../../../lib/messages'
import { formatPeriods } from '../../../lib/parentalLeaveUtils'

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
  return (
    <ReviewGroup
      isEditable
      editAction={() => goToScreen?.('addPeriods')}
      isLast
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
    </ReviewGroup>
  )
}

export default Periods
