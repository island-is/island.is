import React, { FC } from 'react'
import { RepeaterProps } from '@island.is/application/core'

import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import Timeline from '../components/Timeline'
import { Period } from '../../types'
import { formatPeriods, getExpectedDateOfBirth } from '../parentalLeaveUtils'
import { FieldDescription } from '@island.is/shared/form-fields'
import { m, mm } from '../../lib/messages'

const PeriodsRepeater: FC<RepeaterProps> = ({
  removeRepeaterItem,
  application,
  expandRepeater,
}) => {
  const dob = getExpectedDateOfBirth(application)
  const { formatMessage } = useLocale()
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
      <FieldDescription description={formatMessage(mm.leavePlan.description)} />
      <Box marginY={3}>
        <Timeline
          initDate={dobDate}
          title={formatMessage(m.expectedDateOfBirthTitle)}
          titleSmall={formatMessage(m.dateOfBirthTitle)}
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
          {formatMessage(mm.leavePlan.addAnother)}
        </Button>
      )}
    </Box>
  )
}

export default PeriodsRepeater
