import React from 'react'
import {
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { Income } from './income'
import { Expenses } from './expenses'
import { Total } from '../KeyNumbers'
import { INDIVIDUALOPERATIONIDS, OPERATINGCOST } from '../../lib/constants'
import { useTotals } from '../../hooks'

export const IndividualElectionOperatingIncome = (): JSX.Element => {
  const { formatMessage } = useLocale()
  const [getTotalIncome, totalIncome] = useTotals(
    INDIVIDUALOPERATIONIDS.incomePrefix,
  )
  const [getTotalExpense, totalExpense] = useTotals(
    INDIVIDUALOPERATIONIDS.expensePrefix,
  )

  return (
    <GridContainer>
      <GridRow align="spaceBetween">
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text paddingY={1} as="h2" variant="h4">
            {formatMessage(m.income)}
          </Text>
          <Income getSum={getTotalIncome} />
          <Total
            name={INDIVIDUALOPERATIONIDS.totalIncome}
            total={totalIncome}
            label={formatMessage(m.totalIncome)}
          />
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text paddingY={1} as="h2" variant="h4">
            {formatMessage(m.expenses)}
          </Text>
          <Expenses getSum={getTotalExpense} />
          <Total
            name={INDIVIDUALOPERATIONIDS.totalExpense}
            total={totalExpense}
            label={formatMessage(m.totalExpenses)}
          />
        </GridColumn>
      </GridRow>
      <GridRow align="flexEnd">
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Total
            name={OPERATINGCOST.total}
            label={formatMessage(m.operatingCost)}
            title={formatMessage(m.operatingCost)}
            total={totalIncome - totalExpense}
          />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}
