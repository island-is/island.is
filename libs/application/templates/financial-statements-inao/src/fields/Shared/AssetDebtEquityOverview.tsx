import React, { Fragment } from 'react'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { FinancialStatementsInao } from '../../lib/utils/dataSchema'
import { m } from '../../lib/messages'
import { ValueLine } from './ValueLine'
import { useLocale } from '@island.is/localization'
import { formatCurrency } from '../../lib/utils/helpers'

export const AssetDebtEquityOverview = ({
  answers,
}: {
  answers: FinancialStatementsInao
}) => {
  const { formatMessage } = useLocale()

  return (
    <Fragment>
      <GridRow>
        <GridColumn span={['12/12', '6/12']}>
          <Box paddingTop={3} paddingBottom={2}>
            <Text variant="h4" as="h4">
              {formatMessage(m.properties)}
            </Text>
          </Box>
          <ValueLine
            label={m.fixedAssetsTotal}
            value={formatCurrency(answers.asset?.fixedAssetsTotal)}
          />
          <ValueLine
            label={m.currentAssets}
            value={formatCurrency(answers.asset?.currentAssets)}
          />
          <ValueLine
            label={m.totalAssets}
            value={formatCurrency(answers.asset?.total)}
            isTotal
          />
        </GridColumn>

        <GridColumn span={['12/12', '6/12']}>
          <Box paddingTop={3} paddingBottom={2}>
            <Text variant="h4" as="h4">
              {formatMessage(m.debtsAndEquity)}
            </Text>
          </Box>
          <ValueLine
            label={m.longTerm}
            value={formatCurrency(answers.liability?.longTerm)}
          />
          <ValueLine
            label={m.shortTerm}
            value={formatCurrency(answers.liability?.shortTerm)}
          />
          <ValueLine
            label={m.totalLiabilities}
            value={formatCurrency(answers.liability?.total)}
            isTotal
          />
          <ValueLine
            label={m.equity}
            value={formatCurrency(answers.equity?.totalEquity)}
          />
          <ValueLine
            label={m.debtsAndCash}
            value={formatCurrency(answers.equityAndLiabilities?.total)}
            isTotal
          />
        </GridColumn>
      </GridRow>
    </Fragment>
  )
}
