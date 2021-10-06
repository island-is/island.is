import React, { FC, useState } from 'react'
import format from 'date-fns/format'
import { useMutation } from '@apollo/client'

import { useLocale } from '@island.is/localization'
import { dateFormat } from '@island.is/shared/constants'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'

import ReviewSection, { ReviewSectionState } from './ReviewSection'
import { Review } from '../Review/Review'
import { parentalLeaveFormMessages } from '../../lib/messages'
import {
  getExpectedDateOfBirth,
  otherParentApprovalDescription,
  requiresOtherParentApproval,
} from '../../lib/parentalLeaveUtils'
import { handleSubmitError } from '../../lib/parentalLeaveClientUtils'
import { NO, States as ApplicationStates } from '../../constants'
import { useApplicationAnswers } from '../../hooks/useApplicationAnswers'

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
    [ApplicationStates.VINNUMALASTOFNUN_APPROVAL]: ReviewSectionState.complete,
    [ApplicationStates.APPROVED]: ReviewSectionState.complete,
  },
  employer: {
    [ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN]:
      ReviewSectionState.inProgress,
    [ApplicationStates.EMPLOYER_APPROVAL]: ReviewSectionState.inProgress,
    [ApplicationStates.VINNUMALASTOFNUN_APPROVAL]: ReviewSectionState.complete,
    [ApplicationStates.APPROVED]: ReviewSectionState.complete,
  },
  vinnumalastofnun: {
    [ApplicationStates.VINNUMALASTOFNUN_APPROVAL]:
      ReviewSectionState.inProgress,
    [ApplicationStates.APPROVED]: ReviewSectionState.complete,
  },
}

const InReviewSteps: FC<FieldBaseProps> = ({
  application,
  field,
  refetch,
  errors,
}) => {
  const { isSelfEmployed } = useApplicationAnswers(application)
  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => handleSubmitError(e.message, formatMessage),
    },
  )

  const { formatMessage } = useLocale()
  const [screenState, setScreenState] = useState<'steps' | 'viewApplication'>(
    'steps',
  )

  const steps = [
    {
      state: statesMap['vinnumalastofnun'][application.state],
      title: formatMessage(parentalLeaveFormMessages.reviewScreen.deptTitle),
      description: formatMessage(
        parentalLeaveFormMessages.reviewScreen.deptDesc,
      ),
    },
  ]

  if (isSelfEmployed === NO) {
    steps.unshift({
      state: statesMap['employer'][application.state],
      title: formatMessage(
        parentalLeaveFormMessages.reviewScreen.employerTitle,
      ),
      description: formatMessage(
        parentalLeaveFormMessages.reviewScreen.employerDesc,
      ),
    })
  }

  if (requiresOtherParentApproval(application.answers)) {
    steps.unshift({
      state: statesMap['otherParent'][application.state],
      title: formatMessage(
        parentalLeaveFormMessages.reviewScreen.otherParentTitle,
      ),
      description: otherParentApprovalDescription(
        application.answers,
        formatMessage,
      ),
    })
  }

  const dob = getExpectedDateOfBirth(application)
  const dobDate = dob ? new Date(dob) : null

  const canBeEdited =
    application.state === ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN ||
    application.state === ApplicationStates.APPROVED

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
        <Box>
          <Box
            display={['block', 'inlineBlock']}
            marginLeft={[0, 0, 0, 0]}
            marginRight={2}
            marginTop={[2, 2, 2, 0]}
            marginBottom={[1, 0]}
          >
            <Button
              colorScheme="default"
              iconType="filled"
              onClick={() =>
                setScreenState(
                  (screenState === 'steps' && 'viewApplication') || 'steps',
                )
              }
              size="small"
              type="button"
              variant="text"
            >
              {(screenState === 'steps' &&
                formatMessage(
                  parentalLeaveFormMessages.reviewScreen.buttonsView,
                )) ||
                formatMessage(
                  parentalLeaveFormMessages.reviewScreen.buttonsViewProgress,
                )}
            </Button>
          </Box>
          {canBeEdited && (
            <Box display="inlineBlock">
              <Button
                colorScheme="default"
                iconType="filled"
                size="small"
                type="button"
                variant="text"
                icon="pencil"
                loading={loadingSubmit}
                disabled={loadingSubmit}
                onClick={async () => {
                  const res = await submitApplication({
                    variables: {
                      input: {
                        id: application.id,
                        event: 'EDIT',
                        answers: application.answers,
                      },
                    },
                  })

                  if (res?.data) {
                    // Takes them to the next state (which loads the relevant form)
                    refetch?.()
                  }
                }}
              >
                {formatMessage(
                  parentalLeaveFormMessages.reviewScreen.buttonsEdit,
                )}
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {screenState === 'steps' ? (
        <Box marginTop={7} marginBottom={8}>
          {steps.map((step, index) => (
            <ReviewSection
              key={index}
              application={application}
              index={index + 1}
              {...step}
            />
          ))}
        </Box>
      ) : (
        <Box marginTop={7} marginBottom={8}>
          <Review application={application} field={field} errors={errors} />
        </Box>
      )}
    </Box>
  )
}

export default InReviewSteps
