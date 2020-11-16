import React, { FC } from 'react'
import { RepeaterProps } from '@island.is/application/core'

import { Box, Button } from '@island.is/island-ui/core'
import Timeline from '../components/Timeline'
import { Period } from '../../types'
import { formatPeriods, getExpectedDateOfBirth } from '../parentalLeaveUtils'
import { FieldDescription } from '@island.is/shared/form-fields'

const PeriodsRepeater: FC<RepeaterProps> = ({
  removeRepeaterItem,
  application,
  expandRepeater,
}) => {
  const dob = getExpectedDateOfBirth(application)
  if (!dob) {
    return null
  }
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

  const editable = application.state === 'draft'
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
            editable ? otherParentPeriods : [],
          )}
          onDeletePeriod={removeRepeaterItem}
          editable={editable}
        />
      </Box>
      {editable && (
        <Button size="small" icon="add" onClick={expandRepeater}>
          Add another period
        </Button>
      )}
    </Box>
  )
}

export default PeriodsRepeater
