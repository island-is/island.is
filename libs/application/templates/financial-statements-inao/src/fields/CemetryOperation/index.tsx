import React from 'react'
import { useFormContext } from 'react-hook-form'
import {
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { Total } from '../KeyNumbers'
import { CemetryIncome } from './cemetryIncome'
import { CemetryExpenses } from './cemetryExpenses'
import { CEMETRYOPERATIONIDS, OPERATINGCOST } from '../../lib/constants'
import { useTotals } from '../../hooks'

export const CemetryOperation = () => {
  const { errors } = useFormContext()
  const { formatMessage } = useLocale()

  const [getTotalIncome, totalIncome] = useTotals(
    CEMETRYOPERATIONIDS.prefixIncome,
  )
  const [getTotalExpense, totalExpense] = useTotals(
    CEMETRYOPERATIONIDS.prefixExpense,
  )

  return (
    <GridContainer>
      <GridRow align="spaceBetween">
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text paddingY={1} as="h2" variant="h4">
            {formatMessage(m.income)}
          </Text>
          <CemetryIncome getSum={getTotalIncome} errors={errors} />
          <Total
            name={CEMETRYOPERATIONIDS.totalIncome}
            total={totalIncome}
            label={formatMessage(m.totalIncome)}
          />
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text paddingY={1} as="h2" variant="h4">
            {formatMessage(m.expenses)}
          </Text>
          <CemetryExpenses getSum={getTotalExpense} errors={errors} />
          <Total
            name={CEMETRYOPERATIONIDS.totalExpense}
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
