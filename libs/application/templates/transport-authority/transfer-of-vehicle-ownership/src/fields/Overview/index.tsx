import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'
import { FC, useState } from 'react'
import {
  Box,
  Text,
  Divider,
  Button,
  InputError,
} from '@island.is/island-ui/core'
import { ReviewScreenProps } from '../../shared'
import { useLocale } from '@island.is/localization'
import { overview, review, error as errorMsg } from '../../lib/messages'
import { States } from '../../lib/constants'
import {
  VehicleSection,
  SellerSection,
  BuyerSection,
  CoOwnersSection,
  OperatorSection,
  InsuranceSection,
} from './sections'
import {
  getApproveAnswers,
  hasEveryReviewerApproved,
  hasReviewerApproved,
  isLastReviewer,
} from '../../utils'
import { RejectConfirmationModal } from './RejectConfirmationModal'
import {
  APPLICATION_APPLICATION,
  SUBMIT_APPLICATION,
} from '@island.is/application/graphql'
import { useLazyQuery, useMutation } from '@apollo/client'
import { getValueViaPath } from '@island.is/application/core'
import { TransferOfVehicleOwnershipAnswers } from '../..'
import { ValidationErrorMessages } from '../ValidationErrorMessages'

export const Overview: FC<
  React.PropsWithChildren<FieldBaseProps & ReviewScreenProps>
