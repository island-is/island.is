// Insurance company with button - only visible to buyer
// Buyer and buyers coowener + button for buyer to add more coowners or operators
import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Text, GridRow, GridColumn } from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { overview } from '../../../lib/messages'
import { ReviewGroup } from '../../ReviewGroup'
import { ReviewScreenProps } from '../../../types'

export const InsuranceSection: FC<FieldBaseProps & ReviewScreenProps> = ({
  application,
  setStep,
}) => {
  const { formatMessage } = useLocale()
  const { answers } = application

  const onButtonClick = () => {
    setStep('insurance')
  }

  return (
    <ReviewGroup
      editMessage={formatMessage(overview.labels.addInsuranceButton)}
      isLast
      handleClick={onButtonClick}
    >
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text variant="h4">
            {formatMessage(overview.labels.insuranceTitle)}
          </Text>
          <Text>
            {
              getValueViaPath(
                answers,
                'insurance.name',
                formatMessage(overview.labels.noChosenInsurance),
              ) as string
            }
          </Text>
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
