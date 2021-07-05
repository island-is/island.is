import React from 'react'

import { Box } from '@island.is/island-ui/core'
import { DataValue } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import { Application } from '@island.is/application/core'

import { parentalLeaveFormMessages } from '../../../lib/messages'
import { formatPeriods } from '../../../lib/parentalLeaveUtils'

interface SummaryTimelineProps {
  application: Application
}

export const SummaryTimeline = ({ application }: SummaryTimelineProps) => {
  const { formatMessage, formatDateFns } = useLocale()
  const periods = formatPeriods(application, formatMessage)

  // TODO: add otherParentPeriods once available
  return (
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
            label={formatMessage(
              parentalLeaveFormMessages.reviewScreen.period,
              {
                index: index + 1,
                ratio: period.ratio,
              },
            )}
            value={value}
          />
        )
      })}
    </Box>
  )
}
