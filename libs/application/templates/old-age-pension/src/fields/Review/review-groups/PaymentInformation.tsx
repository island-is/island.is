import {
  DataValue,
  RadioValue,
  ReviewGroup,
} from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { getApplicationExternalData } from '../../../lib/oldAgePensionUtils'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { useStatefulAnswers } from '../../../hooks/useStatefulAnswers'
import { getTaxLevelOption } from './utils'

export const PaymentInformation = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const [{ taxLevel, personalDiscount, spouseDiscount }] = useStatefulAnswers(
    application,
  )

  const { bank } = getApplicationExternalData(application.externalData)

  const { formatMessage } = useLocale()

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('paymentInfo')}
    >
      <GridRow marginBottom={3}>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <DataValue
            label={formatMessage(oldAgePensionFormMessage.review.bank)}
            value={bank}
          />
        </GridColumn>
      </GridRow>

      <GridRow marginBottom={3}>
        <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
          <RadioValue
            label={formatMessage(
              oldAgePensionFormMessage.review.personalDiscount,
            )}
            value={personalDiscount}
          />
        </GridColumn>
      </GridRow>

      <GridRow marginBottom={3}>
        <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
          <RadioValue
            label={formatMessage(
              oldAgePensionFormMessage.review.spouseDiscount,
            )}
            value={spouseDiscount}
          />
        </GridColumn>
      </GridRow>

      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
          <DataValue
            label={formatMessage(oldAgePensionFormMessage.review.taxLevel)}
            value={formatMessage(getTaxLevelOption(taxLevel))}
          />
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
