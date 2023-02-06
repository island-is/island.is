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
  CoOwnersSection,
  OperatorSection,
  InsuranceSection,
} from './sections'
import {
  getApproveAnswers,
  hasReviewerApproved,
  isLastReviewer,
} from '../../utils'
import { RejectConfirmationModal } from './RejectConfirmationModal'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { getValueViaPath } from '@island.is/application/core'
import {
  OwnerChangeAnswers,
  OwnerChangeValidationMessage,
} from '@island.is/api/schema'
import { VALIDATE_VEHICLE_OWNER_CHANGE } from '../../graphql/queries'
import { TransferOfVehicleOwnershipAnswers } from '../..'

export const Overview: FC<FieldBaseProps & ReviewScreenProps> = ({
  setStep,
  reviewerNationalId = '',
  coOwnersAndOperators = [],
  ...props
}) => {
  const { application, refetch, insurance = undefined } = props
  const answers = application.answers as TransferOfVehicleOwnershipAnswers
  const { formatMessage } = useLocale()

  const [rejectModalVisibility, setRejectModalVisibility] = useState<boolean>(
    false,
  )
  const [noInsuranceError, setNoInsuranceError] = useState<boolean>(false)
  const [submitApplication, { error }] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => {
      console.error(e, e.message)
      return
    },
  })

  const isBuyer =
    (getValueViaPath(answers, 'buyer.nationalId', '') as string) ===
    reviewerNationalId

  const [validateVehicle, { data, loading }] = useLazyQuery<
    any,
    { answers: OwnerChangeAnswers }
  >(
    gql`
      ${VALIDATE_VEHICLE_OWNER_CHANGE}
    `,
    {
      onCompleted: async (data) => {
        if (!data?.vehicleOwnerChangeValidation?.hasError) {
          const res = await submitApplication({
            variables: {
              input: {
                id: application.id,
                event: isLastReviewer(
                  reviewerNationalId,
                  application.answers,
                  coOwnersAndOperators,
                )
                  ? DefaultEvents.SUBMIT
                  : DefaultEvents.APPROVE,
                answers: getApproveAnswers(
                  reviewerNationalId,
                  application.answers,
                ),
              },
            },
          })

          if (res?.data) {
            setStep && setStep('conclusion')
          }
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
    if (isBuyer && !insurance) {
      setNoInsuranceError(true)
    } else {
      setNoInsuranceError(false)
      if (isBuyer) {
        validateVehicle({
          variables: {
            answers: {
              pickVehicle: {
                plate: answers?.pickVehicle?.plate,
              },
              vehicle: {
                date: answers?.vehicle?.date,
                salePrice: answers?.vehicle?.salePrice,
              },
              seller: {
                email: answers?.seller?.email,
                nationalId: answers?.seller?.nationalId,
              },
              buyer: {
                email: answers?.buyer?.email,
                nationalId: answers?.buyer?.nationalId,
              },
              buyerCoOwnerAndOperator: answers?.buyerCoOwnerAndOperator?.map(
                (x) => ({
                  email: x.email,
                  nationalId: x.nationalId,
                  type: x.type,
                }),
              ),
              buyerMainOperator: answers?.buyerMainOperator
                ? {
                    nationalId: answers.buyerMainOperator.nationalId,
                  }
                : null,
              insurance: insurance ? { value: insurance } : null,
            },
          },
        })
      } else {
        const res = await submitApplication({
          variables: {
            input: {
              id: application.id,
              event: isLastReviewer(
                reviewerNationalId,
                application.answers,
                coOwnersAndOperators,
              )
                ? DefaultEvents.SUBMIT
                : DefaultEvents.APPROVE,
              answers: getApproveAnswers(
                reviewerNationalId,
                application.answers,
              ),
            },
          },
        })

        if (res?.data) {
          setStep && setStep('conclusion')
        }
      }
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
        <SellerSection {...props} />
        <BuyerSection
          setStep={setStep}
          {...props}
          reviewerNationalId={reviewerNationalId}
        />
        <CoOwnersSection
          coOwnersAndOperators={coOwnersAndOperators}
          {...props}
        />
        <OperatorSection
          coOwnersAndOperators={coOwnersAndOperators}
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
