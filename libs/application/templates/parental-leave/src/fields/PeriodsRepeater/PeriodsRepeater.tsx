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
import { useApplicationAnswers } from '../../hooks/useApplicationAnswers'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'

type FieldProps = {
  field?: {
    props?: {
      showDescription: boolean
    }
  }
}
type ScreenProps = RepeaterProps & FieldProps

export const PeriodsRepeater: FC<ScreenProps> = ({
  removeRepeaterItem,
  application,
  expandRepeater,
  field,
}) => {
  const { formatMessage, locale } = useLocale()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const { periods } = useApplicationAnswers(application)
  const showDescription = field?.props?.showDescription ?? true
  const dob = getExpectedDateOfBirth(application)
  const rights = getAvailablePersonalRightsInDays(application)
  const daysAlreadyUsed = useDaysAlreadyUsed(application)

  const handleRepeater = async () => {
    const cleanedPeriods = periods.filter(
      (period) => period.startDate && period.endDate && period.ratio,
    )

    const { data, errors } = await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: { periods: cleanedPeriods },
        },
        locale,
      },
    })

    if (!errors) {
      const { answers } = data.updateApplication

      expandRepeater(answers)
    }
  }

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
              onClick={handleRepeater}
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
