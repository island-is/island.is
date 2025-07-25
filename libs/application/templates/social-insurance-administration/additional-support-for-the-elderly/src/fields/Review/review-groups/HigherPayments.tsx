import { RadioValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { additionalSupportForTheElderyFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { getApplicationAnswers } from '../../../lib/additionalSupportForTheElderlyUtils'

export const HigherPayments = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { higherPayments } = getApplicationAnswers(application.answers)
  const { formatMessage } = useLocale()

  return (
    <ReviewGroup
      isLast
      isEditable={editable}
      editAction={() => goToScreen?.('higherPayments')}
    >
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <RadioValue
            label={formatMessage(
              additionalSupportForTheElderyFormMessage.info.higherPaymentsTitle,
            )}
            value={higherPayments}
          />
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
