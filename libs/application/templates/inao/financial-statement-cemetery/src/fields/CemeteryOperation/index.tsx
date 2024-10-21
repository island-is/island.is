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
import { CemetryIncome } from './CemeteryIncome'
import { CemeteryExpenses } from './CemeteryExpenses'
import { CemeteryIncomeLimit } from '../CemeteryIncomeLimit/index'
import { useQuery } from '@apollo/client'
import { getValueViaPath } from '@island.is/application/core'
import { taxInfoQuery } from '../../graphql'
import { CEMETERYOPERATIONIDS } from '../../utils/constants'
import { useTotals } from '../../hooks/useTotals'
import { Total } from '../../../../shared/components/Total'
import { OPERATINGCOST } from '../../../../shared/utils/constants'

export const CemeteryOperation = ({
  application,
}: {
  application: Application
}) => {
  const { answers } = application

  const operatingYear =
    getValueViaPath(answers, 'conditionalAbout.operatingYear') ?? ''

  const { data, loading } = useQuery(taxInfoQuery, {
    variables: { year: operatingYear },
  })

  const {
    formState: { errors },
  } = useFormContext()
  const { formatMessage } = useLocale()
  const [getTotalIncome, totalIncome] = useTotals(
    CEMETERYOPERATIONIDS.prefixIncome,
  )
  const [getTotalExpense, totalExpense] = useTotals(
    CEMETERYOPERATIONIDS.prefixExpense,
  )

  return (
    <GridContainer>
      <CemeteryIncomeLimit />
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
            name={CEMETERYOPERATIONIDS.totalIncome}
            total={totalIncome}
            label={formatMessage(m.totalIncome)}
          />
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text paddingY={1} as="h2" variant="h4">
            {formatMessage(m.expenses)}
          </Text>
          <CemeteryExpenses
            data={data}
            loading={loading}
            getSum={getTotalExpense}
            errors={errors}
          />
          <Total
            name={CEMETERYOPERATIONIDS.totalExpense}
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
