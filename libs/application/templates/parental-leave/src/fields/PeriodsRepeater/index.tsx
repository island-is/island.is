import React, { FC } from 'react'

import { RepeaterProps } from '@island.is/application/core'
import { Box, Button, Inline, Tooltip } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldDescription } from '@island.is/shared/form-fields'

import { Timeline } from '../components/Timeline/Timeline'
import {
  formatPeriods,
  getAvailablePersonalRightsInDays,
  getExpectedDateOfBirth,
} from '../../lib/parentalLeaveUtils'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { States } from '../../constants'
import { useDaysAlreadyUsed } from '../../hooks/useDaysAlreadyUsed'

type FieldProps = {
  field?: {
    props?: {
      showDescription: boolean
    }
  }
}
type ScreenProps = RepeaterProps & FieldProps

const PeriodsRepeater: FC<ScreenProps> = ({
  removeRepeaterItem,
  application,
  expandRepeater,
  field,
}) => {
  const showDescription = field?.props?.showDescription ?? true
  const dob = getExpectedDateOfBirth(application)
  const { formatMessage } = useLocale()
  const rights = getAvailablePersonalRightsInDays(application)
  const daysAlreadyUsed = useDaysAlreadyUsed(application)

  if (!dob) {
    return null
  }

  const dobDate = new Date(dob)
  const editable =
    application.state === States.DRAFT ||
    application.state === States.EDIT_OR_ADD_PERIODS

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
        <Box alignItems="center">
          <Inline space={1} alignY="center">
            <Button
              size="small"
              icon="add"
              disabled={daysAlreadyUsed >= rights}
              onClick={expandRepeater}
            >
              {formatMessage(parentalLeaveFormMessages.leavePlan.addAnother)}
            </Button>

            {daysAlreadyUsed >= rights && (
              <Tooltip
                placement="bottom"
                text={formatMessage(parentalLeaveFormMessages.leavePlan.limit)}
              />
            )}
          </Inline>
        </Box>
      )}
    </Box>
  )
}

export default PeriodsRepeater
