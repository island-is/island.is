import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { FieldComponents, FieldTypes } from '@island.is/application/types'
import {
  Label,
  ReviewGroup,
  formatCurrencyWithoutSuffix,
} from '@island.is/application/ui-components'
import { StaticTableFormField } from '@island.is/application/ui-fields'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useMemo } from 'react'
import { getApplicationAnswers } from '../../../lib/medicalAndRehabilitationPaymentsUtils'
import { ReviewGroupProps } from './props'

export const IncomePlan = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const { incomePlan } = getApplicationAnswers(application.answers)

  const rows = useMemo(
    () =>
      incomePlan.map((e) => [
        e.incomeType,
        formatCurrencyWithoutSuffix(e.incomePerYear),
        e.currency,
      ]),
    [incomePlan],
  )

  return (
    <ReviewGroup
      isLast
      isEditable={editable}
      editAction={() => goToScreen?.('incomePlanTable')}
    >
      <GridRow>
        <GridColumn span="12/12">
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
                rows,
              }}
            />
          </Box>
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
