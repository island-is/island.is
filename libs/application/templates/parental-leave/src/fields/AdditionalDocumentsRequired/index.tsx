import React, { FC } from 'react'
import format from 'date-fns/format'
import { useLocale } from '@island.is/localization'
import { dateFormat } from '@island.is/shared/constants'
import { FieldBaseProps, RepeaterProps } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'

import ReviewSection, { ReviewSectionState } from '../InReviewSteps/ReviewSection'

import { parentalLeaveFormMessages } from '../../lib/messages'
import { getExpectedDateOfBirth } from '../../lib/parentalLeaveUtils'
import {
  States as ApplicationStates,
} from '../../constants'

type FieldProps = FieldBaseProps & {
  field?: {
    props?: {
      showDescription: boolean
    }
  }
}
type ScreenProps = RepeaterProps & FieldProps

const AdditionalDocumentsRequired: FC<ScreenProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const AdditionalDocumentsRequiredSection = ReviewSection

  type StateMapEntry = { [key: string]: ReviewSectionState }

  type StatesMap = {
    otherParent: StateMapEntry
    employer: StateMapEntry
    vinnumalastofnun: StateMapEntry
  }
  
  const statesMap: StatesMap = {
    otherParent: {
      [ApplicationStates.OTHER_PARENT_APPROVAL]: ReviewSectionState.inProgress,
      [ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN]: ReviewSectionState.complete,
      [ApplicationStates.EMPLOYER_APPROVAL]: ReviewSectionState.complete,
      [ApplicationStates.EMPLOYER_APPROVE_EDITS]: ReviewSectionState.complete,
      [ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS]:
        ReviewSectionState.complete,
      [ApplicationStates.VINNUMALASTOFNUN_APPROVAL]: ReviewSectionState.complete,
      [ApplicationStates.VINNUMALASTOFNUN_APPROVE_EDITS]:
        ReviewSectionState.complete,
      [ApplicationStates.APPROVED]: ReviewSectionState.complete,
      [ApplicationStates.CLOSED]: ReviewSectionState.complete,
    },
    employer: {
      [ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN]:
        ReviewSectionState.inProgress,
      [ApplicationStates.EMPLOYER_APPROVAL]: ReviewSectionState.inProgress,
      [ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS]:
        ReviewSectionState.inProgress,
      [ApplicationStates.EMPLOYER_APPROVE_EDITS]: ReviewSectionState.inProgress,
      [ApplicationStates.VINNUMALASTOFNUN_APPROVAL]: ReviewSectionState.complete,
      [ApplicationStates.VINNUMALASTOFNUN_APPROVE_EDITS]:
        ReviewSectionState.complete,
      [ApplicationStates.APPROVED]: ReviewSectionState.complete,
      [ApplicationStates.CLOSED]: ReviewSectionState.complete,
    },
    vinnumalastofnun: {
      [ApplicationStates.VINNUMALASTOFNUN_APPROVAL]:
        ReviewSectionState.inProgress,
      [ApplicationStates.APPROVED]: ReviewSectionState.complete,
      [ApplicationStates.CLOSED]: ReviewSectionState.complete,
    },
  }
  
  const steps = [
    {
      state: statesMap['vinnumalastofnun'][application.state],
      title: formatMessage(parentalLeaveFormMessages.reviewScreen.deptTitle),
      description: formatMessage(
        parentalLeaveFormMessages.reviewScreen.deptDesc,
      ),
    },
  ]

  const dob = getExpectedDateOfBirth(application)
  const dobDate = dob ? new Date(dob) : null

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
        {steps.map((step, index) => (
          <AdditionalDocumentsRequiredSection
            key={index}
            application={application}
            index={index + 1}
            {...step}
          />
        ))}
      </Box>
    </Box>
  )
}

export default AdditionalDocumentsRequired
