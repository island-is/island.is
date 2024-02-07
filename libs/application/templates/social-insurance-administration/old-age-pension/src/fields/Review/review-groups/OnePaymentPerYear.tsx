import { RadioValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { getApplicationAnswers } from '../../../lib/oldAgePensionUtils'

export const OnePaymentPerYear = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { onePaymentPerYear } = getApplicationAnswers(application.answers)
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
              oldAgePensionFormMessage.onePaymentPerYear.onePaymentPerYearTitle,
            )}
            value={onePaymentPerYear}
          />
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
