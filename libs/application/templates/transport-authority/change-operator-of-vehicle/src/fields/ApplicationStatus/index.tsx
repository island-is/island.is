import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Text, Divider } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { review } from '../../lib/messages'
import { ReviewScreenProps } from '../../shared'
import { getReviewSteps, hasReviewerApproved } from '../../utils'
import { StatusStep } from './StatusStep'

export const ApplicationStatus: FC<FieldBaseProps & ReviewScreenProps> = ({
  application,
  setStep,
  reviewerNationalId = '',
}) => {
  const { formatMessage } = useLocale()

  const steps = getReviewSteps(application)

  return (
    <Box marginBottom={10}>
      <Text variant="h1" marginBottom={2}>
        {formatMessage(review.status.title)}
      </Text>
      <Text>{formatMessage(review.status.description)}</Text>
      <Box marginTop={2} display="flex" justifyContent="flexEnd">
        <Button
          colorScheme="default"
          iconType="filled"
          size="small"
          type="button"
          variant="text"
          onClick={() => setStep && setStep('overview')}
        >
          {formatMessage(review.status.viewOverview)}
        </Button>
      </Box>
      <Box marginTop={4} marginBottom={8}>
        {steps.map((step, index) => (
          <StatusStep
            key={index}
            title={step.title}
            description={step.description}
            tagText={step.tagText}
            tagVariant={step.tagVariant}
            visible={step.visible}
            reviewer={step.reviewer}
            reviewerNationalId={reviewerNationalId}
            messageValue={step.messageValue}
          />
        ))}
      </Box>
      {!hasReviewerApproved(reviewerNationalId, application.answers) && (
        <>
          <Divider />
          <Box display="flex" justifyContent="flexEnd" paddingY={5}>
            <Button onClick={() => setStep && setStep('overview')}>
              {formatMessage(review.status.openAgreement)}
            </Button>
          </Box>
        </>
      )}
    </Box>
  )
}
