// Insurance company with button - only visible to buyer
// Buyer and buyers coowener + button for buyer to add more coowners or operators
import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Text, GridRow, GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { overview } from '../../../lib/messages'
import { ReviewGroup } from '../../ReviewGroup'
import { ReviewScreenProps } from '../../../types'
import { getValueViaPath } from '@island.is/application/core'

export const InsuranceSection: FC<FieldBaseProps & ReviewScreenProps> = ({
  setStep,
  insurance = undefined,
  reviewerNationalId,
  application,
}) => {
  const { formatMessage } = useLocale()
  const { answers } = application

  const onButtonClick = () => {
    setStep && setStep('insurance')
  }

  if (!reviewerNationalId) return null

  const isBuyer =
    (getValueViaPath(answers, 'buyer.nationalId', '') as string) ===
    reviewerNationalId

  return (
    <ReviewGroup
      editMessage={
        isBuyer ? formatMessage(overview.labels.addInsuranceButton) : undefined
      }
      isLast
      handleClick={onButtonClick}
    >
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text variant="h4">
            {formatMessage(overview.labels.insuranceTitle)}
          </Text>
          <Text>
            {insurance || formatMessage(overview.labels.noChosenInsurance)}
          </Text>
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
