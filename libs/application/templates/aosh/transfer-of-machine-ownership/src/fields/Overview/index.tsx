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
  OperatorSection,
  LocationSection,
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
import { APPROVE_OWNER_CHANGE } from '../../graphql/queries'
import { TransferOfMachineOwnerShipAnswers } from '../..'

export const Overview: FC<
  React.PropsWithChildren<FieldBaseProps & ReviewScreenProps>
> = ({ setStep, reviewerNationalId = '', buyerOperators = [], ...props }) => {
  const { application, refetch } = props
  const { formatMessage } = useLocale()

  const [rejectModalVisibility, setRejectModalVisibility] =
    useState<boolean>(false)

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

  const doApproveAndSubmit = async () => {
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
          buyerOperators,
        )
        // Then check if user is the last approver (using newer updated application answers), if so we
        // need to submit the application (event=SUBMIT) to change the state to COMPLETED
        if (isLast) {
          const approveAnswers2 = getApproveAnswers(
            reviewerNationalId,
            updatedApplication2.answers,
          )
          console.log('updatedApplication2', updatedApplication2)
          const answers =
            updatedApplication2.answers as TransferOfMachineOwnerShipAnswers
          console.log('answers', answers)
          console.log('approveAnswers', approveAnswers)
          console.log('input', {
            id: application.id,
            machineId: answers.machine?.id,
            machineMoreInfo: answers.location?.moreInfo,
            machinePostalCode: answers.location?.postCode,
            machineAddress: answers.location?.address,
            buyerNationalId: answers.buyer.nationalId,
            delegateNationalId: reviewerNationalId,
          })
          await changeMachineOwnerMutation({
            variables: {
              input: {
                id: application.id,
                machineId: answers.machine?.id,
                machineMoreInfo: answers.location?.moreInfo,
                machinePostalCode: answers.location?.postCode,
                machineAddress: answers.location?.address,
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
          buyerOperators={buyerOperators}
          {...props}
        />

        <LocationSection
          setStep={setStep}
          {...props}
          reviewerNationalId={reviewerNationalId}
        />

        {error && (
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
