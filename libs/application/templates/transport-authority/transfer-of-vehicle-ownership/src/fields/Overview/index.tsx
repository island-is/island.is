import { FieldBaseProps } from '@island.is/application/types'
import { FC, useState } from 'react'
import { Box, Text, Divider, Button } from '@island.is/island-ui/core'
import { ReviewScreenProps } from '../../types'
import { useLocale } from '@island.is/localization'
import { overview, review } from '../../lib/messages'
import { VehicleSection, SellerSection, BuyerSection } from './sections'

export const Overview: FC<FieldBaseProps & ReviewScreenProps> = ({
  setStep,
  ...props
}) => {
  const { application } = props
  const [shouldReview, setShouldReview] = useState<boolean>(true)
  console.log(application)
  const { formatMessage } = useLocale()
  const { answers } = application

  const onBackButtonClick = () => {
    setStep('states')
  }
  const onRejectButtonClick = () => {
    setStep('states')
  }
  const onApproveButtonClick = () => {
    setStep('conclusion')
  }
  return (
    <Box>
      <Text variant="h1" marginBottom={2}>
        {formatMessage(overview.general.title)}
      </Text>
      <Text marginBottom={4}>
        {formatMessage(overview.general.description)}
      </Text>
      <VehicleSection {...props} />
      <SellerSection {...props} />
      <BuyerSection setStep={setStep} {...props} />
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
