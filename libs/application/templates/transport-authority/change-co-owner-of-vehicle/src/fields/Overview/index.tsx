import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'
import { FC, useState } from 'react'
import { Box, Text, Divider, Button } from '@island.is/island-ui/core'
import { ReviewScreenProps } from '../../shared'
import { useLocale } from '@island.is/localization'
import { overview, review } from '../../lib/messages'
import { VehicleSection, OwnerSection, CoOwnersSection } from './sections'
import {
  getApproveAnswers,
  hasReviewerApproved,
  isLastReviewer,
} from '../../utils'
import { RejectConfirmationModal } from './RejectConfirmationModal'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { useMutation } from '@apollo/client'

export const Overview: FC<FieldBaseProps & ReviewScreenProps> = ({
  setStep,
  reviewerNationalId = '',
  ...props
}) => {
  const { application, refetch } = props
  const { formatMessage } = useLocale()

  const [rejectModalVisibility, setRejectModalVisibility] = useState<boolean>(
    false,
  )
  const [submitApplication] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => {
      console.error(e, e.message)
      return
    },
  })
  const [loading, setLoading] = useState<boolean>(false)
  const onBackButtonClick = () => {
    setStep && setStep('states')
  }
  const onRejectButtonClick = () => {
    setRejectModalVisibility(true)
  }
  const onApproveButtonClick = async () => {
    setLoading(true)
    const res = await submitApplication({
      variables: {
        input: {
          id: application.id,
          event: isLastReviewer(reviewerNationalId, application.answers)
            ? DefaultEvents.SUBMIT
            : DefaultEvents.APPROVE,
          answers: getApproveAnswers(reviewerNationalId, application.answers),
        },
      },
    })
    setLoading(false)
    if (res?.data) {
      setStep && setStep('conclusion')
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
        <VehicleSection {...props} />
        <OwnerSection {...props} />
        <CoOwnersSection {...props} />
        <Box marginTop={14}>
          <Divider />
          <Box display="flex" justifyContent="spaceBetween" paddingY={5}>
            <Button variant="ghost" onClick={onBackButtonClick}>
              {formatMessage(review.buttons.back)}
            </Button>
            {!hasReviewerApproved(reviewerNationalId, application.answers) && (
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
                    onClick={onApproveButtonClick}
                    loading={loading}
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
