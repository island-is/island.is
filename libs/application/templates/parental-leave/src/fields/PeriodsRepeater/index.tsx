import React, { FC, useState } from 'react'
import { RepeaterProps } from '@island.is/application/core'

import { theme } from '@island.is/island-ui/theme'
import { Box } from '@island.is/island-ui/core'
import Timeline, { Period } from '../components/Timeline'

const PeriodsRepeater: FC<RepeaterProps> = ({
  error,
  repeater,
  application,
}) => {
  // TODO: This will come from somewhere in the formResult...
  const dob = '2021-01-03T00:00:00.000Z'
  const dobDate = new Date(dob)

  // TODO:
  // This will also come from somewhere in the formResult
  // and we will have a function to merge both
  // parent data and to create this array and its localized strings...
  const defaultPeriods = [
    {
      startDate: dob,
      endDate: '2021-07-13T00:00:00.000Z',
      title: 'Period 1 - 100%',
    },
    {
      startDate: '2021-07-13T00:00:00.000Z',
      endDate: '2021-12-03T00:00:00.000Z',
      title: 'Period 2 - 50%',
      canDelete: true,
    },
    {
      startDate: dob,
      endDate: '2021-05-17T00:00:00.000Z',
      title: 'Other parent - 50%',
      color: theme.color.red200,
    },
    {
      startDate: '2021-03-13T00:00:00.000Z',
      endDate: '2021-10-03T00:00:00.000Z',
      title: 'Other parent - 50%',
      color: theme.color.red200,
    },
  ]

  const [periods, setPeriods] = useState<Period[]>(defaultPeriods)

  // TODO: MAybe this will be a reducer action?
  const onDeletePeriod = (index: number) => {
    setPeriods(periods.filter((_, i) => index !== i))
  }

  return (
    <Box>
      <Box marginTop={3}>
        <Timeline
          initDate={dobDate}
          title="Expected birth date"
          titleSmall="Birth date"
          periods={periods}
          onDeletePeriod={onDeletePeriod}
        />
        {/* TODO: "Add another period" will go here */}
      </Box>
    </Box>
  )
}

export default PeriodsRepeater
