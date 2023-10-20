import {
  DataValue,
  RadioValue,
  ReviewGroup,
  formatBankInfo,
} from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getApplicationExternalData } from '../../../lib/oldAgePensionUtils'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { useStatefulAnswers } from '../../../hooks/useStatefulAnswers'
import { YES } from '../../../lib/constants'

export const PaymentInformation = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const [
    {
      personalAllowance,
      spouseAllowance,
      personalAllowanceUsage,
      spouseAllowanceUsage,
      bank,
    },
  ] = useStatefulAnswers(application)

  const { hasSpouse } = getApplicationExternalData(application.externalData)

  const { formatMessage } = useLocale()

  return (
    <ReviewGroup
      isLast
      isEditable={editable}
      editAction={() => goToScreen?.('paymentInfo')}
    >
      <GridRow marginBottom={3}>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <DataValue
            label={formatMessage(oldAgePensionFormMessage.review.bank)}
            value={formatBankInfo(bank)}
          />
        </GridColumn>
      </GridRow>

      <GridRow marginBottom={3}>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <RadioValue
            label={formatMessage(
              oldAgePensionFormMessage.review.personalAllowance,
            )}
            value={personalAllowance}
          />
        </GridColumn>

        {personalAllowance === YES && (
          <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
            <DataValue
              label={formatMessage(oldAgePensionFormMessage.review.ratio)}
              value={`${personalAllowanceUsage}%`}
            />
          </GridColumn>
        )}
      </GridRow>

      {hasSpouse && (
        <GridRow marginBottom={3}>
          <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
            <RadioValue
              label={formatMessage(
                oldAgePensionFormMessage.review.spouseAllowance,
              )}
              value={spouseAllowance}
            />
          </GridColumn>

          {spouseAllowance === YES && (
            <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
              <DataValue
                label={formatMessage(oldAgePensionFormMessage.review.ratio)}
                value={`${spouseAllowanceUsage}%`}
              />
            </GridColumn>
          )}
        </GridRow>
      )}
    </ReviewGroup>
  )
}
