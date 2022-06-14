import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { Income } from './ElectionIncome'
import { Expenses } from './ElectionExpenses'
import { Total } from '../KeyNumbers'
import { getTotal } from '../../lib/utils/helpers'

export const PersonalElectionOperatingIncome = (): JSX.Element => {
  const { getValues } = useFormContext()
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)
  const { formatMessage } = useLocale()

  const getTotalIncome = (key: string) => {
    const values = getValues()
    const totalIncome: number = getTotal(values, key)
    setTotalIncome(totalIncome)
    return totalIncome
  }

  const getTotalExpense = (key: string) => {
    const values = getValues()
    const totalExpense: number = getTotal(values, key)
    setTotalExpense(totalExpense)
    return totalExpense
  }

  return (
    <GridContainer>
      <GridRow align="spaceBetween">
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text paddingY={1} as="h2" variant="h4">
            {formatMessage(m.income)}
          </Text>
          <Income getSum={getTotalIncome} />
          <Total total={totalIncome} label={formatMessage(m.totalIncome)} />
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text paddingY={1} as="h2" variant="h4">
            {formatMessage(m.expenses)}
          </Text>
          <Expenses getSum={getTotalExpense} />
          <Total total={totalExpense} label={formatMessage(m.totalExpenses)} />
        </GridColumn>
      </GridRow>
      <GridRow align="flexEnd">
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Total
            label={formatMessage(m.operatingCost)}
            title={formatMessage(m.operatingCost)}
            total={totalIncome - totalExpense}
          />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}
