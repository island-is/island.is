import React, { FC } from 'react'
import { CustomField, RepeaterProps } from '@island.is/application/core'

import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import Timeline from '../components/Timeline'
import { formatPeriods, getExpectedDateOfBirth } from '../../parentalLeaveUtils'
import { FieldDescription } from '@island.is/shared/form-fields'
import { parentalLeaveFormMessages } from '../../lib/messages'

type FieldProps = {
  field: {
    props: {
      showDescription: boolean
    }
  }
}
type PeriodsRepeaterProps = RepeaterProps & FieldProps

const PeriodsRepeater: FC<PeriodsRepeaterProps> = ({
  removeRepeaterItem,
  application,
  expandRepeater,
  field,
}) => {
  const {
    props: { showDescription = true },
  } = field
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
      {showDescription && (
        <FieldDescription
          description={formatMessage(
            parentalLeaveFormMessages.leavePlan.description,
          )}
        />
      )}
      <Box marginTop={showDescription ? 3 : undefined} marginBottom={3}>
        <Timeline
          initDate={dobDate}
          title={formatMessage(
            parentalLeaveFormMessages.shared.expectedDateOfBirthTitle,
          )}
          titleSmall={formatMessage(
            parentalLeaveFormMessages.shared.dateOfBirthTitle,
          )}
          periods={formatPeriods(application, formatMessage)}
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
