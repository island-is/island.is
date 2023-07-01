import React, { FC } from 'react'

import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'

import { FieldBaseProps } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import ReviewSection, { ReviewSectionState } from './ReviewSection'

import { parentalLeaveFormMessages } from '../../lib/messages'

import { getExpectedDateOfBirthOrAdoptionDate } from '../../lib/parentalLeaveUtils'
import { dateFormat } from '@island.is/shared/constants'

import { States as ApplicationStates } from '../../constants'
type StateMapEntry = { [key: string]: ReviewSectionState }
type StatesMap = {
  employer: StateMapEntry
  vinnumalastofnun: StateMapEntry
}
const statesMap: StatesMap = {
  employer: {
    [ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS]:
      ReviewSectionState.inProgress,
    [ApplicationStates.EMPLOYER_APPROVE_EDITS]: ReviewSectionState.inProgress,
    [ApplicationStates.VINNUMALASTOFNUN_APPROVE_EDITS]:
      ReviewSectionState.complete,
  },
  vinnumalastofnun: {
    [ApplicationStates.VINNUMALASTOFNUN_APPROVE_EDITS]:
      ReviewSectionState.inProgress,
  },
}

const EditInReviewSteps: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application } = props
  const dob = getExpectedDateOfBirthOrAdoptionDate(application)
  const dobDate = dob ? new Date(dob) : null

  const { formatMessage } = useLocale()

  const steps = [
    {
      state: statesMap['employer'][application.state],
      title: formatMessage(
        parentalLeaveFormMessages.editFlow.employerApprovesTitle,
      ),
      description: formatMessage(
        parentalLeaveFormMessages.editFlow.employerApprovesDesc,
      ),
    },
    {
      state: statesMap['vinnumalastofnun'][application.state],
      title: formatMessage(parentalLeaveFormMessages.reviewScreen.deptTitle),
      description: formatMessage(
        parentalLeaveFormMessages.reviewScreen.deptDesc,
      ),
    },
  ]

  return (
    <Box marginBottom={10}>
      <Box
        display={['block', 'block', 'block', 'flex']}
        justifyContent="spaceBetween"
      >
        {dobDate && (
          <Text variant="h4" color="blue400">
            {formatMessage(
              parentalLeaveFormMessages.reviewScreen.estimatedBirthDate,
            )}
            <br />
            {format(dobDate, dateFormat.is)}
          </Text>
        )}
      </Box>

      <Box marginTop={7} marginBottom={8}>
        {steps.map((step, index) => {
          return (
            <ReviewSection key={index} index={index + 1} {...props} {...step} />
          )
        })}
      </Box>
    </Box>
  )
}

export default EditInReviewSteps
