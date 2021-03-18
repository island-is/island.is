import React, { FC } from 'react'

import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'

import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import ReviewSection, { ReviewSectionState } from './ReviewSection'

import { parentalLeaveFormMessages } from '../../lib/messages'
import { States as ApplicationStates } from '../../lib/ParentalLeaveTemplate'

import { getExpectedDateOfBirth } from '../../parentalLeaveUtils'

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

const EditInReviewSteps: FC<FieldBaseProps> = ({ application }) => {
  const dob = getExpectedDateOfBirth(application)
  if (!dob) {
    return null
  }
  const dobDate = new Date(dob)

  const { formatMessage } = useLocale()

  const steps = [
    {
      state: statesMap['employer'][application.state],
      title: formatMessage(
        parentalLeaveFormMessages.reviewScreen.employerEditsTitle,
      ),
      description: formatMessage(
        parentalLeaveFormMessages.reviewScreen.employerEditsDesc,
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
        <Text variant="h4" color="blue400">
          {formatMessage(
            parentalLeaveFormMessages.reviewScreen.estimatedBirthDate,
          )}
          <br />
          {format(dobDate, 'dd.MM.yyyy')}
        </Text>
      </Box>

      <Box marginTop={7} marginBottom={8}>
        {steps.map((step, index) => {
          return (
            <ReviewSection
              key={index}
              application={application}
              index={index + 1}
              {...step}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default EditInReviewSteps
