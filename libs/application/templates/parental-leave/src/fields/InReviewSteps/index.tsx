import React, { FC } from 'react'
import format from 'date-fns/format'
import { useMutation } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { dateFormat } from '@island.is/shared/constants'
import { FieldBaseProps, DefaultEvents } from '@island.is/application/types'
import { Box, Button, Text, ActionCard } from '@island.is/island-ui/core'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { handleServerError } from '@island.is/application/ui-components'
import { Review } from '../Review/Review'
import { parentalLeaveFormMessages } from '../../lib/messages'
import {
  getApplicationAnswers,
  getExpectedDateOfBirthOrAdoptionDateOrBirthDate,
  isFosterCareAndAdoption,
  showResidenceGrant,
} from '../../lib/parentalLeaveUtils'
import {
  States as ApplicationStates,
  StartDateOptions,
  States,
} from '../../constants'
import { useRemainingRights } from '../../hooks/useRemainingRights'
import { YES } from '@island.is/application/core'

const InReviewSteps: FC<React.PropsWithChildren<FieldBaseProps>> = (props) => {
  const { application, field, refetch, errors } = props
  const { hasAppliedForReidenceGrant, periods } = getApplicationAnswers(
    application.answers,
  )
  const showResidenceGrantCard = showResidenceGrant(application)
  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => handleServerError(e, formatMessage),
    },
  )
  const { formatMessage } = useLocale()

  const dob = getExpectedDateOfBirthOrAdoptionDateOrBirthDate(application)
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

  const lastEndDate = new Date(periods[periods.length - 1].endDate)

  const isUsedAllRights =
    useRemainingRights(application) > 0 ||
    lastEndDate.getTime() > new Date().getTime()

  const handleSubmit = async (event: string) => {
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
  }

  return (
    <Box marginBottom={10}>
      <Box display="flex" justifyContent="spaceBetween">
        <Box marginBottom={2}>
          <Text variant="h2">
            {formatMessage(
              application.state === States.VINNUMALASTOFNUN_APPROVAL
                ? parentalLeaveFormMessages.reviewScreen.titleReceived
                : application.state === States.APPROVED
                ? parentalLeaveFormMessages.reviewScreen.titleApproved
                : parentalLeaveFormMessages.reviewScreen.titleInReview,
            )}
          </Text>
        </Box>
        <Box>
          <Button
            variant="utility"
            icon="print"
            onClick={(e) => {
              e.preventDefault()
              window.print()
            }}
          />
        </Box>
      </Box>
      <Box
        display={['block', 'block', 'block', 'flex']}
        justifyContent="spaceBetween"
      >
        {dobDate && (
          <Text variant="h4" color="blue400">
            {isFosterCareAndAdoption(application)
              ? formatMessage(
                  parentalLeaveFormMessages.reviewScreen.adoptionDate,
                )
              : periods?.[0]?.firstPeriodStart ===
                StartDateOptions.ACTUAL_DATE_OF_BIRTH
              ? formatMessage(parentalLeaveFormMessages.shared.dateOfBirthTitle)
              : formatMessage(
                  parentalLeaveFormMessages.reviewScreen.estimatedBirthDate,
                )}
            <br />
            {format(dobDate, dateFormat.is)}
          </Text>
        )}
        <Box>
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
                onClick={() => handleSubmit(DefaultEvents.EDIT)}
              >
                {formatMessage(
                  parentalLeaveFormMessages.reviewScreen.buttonsEdit,
                )}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      {(application.state === States.APPROVED ||
        application.state === States.VINNUMALASTOFNUN_APPROVE_EDITS ||
        application.state === States.VINNUMALASTOFNUN_APPROVAL) &&
        showResidenceGrantCard &&
        hasAppliedForReidenceGrant !== YES && (
          <Box marginTop={2}>
            <ActionCard
              heading={formatMessage(
                parentalLeaveFormMessages.residenceGrantMessage
                  .residenceGrantTitle,
              )}
              text={formatMessage(
                parentalLeaveFormMessages.residenceGrantMessage
                  .residenceGrantClosedDescription,
              )}
              cta={{
                buttonType: {
                  variant: 'text',
                  colorScheme: 'default',
                },
                label: formatMessage(
                  parentalLeaveFormMessages.residenceGrantMessage
                    .residenceGrantApplyTitle,
                ),
                onClick: () => handleSubmit(DefaultEvents.SUBMIT),
              }}
            />
          </Box>
        )}
      <Box marginTop={7} marginBottom={8}>
        <Review application={application} field={field} errors={errors} />
      </Box>
    </Box>
  )
}

export default InReviewSteps
