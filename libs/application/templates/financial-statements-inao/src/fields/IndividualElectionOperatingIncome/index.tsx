import React, { useCallback, useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
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
import { getTotal } from '../../lib/utils/helpers'

export const IndividualElectionOperatingIncome = (): JSX.Element => {
  const { getValues } = useFormContext()
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)
  const { formatMessage } = useLocale()

  const getTotalIncome = useCallback(() => {
    const values = getValues()
    const totalIncome: number = getTotal(values, 'income')
    setTotalIncome(totalIncome)
  }, [getValues])

  const getTotalExpense = useCallback(() => {
    const values = getValues()
    const totalExpense: number = getTotal(values, 'expense')
    setTotalExpense(totalExpense)
  }, [getValues])

  useEffect(() => {
    getTotalExpense()
    getTotalIncome()
  }, [getTotalExpense, getTotalIncome])

  return (
    <GridContainer>
      <GridRow align="spaceBetween">
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text paddingY={1} as="h2" variant="h4">
            {formatMessage(m.income)}
          </Text>
          <Income getSum={getTotalIncome} />
          <Total
            name="income.total"
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
            name="expense.total"
            total={totalExpense}
            label={formatMessage(m.totalExpenses)}
          />
        </GridColumn>
      </GridRow>
      <GridRow align="flexEnd">
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Total
            name="operatingCost.total"
            label={formatMessage(m.operatingCost)}
            title={formatMessage(m.operatingCost)}
            total={totalIncome - totalExpense}
          />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}
