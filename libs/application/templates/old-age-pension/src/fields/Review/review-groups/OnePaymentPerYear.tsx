import {
  DataValue,
  RadioValue,
  ReviewGroup,
} from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { useStatefulAnswers } from '../../../hooks/useStatefulAnswers'

export const OnePaymentPerYear = ({
  application,
  editable,
  goToScreen,
  hasError,
}: ReviewGroupProps) => {
  const [{ onePaymentPerYear }] = useStatefulAnswers(application)

  const { formatMessage } = useLocale()

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('onePaymentPerYear')}
    >
      <GridRow marginBottom={3}>
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
