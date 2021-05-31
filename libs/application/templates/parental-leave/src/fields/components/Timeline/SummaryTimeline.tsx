import React from 'react'

import { Box } from '@island.is/island-ui/core'
import { DataValue } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'

import { Period } from '../../../types'
import { parentalLeaveFormMessages } from '../../../lib/messages'

interface SummaryTimelineProps {
  periods: Period[]
}

export const SummaryTimeline = ({ periods }: SummaryTimelineProps) => {
  const { formatMessage, formatDateFns } = useLocale()

  // TODO: add otherParentPeriods once available
  return (
    <Box>
      {periods.map((period, index) => (
        <DataValue
          key={`SummaryTimeline-${index}`}
          label={formatMessage(parentalLeaveFormMessages.reviewScreen.period, {
            index: index + 1,
            ratio: period.ratio,
          })}
          value={`${formatDateFns(period.startDate)} — ${formatDateFns(
            period.endDate,
          )}`}
        />
      ))}
    </Box>
  )
}
