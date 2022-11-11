import { FieldBaseProps } from '@island.is/application/types'
import { FC, useState } from 'react'
import { Box, Text, Divider, Button } from '@island.is/island-ui/core'
import { ReviewScreenProps } from '../../types'
import { useLocale } from '@island.is/localization'
import { overview, review } from '../../lib/messages'
import {
  VehicleSection,
  SellerSection,
  BuyerSection,
  CoOwnersSection,
  OperatorSection,
  InsuranceSection,
} from './sections'
import { useAuth } from '@island.is/auth/react'

export const Overview: FC<FieldBaseProps & ReviewScreenProps> = ({
  setStep,
  ...props
}) => {
  const { application } = props
  const [shouldReview, setShouldReview] = useState<boolean>(true)
  console.log(application)
  const { formatMessage } = useLocale()
  const { answers } = application
  const { userInfo } = useAuth()
  const reviewerNationalId = userInfo?.profile.nationalId || null
  if (!reviewerNationalId) return null

  const onBackButtonClick = () => {
    setStep && setStep('states')
  }
  const onRejectButtonClick = () => {
    setStep && setStep('states')
  }
  const onApproveButtonClick = () => {
    setStep && setStep('conclusion')
  }
  return (
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
      <CoOwnersSection {...props} />
      <OperatorSection {...props} />
      <InsuranceSection
        setStep={setStep}
        {...props}
        reviewerNationalId={reviewerNationalId}
      />
      <Box marginTop={14}>
        <Divider />
        <Box display="flex" justifyContent="spaceBetween" paddingY={5}>
          <Button variant="ghost" onClick={onBackButtonClick}>
            {formatMessage(review.buttons.back)}
          </Button>
          {shouldReview && (
            <Box display="flex" justifyContent="spaceBetween">
              <Button
                icon="close"
                colorScheme="destructive"
                onClick={onRejectButtonClick}
              >
                {formatMessage(review.buttons.reject)}
              </Button>
              <Box marginLeft={3}>
                <Button icon="checkmark" onClick={onApproveButtonClick}>
                  {formatMessage(review.buttons.approve)}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
