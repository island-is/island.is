import React from 'react'
import { useFormContext } from 'react-hook-form'
import {
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { Application } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { Total } from '../KeyNumbers'
import { CemetryIncome } from './cemetryIncome'
import { CemetryExpenses } from './cemetryExpenses'
import { CEMETRYOPERATIONIDS, OPERATINGCOST } from '../../lib/constants'
import { useTotals } from '../../hooks'
import { getCurrentUserType } from '../../lib/utils/helpers'
import { CemeteryIncomeLimit } from '../CemetryIncomeLimit'
import { useQuery } from '@apollo/client'
import { getValueViaPath } from '@island.is/application/core'
import { TaxInfoQuery } from '../../graphql'

export const CemetryOperation = ({
  application,
}: {
  application: Application
}) => {
  const { answers, externalData } = application

  const operatingYear = getValueViaPath(
    answers,
    'conditionalAbout.operatingYear',
  )

  const { data, loading } = useQuery(TaxInfoQuery, {
    variables: { year: operatingYear },
  })

  const { errors } = useFormContext()
  const { formatMessage } = useLocale()
  const currentUserType = getCurrentUserType(answers, externalData)
  const [getTotalIncome, totalIncome] = useTotals(
    CEMETRYOPERATIONIDS.prefixIncome,
  )
  const [getTotalExpense, totalExpense] = useTotals(
    CEMETRYOPERATIONIDS.prefixExpense,
  )

  return (
    <GridContainer>
      <CemeteryIncomeLimit currentUserType={currentUserType} />
      <GridRow align="spaceBetween">
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text paddingY={1} as="h2" variant="h4">
            {formatMessage(m.income)}
          </Text>
          <CemetryIncome
            data={data}
            loading={loading}
            getSum={getTotalIncome}
            errors={errors}
          />
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
          <CemetryExpenses
            data={data}
            loading={loading}
            getSum={getTotalExpense}
            errors={errors}
          />
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
