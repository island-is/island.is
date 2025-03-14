import {
  DataValue,
  RadioValue,
  ReviewGroup,
  formatBankInfo,
} from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { ReviewGroupProps } from './props'
import { getApplicationAnswers } from '../../../lib/additionalSupportForTheElderlyUtils'
import { getTaxLevelOption } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { YES } from '@island.is/application/core'

export const Payment = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { bank, personalAllowance, personalAllowanceUsage, taxLevel } =
    getApplicationAnswers(application.answers)

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
            label={formatMessage(
              socialInsuranceAdministrationMessage.payment.bank,
            )}
            value={formatBankInfo(bank)}
          />
        </GridColumn>
      </GridRow>

      <GridRow>
        <GridColumn
          span={['12/12', '12/12', '12/12', '5/12']}
          paddingBottom={3}
        >
          <RadioValue
            label={formatMessage(
              socialInsuranceAdministrationMessage.confirm.personalAllowance,
            )}
            value={personalAllowance}
          />
        </GridColumn>

        {personalAllowance === YES && (
          <GridColumn
            span={['12/12', '12/12', '12/12', '5/12']}
            paddingBottom={3}
          >
            <DataValue
              label={formatMessage(
                socialInsuranceAdministrationMessage.confirm.ratio,
              )}
              value={`${personalAllowanceUsage}%`}
            />
          </GridColumn>
        )}
      </GridRow>

      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
          <DataValue
            label={formatMessage(
              socialInsuranceAdministrationMessage.payment.taxLevel,
            )}
            value={formatMessage(getTaxLevelOption(taxLevel))}
          />
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
