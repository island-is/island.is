import { RadioValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { survivorsBenefitsFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { getApplicationAnswers } from '../../../lib/survivorsBenefitsUtils'

export const ExpectingChild = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { isExpectingChild } = getApplicationAnswers(application.answers)
  const { formatMessage } = useLocale()

  return (
    <ReviewGroup
      isLast
      isEditable={editable}
      editAction={() => goToScreen?.('onePaymentPerYear')}
    >
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <RadioValue
            label={formatMessage(
              survivorsBenefitsFormMessage.info.expectingChildTitle,
            )}
            value={isExpectingChild}
          />
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
