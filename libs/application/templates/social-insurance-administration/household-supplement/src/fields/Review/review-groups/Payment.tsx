import {
  DataValue,
  ReviewGroup,
  formatBankInfo,
} from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { householdSupplementFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { getApplicationAnswers } from '../../../lib/householdSupplementUtils'

export const Payment = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { bank } = getApplicationAnswers(application.answers)

  const { formatMessage } = useLocale()

  return (
    <ReviewGroup
      isLast
      isEditable={editable}
      editAction={() => goToScreen?.('paymentInfo')}
    >
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <DataValue
            label={formatMessage(
              householdSupplementFormMessage.info.paymentBank,
            )}
            value={formatBankInfo(bank)}
          />
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
