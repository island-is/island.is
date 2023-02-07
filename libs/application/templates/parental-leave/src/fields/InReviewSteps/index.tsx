import React, { FC, useCallback, useState } from 'react'
import format from 'date-fns/format'
import { useMutation } from '@apollo/client'
import { MessageDescriptor } from '@formatjs/intl'

import { useLocale } from '@island.is/localization'
import { dateFormat } from '@island.is/shared/constants'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { handleServerError } from '@island.is/application/ui-components'

import ReviewSection, { ReviewSectionState } from './ReviewSection'
import { Review } from '../Review/Review'
import { parentalLeaveFormMessages } from '../../lib/messages'
import {
  getApplicationAnswers,
  getExpectedDateOfBirth,
  otherParentApprovalDescription,
  requiresOtherParentApproval,
  residentGrantIsOpenForApplication,
} from '../../lib/parentalLeaveUtils'
import {
  NO,
  PARENTAL_LEAVE,
  States as ApplicationStates,
  YES,
} from '../../constants'
import { useApplicationAnswers } from '../../hooks/useApplicationAnswers'
import { useRemainingRights } from '../../hooks/useRemainingRights'

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
    [ApplicationStates.ADDITIONAL_DOCUMENTS_REQUIRED]:
      ReviewSectionState.complete,
    [ApplicationStates.INREVIEW_ADDITIONAL_DOCUMENTS_REQUIRED]:
      ReviewSectionState.complete,
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
    [ApplicationStates.ADDITIONAL_DOCUMENTS_REQUIRED]:
      ReviewSectionState.complete,
    [ApplicationStates.INREVIEW_ADDITIONAL_DOCUMENTS_REQUIRED]:
      ReviewSectionState.complete,
  },
  vinnumalastofnun: {
    [ApplicationStates.ADDITIONAL_DOCUMENTS_REQUIRED]:
      ReviewSectionState.requiresAction,
    [ApplicationStates.INREVIEW_ADDITIONAL_DOCUMENTS_REQUIRED]:
      ReviewSectionState.requiresAction,
    [ApplicationStates.VINNUMALASTOFNUN_APPROVAL]:
      ReviewSectionState.inProgress,
    [ApplicationStates.APPROVED]: ReviewSectionState.complete,
    [ApplicationStates.CLOSED]: ReviewSectionState.complete,
  },
}

const descKey: { [key: string]: MessageDescriptor } = {
  [ApplicationStates.EMPLOYER_APPROVAL]:
    parentalLeaveFormMessages.reviewScreen.employerDesc,
  [ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN]:
    parentalLeaveFormMessages.reviewScreen.employerDesc,
  [ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS]:
    parentalLeaveFormMessages.editFlow.employerApprovesDesc,
  [ApplicationStates.EMPLOYER_APPROVE_EDITS]:
    parentalLeaveFormMessages.editFlow.employerApprovesDesc,
}

const InReviewSteps: FC<FieldBaseProps> = (props) => {
  const { application, field, refetch, errors } = props
  const {
    isSelfEmployed,
    applicationType,
    isRecivingUnemploymentBenefits,
  } = useApplicationAnswers(application)
  const oldApplication = applicationType === undefined // Added this check for applications that is in the db already
  const isBeneficiaries = !oldApplication
    ? applicationType === PARENTAL_LEAVE
      ? isRecivingUnemploymentBenefits === YES
      : false
    : false
  const { state } = application
  const { dateOfBirth } = application.answers
  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => handleServerError(e, formatMessage),
    },
  )

  const { formatMessage } = useLocale()
  const [screenState, setScreenState] = useState<'steps' | 'viewApplication'>(
    'steps',
  )
  const isAdditionalDocumentRequiredState =
    application.state ===
      ApplicationStates.INREVIEW_ADDITIONAL_DOCUMENTS_REQUIRED ||
    application.state === ApplicationStates.ADDITIONAL_DOCUMENTS_REQUIRED

  const steps = [
    {
      state: statesMap['vinnumalastofnun'][application.state],
      title: formatMessage(
        isAdditionalDocumentRequiredState
          ? parentalLeaveFormMessages.reviewScreen
              .additionalDocumentRequiredTitle
          : parentalLeaveFormMessages.reviewScreen.deptTitle,
      ),
      description: formatMessage(
        isAdditionalDocumentRequiredState
          ? parentalLeaveFormMessages.reviewScreen
              .additionalDocumentRequiredDesc
          : parentalLeaveFormMessages.reviewScreen.deptDesc,
      ),
    },
  ]

  if (isSelfEmployed === NO && !isBeneficiaries) {
    steps.unshift({
      state: statesMap['employer'][application.state],
      title: formatMessage(
        parentalLeaveFormMessages.reviewScreen.employerTitle,
      ),
      description: formatMessage(descKey[application.state]),
    })
  }

  if (
    requiresOtherParentApproval(application.answers, application.externalData)
  ) {
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

  if (
    dateOfBirth &&
    residentGrantIsOpenForApplication(`${dateOfBirth}`) &&
    (state === 'approved' ||
      state === 'vinnumalastofnunApproveEdits' ||
      state === 'vinnumalastofnunApproval')
  ) {
    steps.push({
      state: ReviewSectionState.optionalAction,
      title: formatMessage(
        parentalLeaveFormMessages.residenceGrantMessage.residenceGrantTitle,
      ),
      description: formatMessage(
        parentalLeaveFormMessages.residenceGrantMessage
          .residenceGrantOpenDescription,
      ),
    })
  } else {
    steps.push({
      state: ReviewSectionState.prerequisites,
      title: formatMessage(
        parentalLeaveFormMessages.residenceGrantMessage.residenceGrantTitle,
      ),
      description: formatMessage(
        parentalLeaveFormMessages.residenceGrantMessage
          .residenceGrantClosedDescription,
      ),
    })
  }

  const dob = getExpectedDateOfBirth(application)
  const dobDate = dob ? new Date(dob) : null

  const canBeEdited =
    application.state === ApplicationStates.OTHER_PARENT_APPROVAL ||
    application.state === ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN ||
    application.state === ApplicationStates.EMPLOYER_APPROVAL ||
    application.state === ApplicationStates.VINNUMALASTOFNUN_APPROVAL ||
    application.state === ApplicationStates.APPROVED ||
    application.state ===
      ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS ||
    application.state === ApplicationStates.EMPLOYER_APPROVE_EDITS ||
    application.state === ApplicationStates.VINNUMALASTOFNUN_APPROVE_EDITS

  const { periods } = getApplicationAnswers(application.answers)
  const lastEndDate = new Date(periods[periods.length - 1].endDate)
  const isUsedAllRights =
    useRemainingRights(application) > 0 ||
    lastEndDate.getTime() > new Date().getTime()
  const handleSubmit = useCallback(async (event: string) => {
    const res = await submitApplication({
      variables: {
        input: {
          id: application.id,
          event,
          answers: application.answers,
        },
      },
    })
    if (res?.data) {
      // Takes them to the next state (which loads the relevant form)
      refetch?.()
    }
  }, [])
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

          {canBeEdited && isUsedAllRights && (
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
                onClick={() => handleSubmit('EDIT')}
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
              notifyParentOnClickEvent={() => handleSubmit('RESIDENCEGRANTAPPLICATION')}            />
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
