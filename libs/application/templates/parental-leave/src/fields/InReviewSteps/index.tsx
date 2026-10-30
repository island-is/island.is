import React, { FC } from 'react'
import addMonths from 'date-fns/addMonths'
import format from 'date-fns/format'
import { useMutation } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { dateFormat } from '@island.is/shared/constants'
import { FieldBaseProps, DefaultEvents } from '@island.is/application/types'
import {
  Box,
  Button,
  Text,
  ActionCard,
  DialogPrompt,
} from '@island.is/island-ui/core'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { handleServerError } from '@island.is/application/ui-components'
import { Review } from '../Review/Review'
import { parentalLeaveFormMessages } from '../../lib/messages'
import {
  getApplicationAnswers,
  getExpectedDateOfBirthOrAdoptionDateOrBirthDate,
  getVmstApplicationId,
  isFosterCareAndAdoption,
  showResidenceGrant,
} from '../../lib/parentalLeaveUtils'
import { getReapprovalAfterEdit } from '../../lib/parentalLeaveTemplateUtils'
import {
  ApplicationAction,
  States as ApplicationStates,
  StartDateOptions,
  States,
} from '../../constants'
import { usageMaxMonths } from '../../config'
import { useStartFollowUpApplication } from '../../hooks/useStartFollowUpApplication'
import { getValueViaPath, YES } from '@island.is/application/core'

const InReviewSteps: FC<React.PropsWithChildren<FieldBaseProps>> = (props) => {
  const { application, field, refetch, errors } = props
  const { hasAppliedForReidenceGrant, periods } = getApplicationAnswers(
    application.answers,
  )
  // A mock application never reached VMST, so there is no leave a residence
  // grant could continue.
  const showResidenceGrantCard =
    showResidenceGrant(application) &&
    getValueViaPath(application.answers, 'mock.useMockData') !== YES
  const { start: startResidenceGrant } = useStartFollowUpApplication(
    ApplicationAction.RESIDENCE_GRANT,
  )
  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => handleServerError(e, formatMessage),
    },
  )
  const { formatMessage } = useLocale()

  const dob = getExpectedDateOfBirthOrAdoptionDateOrBirthDate(application)
  const dobDate = dob ? new Date(dob) : null

  // Periods can't end later than usageMaxMonths after the birth or adoption
  // date, so editing after that can't change anything
  const rightsWindowClosed =
    !!dobDate && new Date() >= addMonths(dobDate, usageMaxMonths)

  // States where EDIT still rewinds *this* application to its own form — i.e. the
  // action it represents is not finished yet. VMST accepts updates to an
  // application it already has via `vmstApplicationId`, so
  // `vinnumalastofnunApproval` and `vinnumalastofnunApproveEdits` are still
  // editable until VMST has approved them. Once VMST has approved (`approved`)
  // the action is done and a change is a new application, started from the
  // select-child screen.
  const canBeEdited =
    application.state === ApplicationStates.OTHER_PARENT_APPROVAL ||
    application.state === ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN ||
    application.state === ApplicationStates.EMPLOYER_APPROVAL ||
    application.state === ApplicationStates.VINNUMALASTOFNUN_APPROVAL ||
    application.state === ApplicationStates.OTHER_PARENT_APPROVAL_FOR_EDITS ||
    application.state ===
      ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS ||
    application.state === ApplicationStates.EMPLOYER_APPROVE_EDITS ||
    application.state === ApplicationStates.VINNUMALASTOFNUN_APPROVE_EDITS

  const reapproval = getReapprovalAfterEdit(application)
  const approvers = [
    reapproval.otherParent &&
      formatMessage(parentalLeaveFormMessages.reviewScreen.approverOtherParent),
    reapproval.employer &&
      formatMessage(parentalLeaveFormMessages.reviewScreen.approverEmployer),
    formatMessage(parentalLeaveFormMessages.reviewScreen.approverVMST),
  ].filter((approver): approver is string => Boolean(approver))
  const approverList =
    approvers.length > 1
      ? `${approvers.slice(0, -1).join(', ')} ${formatMessage(
          parentalLeaveFormMessages.reviewScreen.listAnd,
        )} ${approvers[approvers.length - 1]}`
      : approvers[0]
  const editConfirmTitle = formatMessage(
    reapproval.isEditFlow
      ? parentalLeaveFormMessages.reviewScreen.editConfirmTitleEdits
      : parentalLeaveFormMessages.reviewScreen.editConfirmTitle,
  )
  const editConfirmDescription = reapproval.isEditFlow
    ? formatMessage(
        parentalLeaveFormMessages.reviewScreen.editConfirmDescriptionEdits,
      )
    : formatMessage(
        parentalLeaveFormMessages.reviewScreen.editConfirmDescription,
        {
          approvers: approverList,
          hasOtherApprovers: String(approvers.length > 1),
        },
      )

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
          {canBeEdited && !rightsWindowClosed && (
            <Box display="inlineBlock">
              <DialogPrompt
                baseId="parental-leave-edit-confirm"
                ariaLabel={editConfirmTitle}
                title={editConfirmTitle}
                description={editConfirmDescription}
                buttonTextCancel={formatMessage(
                  parentalLeaveFormMessages.reviewScreen.editConfirmCancel,
                )}
                buttonTextConfirm={formatMessage(
                  parentalLeaveFormMessages.reviewScreen.editConfirmButton,
                )}
                buttonPropsConfirm={{ variant: 'primary' }}
                onConfirm={() => handleSubmit(DefaultEvents.EDIT)}
                disclosureElement={
                  <Button
                    colorScheme="default"
                    iconType="filled"
                    size="small"
                    type="button"
                    variant="text"
                    icon="pencil"
                    loading={loadingSubmit}
                    disabled={loadingSubmit}
                  >
                    {formatMessage(
                      parentalLeaveFormMessages.reviewScreen.buttonsEdit,
                    )}
                  </Button>
                }
              />
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
                // The residence grant is its own action, so it gets its own
                // application for the same VMST leave. Marking this application
                // as applied-for is what hides this card from now on.
                onClick: () =>
                  startResidenceGrant({
                    previousApplicationId: getVmstApplicationId(application),
                    previousAnswersPatch: {
                      applicationId: application.id,
                      answers: { hasAppliedForReidenceGrant: YES },
                    },
                  }),
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
