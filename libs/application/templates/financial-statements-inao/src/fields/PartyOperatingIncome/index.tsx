import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useQuery } from '@apollo/client'
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
import { OPERATINGCOST, PARTYOPERATIONIDS } from '../../lib/constants'
import { useTotals } from '../../hooks'
import { TaxInfoQuery } from '../../graphql'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'

export const PartyOperatingIncome = ({ application }: FieldBaseProps) => {
  const { answers } = application
  const operatingYear = getValueViaPath(
    answers,
    'conditionalAbout.operatingYear',
  )

  const { data, loading } = useQuery(TaxInfoQuery, {
    variables: { year: operatingYear },
  })

  const { errors } = useFormContext()

  const [getTotalIncome, totalIncome] = useTotals(
    PARTYOPERATIONIDS.incomePrefix,
  )
  const [getTotalExpense, totalExpense] = useTotals(
    PARTYOPERATIONIDS.expensePrefix,
  )
  const { formatMessage } = useLocale()

  return (
    <GridContainer>
      <GridRow align="spaceBetween">
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text paddingY={1} as="h2" variant="h4">
            {formatMessage(m.income)}
          </Text>
          <PartyIncome
            data={data}
            loading={loading}
            getSum={getTotalIncome}
            errors={errors}
          />
          <Total
            name={PARTYOPERATIONIDS.totalIncome}
            total={totalIncome}
            label={formatMessage(m.totalIncome)}
          />
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text paddingY={1} as="h2" variant="h4">
            {formatMessage(m.expenses)}
          </Text>
          <PartyExpenses getSum={getTotalExpense} errors={errors} />
          <Total
            name={PARTYOPERATIONIDS.totalExpense}
            total={totalExpense}
            label={formatMessage(m.totalExpenses)}
          />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}
