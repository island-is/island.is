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
import { PartyIncome } from './PartyIncome'
import { PartyExpenses } from './PartyExpenses'
import { TaxInfoQuery } from '../../graphql'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { useTotals } from '../../hooks/useTotals'
import { PARTYOPERATIONIDS } from '../../utils/constants'
import { Total } from '.@island.is/libs/application/templates/inao/shared/components/Total'
import { OPERATINGCOST } from '@island.is/libs/application/templates/inao/shared/utils/constants'

export const PartyOperatingIncome = ({ application }: FieldBaseProps) => {
  const { answers } = application
  const operatingYear = getValueViaPath(
    answers,
    'conditionalAbout.operatingYear',
  )

  const { data, loading } = useQuery(TaxInfoQuery, {
    variables: { year: operatingYear },
  })

  const {
    formState: { errors },
  } = useFormContext()

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
