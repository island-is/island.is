import React, { FC } from 'react'
import { RepeaterProps } from '@island.is/application/core'

import { theme } from '@island.is/island-ui/theme'
import { Box, Button } from '@island.is/island-ui/core'
import Timeline, { TimelinePeriod } from '../components/Timeline'
import { Period } from '../../types'
import { getExpectedDateOfBirth } from '../parentalLeaveUtils'
import { FieldDescription } from '@island.is/shared/form-fields'

function formatPeriods(
  periods: Period[],
  otherParentPeriods: Period[],
): TimelinePeriod[] {
  const timelinePeriods: TimelinePeriod[] = []
  periods.forEach((period, index) => {
    if (period.startDate && period.endDate) {
      timelinePeriods.push({
        startDate: period.startDate,
        endDate: period.endDate,
        canDelete: true,
        title: `Period ${index + 1} - ${period.ratio ?? 100}%`,
      })
    }
  })
  otherParentPeriods.forEach((period) => {
    timelinePeriods.push({
      startDate: period.startDate,
      endDate: period.endDate,
      canDelete: false,
      color: theme.color.red200,
      title: `Other parent ${period.ratio ?? 100}%`,
    })
  })
  return timelinePeriods
}

const PeriodsRepeater: FC<RepeaterProps> = ({
  removeRepeaterItem,
  application,
  expandRepeater,
}) => {
  const dob = getExpectedDateOfBirth(application)
  const dobDate = new Date(dob)

  // TODO this will also come from somewhere in the external data
  const otherParentPeriods: Period[] = [
    {
      startDate: dob,
      endDate: '2021-05-17T00:00:00.000Z',
      ratio: 50,
    },
    {
      startDate: '2021-03-13T00:00:00.000Z',
      endDate: '2021-10-03T00:00:00.000Z',
      ratio: 50,
    },
  ]

  return (
    <Box>
      <FieldDescription description="These are your already selected parental leave periods. If the other parent has agreed to share their period leave information, then those period leaves are visible below." />
      <Box marginY={3}>
        <Timeline
          initDate={dobDate}
          title="Expected birth date"
          titleSmall="Birth date"
          periods={formatPeriods(
            application.answers.periods as Period[],
            otherParentPeriods,
          )}
          onDeletePeriod={removeRepeaterItem}
        />
      </Box>
      <Button size="small" icon="add" onClick={expandRepeater}>
        Add another period
      </Button>
    </Box>
  )
}

export default PeriodsRepeater
