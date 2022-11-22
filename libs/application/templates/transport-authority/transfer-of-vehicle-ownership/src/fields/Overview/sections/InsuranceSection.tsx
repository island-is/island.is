// Insurance company with button - only visible to buyer
// Buyer and buyers coowener + button for buyer to add more coowners or operators
import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Text, GridRow, GridColumn, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { error, overview } from '../../../lib/messages'
import { ReviewGroup } from '../../ReviewGroup'
import { ReviewScreenProps } from '../../../types'
import { getValueViaPath } from '@island.is/application/core'
import { hasReviewerApproved } from '../../../utils'

interface Props {
  noInsuranceError: boolean
}

export const InsuranceSection: FC<
  FieldBaseProps & ReviewScreenProps & Props
> = ({
  setStep,
  insurance = undefined,
  reviewerNationalId = '',
  application,
  noInsuranceError,
}) => {
  const { formatMessage } = useLocale()
  const { answers } = application

  const onButtonClick = () => {
    setStep && setStep('insurance')
  }

  const isBuyer =
    (getValueViaPath(answers, 'buyer.nationalId', '') as string) ===
    reviewerNationalId

  return (
    <ReviewGroup
      editMessage={
        isBuyer && !hasReviewerApproved(reviewerNationalId, answers)
          ? formatMessage(overview.labels.addInsuranceButton)
          : undefined
      }
      isLast
      handleClick={onButtonClick}
    >
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text variant="h4" color={noInsuranceError ? 'red600' : 'dark400'}>
            {formatMessage(overview.labels.insuranceTitle)}
          </Text>
          <Text color={noInsuranceError ? 'red600' : 'dark400'}>
            {insurance || formatMessage(overview.labels.noChosenInsurance)}
          </Text>
        </GridColumn>
      </GridRow>
      {noInsuranceError && (
        <Box marginTop={2}>
          <Text variant="eyebrow" color="red600">
            {formatMessage(error.noInsuranceSelected)}
          </Text>
        </Box>
      )}
    </ReviewGroup>
  )
}
