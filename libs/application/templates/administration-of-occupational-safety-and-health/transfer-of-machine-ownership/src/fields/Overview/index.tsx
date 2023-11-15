import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'
import { FC, useState } from 'react'
import {
  Box,
  Text,
  Divider,
  Button,
  AlertMessage,
  InputError,
} from '@island.is/island-ui/core'
import { ReviewScreenProps } from '../../shared'
import { useLocale } from '@island.is/localization'
import {
  applicationCheck,
  overview,
  review,
  error as errorMsg,
} from '../../lib/messages'
import { States } from '../../lib/constants'
import {
  VehicleSection,
  SellerSection,
  BuyerSection,
  OperatorSection,
  InsuranceSection,
} from './sections'
import {
  getApproveAnswers,
  hasReviewerApproved,
  isLastReviewer,
} from '../../utils'
import { RejectConfirmationModal } from './RejectConfirmationModal'
import {
  APPLICATION_APPLICATION,
  SUBMIT_APPLICATION,
} from '@island.is/application/graphql'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { getValueViaPath } from '@island.is/application/core'
import {
  OwnerChangeValidationMessage,
  //ConfirmOwnerChange,
} from '@island.is/api/schema'
import { APPROVE_OWNER_CHANGE } from '../../graphql/queries'
import {
  AdministrationOfOccupationalSafetyAndHealthAnswers,
  TransferOfMachineOwnerShipAnswers,
} from '../..'

export const Overview: FC<
  React.PropsWithChildren<FieldBaseProps & ReviewScreenProps>
> = ({
  setStep,
  reviewerNationalId = '',
  coOwnersAndOperators = [],
  mainOperator = '',
  ...props
}) => {
  const { application, refetch, location = undefined } = props
  //const answers =
  //application.answers as AdministrationOfOccupationalSafetyAndHealthAnswers
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
      return
    },
  })

  const [loading, setLoading] = useState(false)

  const isBuyer =
    (getValueViaPath(application.answers, 'buyer.nationalId', '') as string) ===
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
          console.log('is Last!!!!!!')
          const answers =
            application.answers as TransferOfMachineOwnerShipAnswers
          changeMachineOwnerMutation({
            variables: {
              input: {
                id: application.id,
                machineId: answers.machine.id,
                machineMoreInfo: answers.location.moreInfo,
                machinePostalCode: answers.location.postCode,
                machineAddress: answers.location.address,
                buyerNationalId: answers.buyer.nationalId,
                delegateNationalId: reviewerNationalId,
              },
            },
          })
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
            setLoading(false)
            setStep && setStep('conclusion')
          }
        } else {
          setLoading(false)
          setStep && setStep('conclusion')
        }
      }
    }
  }

  const [changeMachineOwnerMutation, { data }] = useMutation(
    gql`
      ${APPROVE_OWNER_CHANGE}
    `,
    {
      onCompleted: async (data) => {
        console.log(data)
        if (data && data.confirmOwnerChange) {
          console.log('Change machine owner was successful')
        } else {
          // The operation failed
          console.log('Change machine owner failed')
        }
      },
    },
  )

  const onBackButtonClick = () => {
    setStep && setStep('states')
  }

  const onRejectButtonClick = () => {
    setRejectModalVisibility(true)
  }

  const onApproveButtonClick = async () => {
    setNoInsuranceError(false)
    setLoading(true)

    await doApproveAndSubmit()
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

        {error && (
          <InputError
            errorMessage={errorMsg.submitApplicationError.defaultMessage}
          />
        )}

        {data?.vehicleOwnerChangeValidation?.hasError &&
        data.vehicleOwnerChangeValidation.errorMessages.length > 0 ? (
          <Box>
            <AlertMessage
              type="error"
              title={formatMessage(applicationCheck.validation.alertTitle)}
              message={
                <Box component="span" display="block">
                  <ul>
                    {data.vehicleOwnerChangeValidation.errorMessages.map(
                      (error: OwnerChangeValidationMessage) => {
                        const message = formatMessage(
                          getValueViaPath(
                            applicationCheck.validation,
                            error?.errorNo || '',
                          ),
                        )
                        const defaultMessage = error.defaultMessage
                        const fallbackMessage =
                          formatMessage(
                            applicationCheck.validation.fallbackErrorMessage,
                          ) +
                          ' - ' +
                          error?.errorNo

                        return (
                          <li key={error.errorNo}>
                            <Text variant="small">
                              {message || defaultMessage || fallbackMessage}
                            </Text>
                          </li>
                        )
                      },
                    )}
                  </ul>
                </Box>
              }
            />
          </Box>
        ) : null}

        <Box marginTop={14}>
          <Divider />
          <Box display="flex" justifyContent="spaceBetween" paddingY={5}>
            <Button variant="ghost" onClick={onBackButtonClick}>
              {formatMessage(review.buttons.back)}
            </Button>
            {!hasReviewerApproved(reviewerNationalId, application.answers) &&
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
                      loading={loading}
                      onClick={onApproveButtonClick}
                    >
                      {formatMessage(review.buttons.approve)}
                    </Button>
                  </Box>
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
