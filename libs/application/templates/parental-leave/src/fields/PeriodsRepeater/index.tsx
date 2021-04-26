import React, { FC } from 'react'
import { RepeaterProps } from '@island.is/application/core'

import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import Timeline from '../components/Timeline'
import { Period } from '../../types'
import { formatPeriods, getExpectedDateOfBirth } from '../../parentalLeaveUtils'
import { FieldDescription } from '@island.is/shared/form-fields'
import { parentalLeaveFormMessages } from '../../lib/messages'

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

  const editable =
    application.state === 'draft' || application.state === 'editOrAddPeriods'

  return (
    <Box>
      <FieldDescription
        description={formatMessage(
          parentalLeaveFormMessages.leavePlan.description,
        )}
      />
      <Box marginY={3}>
        <Timeline
          initDate={dobDate}
          title={formatMessage(
            parentalLeaveFormMessages.shared.expectedDateOfBirthTitle,
          )}
          titleSmall={formatMessage(
            parentalLeaveFormMessages.shared.dateOfBirthTitle,
          )}
          periods={formatPeriods(application.answers.periods as Period[])}
          // TODO: Once we have the data, add the otherParentPeriods here.
          // periods={formatPeriods(
          //   application.answers.periods as Period[],
          //   editable ? otherParentPeriods : [],
          // )}
          onDeletePeriod={removeRepeaterItem}
          editable={editable}
        />
      </Box>
      {editable && (
        <Button size="small" icon="add" onClick={expandRepeater}>
          {formatMessage(parentalLeaveFormMessages.leavePlan.addAnother)}
        </Button>
      )}
    </Box>
  )
}

export default PeriodsRepeater
