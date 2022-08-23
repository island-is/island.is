import React from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  Divider,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { FinancialStatementsInao } from '../../lib/utils/dataSchema'
import { format as formatNationalId } from 'kennitala'
import { m } from '../../lib/messages'
import { ValueLine } from '../Shared'
import { formatCurrency } from '../../lib/utils/helpers'

export const Overview = ({ application }: FieldBaseProps) => {
  const { formatMessage } = useLocale()

  const answers = application.answers as FinancialStatementsInao
  return (
    <Box marginBottom={2}>
      <Divider />
      <Box paddingTop={4} paddingBottom={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.nationalId}
              value={
                answers.about?.nationalId
                  ? formatNationalId(answers.about.nationalId)
                  : '-'
              }
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine label={m.fullName} value={answers.about.fullName} />
          </GridColumn>
        </GridRow>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.powerOfAttorneyName}
              value={answers.about.powerOfAttorneyName}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.powerOfAttorneyNationalId}
              value={formatNationalId(answers.about.powerOfAttorneyNationalId)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine label={m.email} value={answers.about.email} />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.phoneNumber}
              value={formatPhoneNumber(answers.about.phoneNumber)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Divider />
      <Box paddingTop={4} paddingBottom={2}>
        <Text variant="h3" as="h3">
          {formatMessage(m.keyNumbersIncomeAndExpenses)}
        </Text>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.capitalIncome}
              value={formatCurrency(answers.individualIncome?.capitalIncome)}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.corporateDonation}
              value={formatCurrency(
                answers.individualIncome?.corporateDonations,
              )}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.individualDonations}
              value={formatCurrency(
                answers.individualIncome?.individualDonations,
              )}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.otherIncome}
              value={formatCurrency(answers.individualIncome?.otherIncome)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.personalDonations}
              value={formatCurrency(
                answers.individualIncome?.personalDonations,
              )}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.expenses}
              value={formatCurrency(answers.individualExpense?.electionOffice)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.travelCost}
              value={formatCurrency(answers.individualExpense?.travelCost)}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.advertisements}
              value={formatCurrency(answers.individualExpense?.advertisements)}
            />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.capitalCost}
              value={formatCurrency(answers.individualExpense?.capitalCost)}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.otherCost}
              value={formatCurrency(answers.individualExpense?.otherCost)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Divider />
      <Box paddingTop={4} paddingBottom={2}>
        <Text variant="h3" as="h3">
          {formatMessage(m.keyNumbersDebt)}
        </Text>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.currentAssets}
              value={formatCurrency(answers.asset?.current)}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.tangibleAssets}
              value={formatCurrency(answers.asset?.tangible)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.shortTerm}
              value={formatCurrency(answers.liability?.shortTerm)}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.longTerm}
              value={formatCurrency(answers.liability?.longTerm)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.equity}
              value={formatCurrency(answers.equity?.totalEquity)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Divider />
    </Box>
  )
}
