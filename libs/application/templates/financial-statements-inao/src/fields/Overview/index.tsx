import React, { Fragment } from 'react'
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
import { FinancialStatementsInao } from '../../lib/utils/dataSchema'
import { format as formatNationalId } from 'kennitala'
import { m } from '../../lib/messages'
import { FileValueLine, ValueLine } from '../Shared'
import { formatCurrency } from '../../lib/utils/helpers'
import { starterColumnStyle } from '../Shared/styles/overviewStyles.css'

export const Overview = ({ application }: FieldBaseProps) => {
  const { formatMessage } = useLocale()

  const answers = application.answers as FinancialStatementsInao
  const fileName = answers.attachment?.file?.[0]?.name

  return (
    <Box marginBottom={2}>
      <Divider />
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
      <Divider />
      <Box paddingTop={4} paddingBottom={2}>
        <Text variant="h3" as="h3">
          {formatMessage(m.keyNumbersIncomeAndExpenses)}
        </Text>
      </Box>
      <GridRow>
        <GridColumn span={['12/12', '6/12']}>
          <ValueLine
            label={m.personalDonations}
            value={formatCurrency(answers.individualIncome?.personalDonations)}
          />
          <ValueLine
            label={m.corporateDonation}
            value={formatCurrency(answers.individualIncome?.corporateDonations)}
          />
          <ValueLine
            label={m.individualDonations}
            value={formatCurrency(
              answers.individualIncome?.individualDonations,
            )}
          />
          <ValueLine
            label={m.otherIncome}
            value={formatCurrency(answers.individualIncome?.otherIncome)}
          />
          <ValueLine
            label={m.totalIncome}
            value={formatCurrency(answers.individualIncome?.total)}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12']}>
          <ValueLine
            label={m.advertisements}
            value={formatCurrency(answers.individualExpense?.advertisements)}
          />
          <ValueLine
            label={m.expenses}
            value={formatCurrency(answers.individualExpense?.electionOffice)}
          />
          <ValueLine
            label={m.travelCost}
            value={formatCurrency(answers.individualExpense?.travelCost)}
          />
          <ValueLine
            label={m.otherCost}
            value={formatCurrency(answers.individualExpense?.otherCost)}
          />
          <ValueLine
            label={m.totalExpenses}
            value={formatCurrency(answers.individualExpense?.total)}
          />
        </GridColumn>
      </GridRow>
      <Divider />
      <Box className={starterColumnStyle}>
        <Text variant="h3" as="h3">
          {formatMessage(m.capitalCost)}
        </Text>
      </Box>
      <GridRow>
        <GridColumn span={['12/12', '6/12']}>
          <ValueLine
            label={m.capitalIncome}
            value={answers.capitalNumbers.capitalIncome}
          />
        </GridColumn>
        {answers.capitalNumbers?.capitalCost ? (
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.capitalCost}
              value={formatPhoneNumber(answers.capitalNumbers.capitalCost)}
            />
          </GridColumn>
        ) : null}
      </GridRow>
      <GridRow>
        <GridColumn>
          <ValueLine
            label={m.totalCapital}
            value={formatCurrency(answers.capitalNumbers?.total)}
          />
        </GridColumn>
      </GridRow>
      <Divider />
      <Box paddingTop={4} paddingBottom={2}>
        <Text variant="h3" as="h3">
          {formatMessage(m.keyNumbersDebt)}
        </Text>
      </Box>
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
      <GridRow>
        <GridColumn span={['12/12', '6/12']}>
          <ValueLine
            label={m.totalAssets}
            value={formatCurrency(answers.asset?.total)}
          />
        </GridColumn>
      </GridRow>
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
      <GridRow>
        <GridColumn span={['12/12', '6/12']}>
          <ValueLine
            label={m.totalLiabilities}
            value={formatCurrency(answers.liability?.total)}
          />
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span={['12/12', '6/12']}>
          <ValueLine
            label={m.equity}
            value={formatCurrency(answers.equity?.totalEquity)}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12']}>
          <ValueLine
            label={m.debtsAndCash}
            value={formatCurrency(answers.equity?.total)}
          />
        </GridColumn>
      </GridRow>
      {fileName ? (
        <Fragment>
          <FileValueLine label={answers.attachment?.file?.[0]?.name} />
          <Divider />
        </Fragment>
      ) : null}
      <Divider />
    </Box>
  )
}
