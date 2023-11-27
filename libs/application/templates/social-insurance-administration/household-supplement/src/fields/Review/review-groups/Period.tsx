import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { householdSupplementFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { useStatefulAnswers } from '../../../hooks/useStatefulAnswers'
import { MONTHS } from '../../../lib/constants'

export const Period = ({
  application,
  editable,
  goToScreen,
  hasError,
}: ReviewGroupProps) => {
  const [{ selectedYear, selectedMonth }] = useStatefulAnswers(application)
  const month = MONTHS.find((x) => x.value === selectedMonth)
  const { formatMessage } = useLocale()

  return (
    <ReviewGroup
      isLast
      isEditable={editable}
      editAction={() => goToScreen?.('periodField')}
    >
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <DataValue
            label={formatMessage(
              householdSupplementFormMessage.info.periodTitle,
            )}
            value={`${month && formatMessage(month.label)} ${selectedYear}`}
            error={hasError('period')}
          />
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
