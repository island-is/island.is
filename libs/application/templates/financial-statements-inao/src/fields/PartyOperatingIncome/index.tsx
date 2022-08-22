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
import { PartyIncome } from './partyIncome'
import { PartyExpenses } from './partyExpenses'
import { PARTYOPERATIONIDS } from '../../lib/constants'
import { useTotals } from '../../hooks'

export const PartyOperatingIncome = () => {
  const { getValues, errors, setError } = useFormContext()

  const [getTotalIncome, totalIncome] = useTotals(
    PARTYOPERATIONIDS.incomePrefix,
  )
  const [getTotalExpense, totalExpense] = useTotals(
    PARTYOPERATIONIDS.expensePrefix,
  )

  const { formatMessage } = useLocale()

  const checkIfEmpty = (fieldId: string) => {
    const values = getValues()
    const [income, id] = fieldId.split('.')
    const current = values[income][id]
    if (current === undefined || current.trim().length <= 0) {
      setError(fieldId, {
        type: 'error',
        message: formatMessage(m.errorEmpty),
      })
    }
  }

  return (
    <GridContainer>
      <GridRow align="spaceBetween">
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text paddingY={1} as="h2" variant="h4">
            {formatMessage(m.income)}
          </Text>
          <PartyIncome getSum={getTotalIncome} errors={errors} />
          <Total
            name="partyIncome.total"
            total={totalIncome}
            label={formatMessage(m.totalIncome)}
          />
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text paddingY={1} as="h2" variant="h4">
            {formatMessage(m.expenses)}
          </Text>
          <PartyExpenses
            getSum={getTotalExpense}
            checkIfEmpty={checkIfEmpty}
            errors={errors}
          />
          <Total
            name="poperatingCost"
            total={totalExpense}
            label={formatMessage(m.totalExpenses)}
          />
        </GridColumn>
      </GridRow>
      <GridRow align="flexEnd">
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Total
            name="partyOperatingCost.total"
            label={formatMessage(m.operatingCost)}
            title={formatMessage(m.operatingCost)}
            total={totalIncome - totalExpense}
          />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}
