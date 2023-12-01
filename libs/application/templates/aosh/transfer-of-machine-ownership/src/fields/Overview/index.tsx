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
import { getApproveAnswers, hasReviewerApproved } from '../../utils'
import { RejectConfirmationModal } from './RejectConfirmationModal'
import {
  APPLICATION_APPLICATION,
  SUBMIT_APPLICATION,
} from '@island.is/application/graphql'
import { useLazyQuery, useMutation } from '@apollo/client'

export const Overview: FC<
  React.PropsWithChildren<FieldBaseProps & ReviewScreenProps>
> = ({
  setStep,
  reviewerNationalId = '',
  buyerOperator: buyerOperators = {},
  ...props
}) => {
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
      await submitApplication({
        variables: {
          input: {
            id: application.id,
            event: DefaultEvents.APPROVE,
            answers: approveAnswers,
          },
        },
      })
      setLoading(false)
      setStep && setStep('conclusion')
    }
  }

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
          buyerOperator={buyerOperators}
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
