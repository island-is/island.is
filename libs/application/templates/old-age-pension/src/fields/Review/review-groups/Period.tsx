import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { useStatefulAnswers } from '../../../hooks/useStatefulAnswers'

export const Period = ({
  application,
  editable,
  goToScreen,
  hasError,
}: ReviewGroupProps) => {
  const [{ selectedYear, selectedMonth }] = useStatefulAnswers(application)

  const { formatMessage } = useLocale()

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('periodField')}
    >
      <GridRow marginBottom={3}>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <DataValue
            label={formatMessage(oldAgePensionFormMessage.review.period)}
            value={`${selectedMonth} ${selectedYear}`}
            error={hasError('period')}
          />
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
