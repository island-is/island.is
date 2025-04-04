import {
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { INDIVIDUALOPERATIONIDS, OPERATINGCOST } from '../../utils/constants'
import { m } from '../../lib/messages'
import { Income } from './Income'
import { Expenses } from './Expenses'
import { Total } from './Total'
import { useTotals } from '../../hooks/useTotals'

export const IndividualElectionOperatingIncome = () => {
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
            title={formatMessage(m.operatingCostBefore)}
            total={totalIncome - totalExpense}
          />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}