> = ({
  setStep,
  reviewerNationalId = '',
  coOwnersAndOperators = [],
  mainOperator = '',
  ...props
}) => {
  const { application, refetch, insurance = undefined } = props
  const answers = application.answers as TransferOfVehicleOwnershipAnswers
  const { formatMessage } = useLocale()

  const [rejectModalVisibility, setRejectModalVisibility] =
    useState<boolean>(false)
  const [noInsuranceError, setNoInsuranceError] = useState<boolean>(false)

  const [getApplicationInfo] = useLazyQuery(APPLICATION_APPLICATION, {
    onError: (e) => {
      console.error(e, e.message)
      return
    },
  })

  const [submitApplication, { error }] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => {
      console.error(e, e.message)
      setButtonLoading(false)
      return
    },
  })

  const [buttonLoading, setButtonLoading] = useState(false)
  const [shouldLoadValidation, setShouldLoadValidation] = useState(false)
  const [validationErrorFound, setValidationErrorFound] = useState(false)

  const isBuyer =
    (getValueViaPath(answers, 'buyer.nationalId', '') as string) ===
    reviewerNationalId

  const doApproveAndSubmit = async () => {
    // Need to get updated application answers, in case buyer has changed co-owner
    // or any other reviewer has approved
    const applicationInfo = await getApplicationInfo({
      variables: {
        input: {
          id: application.id,
        },
        locale: 'is',
      },
      fetchPolicy: 'no-cache',
    })
    const updatedApplication = applicationInfo?.data?.applicationApplication

    if (updatedApplication) {
      const currentAnswers = updatedApplication.answers

      const approveAnswers = getApproveAnswers(
        reviewerNationalId,
        currentAnswers,
      )

      // First approve application only (event=APPROVE)
      const resApprove = await submitApplication({
        variables: {
          input: {
            id: application.id,
            event: DefaultEvents.APPROVE,
            answers: approveAnswers,
          },
        },
      })

      const updatedApplication2 = resApprove?.data?.submitApplication

      if (updatedApplication2) {
        const isLast = isLastReviewer(
          reviewerNationalId,
          updatedApplication2.answers,
          coOwnersAndOperators,
        )

        // Then check if user is the last approver (using newer updated application answers), if so we
        // need to submit the application (event=SUBMIT) to change the state to COMPLETED
        if (isLast) {
          const approveAnswers2 = getApproveAnswers(
            reviewerNationalId,
            updatedApplication2.answers,
          )

          const resSubmit = await submitApplication({
            variables: {
              input: {
                id: application.id,
                event: DefaultEvents.SUBMIT,
                answers: approveAnswers2,
              },
            },
          })

          if (resSubmit?.data) {
            setButtonLoading(false)
            setStep && setStep('conclusion')
          }
        } else {
          setButtonLoading(false)
          setStep && setStep('conclusion')
        }
      }
    }
  }

  const onBackButtonClick = () => {
    setStep && setStep('states')
  }

  const onRejectButtonClick = () => {
    setRejectModalVisibility(true)
  }

  const onApproveButtonClick = async () => {
    if (isBuyer && !insurance) {
      setNoInsuranceError(true)
    } else {
      setNoInsuranceError(false)

      setButtonLoading(true)
      setShouldLoadValidation(true)
      await doApproveAndSubmit()
    }
  }

  return (
    <>
      <Box>
        <Text variant="h1" marginBottom={2}>
          {formatMessage(overview.general.title)}
        </Text>
        <Text marginBottom={4}>
          {formatMessage(overview.general.description)}
        </Text>
        <VehicleSection {...props} reviewerNationalId={reviewerNationalId} />
        <SellerSection {...props} reviewerNationalId={reviewerNationalId} />
        <BuyerSection
          setStep={setStep}
          {...props}
          reviewerNationalId={reviewerNationalId}
        />
        <CoOwnersSection
          reviewerNationalId={reviewerNationalId}
          coOwnersAndOperators={coOwnersAndOperators}
          {...props}
        />
        <OperatorSection
          reviewerNationalId={reviewerNationalId}
          coOwnersAndOperators={coOwnersAndOperators}
          mainOperator={mainOperator}
          {...props}
        />
        <InsuranceSection
          setStep={setStep}
          {...props}
          reviewerNationalId={reviewerNationalId}
          noInsuranceError={noInsuranceError}
        />

        {!buttonLoading && shouldLoadValidation && (
          <ValidationErrorMessages
            {...props}
            showErrorOnly={true}
            setValidationErrorFound={setValidationErrorFound}
          />
        )}

        {!validationErrorFound && error && (
          <InputError
            errorMessage={errorMsg.submitApplicationError.defaultMessage}
          />
        )}

        <Box marginTop={14}>
          <Divider />
          <Box display="flex" justifyContent="spaceBetween" paddingY={5}>
            <Button variant="ghost" onClick={onBackButtonClick}>
              {formatMessage(review.buttons.back)}
            </Button>
            {!hasReviewerApproved(application.answers, reviewerNationalId) &&
              application.state !== States.COMPLETED && (
                <Box display="flex" justifyContent="flexEnd" flexWrap="wrap">
                  <Box marginLeft={3}>
                    <Button
                      icon="close"
                      colorScheme="destructive"
                      onClick={onRejectButtonClick}
                    >
                      {formatMessage(review.buttons.reject)}
                    </Button>
                  </Box>
                  <Box marginLeft={3}>
                    <Button
                      icon="checkmark"
                      loading={buttonLoading}
                      onClick={onApproveButtonClick}
                    >
                      {formatMessage(review.buttons.approve)}
                    </Button>
                  </Box>
                </Box>
              )}
            {/**
             * Note: If every reviewer has approved and application in not yet in COMPLETED state
             * we allow reviewer to "re-approve" to push the application to the next state.
             */}
            {hasEveryReviewerApproved(application.answers) &&
              application.state !== States.COMPLETED && (
                <Box display="flex" justifyContent="flexEnd" flexWrap="wrap">
                  <Button
                    icon="reload"
                    loading={buttonLoading}
                    onClick={onApproveButtonClick}
                  >
                    {formatMessage(review.buttons.tryAgain)}
                  </Button>
                </Box>
              )}
          </Box>
        </Box>
      </Box>
      <RejectConfirmationModal
        visibility={rejectModalVisibility}
        setVisibility={setRejectModalVisibility}
        application={application}
        refetch={refetch}
        reviewerNationalId={reviewerNationalId}
      />
    </>
  )
}
