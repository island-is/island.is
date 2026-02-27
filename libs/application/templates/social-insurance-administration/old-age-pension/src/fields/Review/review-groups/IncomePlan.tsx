import { useLocale } from '@island.is/localization'
import { ReviewGroupProps } from './props'
import { getApplicationAnswers } from '../../../lib/oldAgePensionUtils'
import {
  formatCurrencyWithoutSuffix,
  RadioValue,
} from '@island.is/application/ui-components'
import { Label, ReviewGroup } from '@island.is/application/ui-components'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { StaticTableFormField } from '@island.is/application/ui-fields'
import { FieldComponents, FieldTypes } from '@island.is/application/types'

export const IncomePlan = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const { incomePlan, noOtherIncomeConfirmation } = getApplicationAnswers(
    application.answers,
  )

  return (
    <ReviewGroup
      isLast
      isEditable={editable}
      editAction={() => goToScreen && goToScreen('incomePlanTable')}
    >
      <GridRow>
        <GridColumn span="12/12" paddingBottom={3}>
          <Label>
            {formatMessage(
              socialInsuranceAdministrationMessage.incomePlan.subSectionTitle,
            )}
          </Label>
          <Box paddingTop={3}>
            <StaticTableFormField
              application={application}
              field={{
                type: FieldTypes.STATIC_TABLE,
                component: FieldComponents.STATIC_TABLE,
                children: undefined,
                id: 'incomePlan',
                header: [
                  socialInsuranceAdministrationMessage.incomePlan.incomeType,
                  socialInsuranceAdministrationMessage.incomePlan.incomePerYear,
                  socialInsuranceAdministrationMessage.incomePlan.currency,
                ],
                rows: incomePlan.map((e) => [
                  e.incomeType,
                  formatCurrencyWithoutSuffix(e.incomePerYear),
                  e.currency,
                ]),
              }}
            />
          </Box>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <RadioValue
            label={formatMessage(
              socialInsuranceAdministrationMessage.incomePlan
                .noOtherIncomeConfirmation,
            )}
            value={noOtherIncomeConfirmation}
          />
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
