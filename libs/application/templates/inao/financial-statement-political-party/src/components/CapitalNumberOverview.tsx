import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { ValueLine } from './ValueLine'
import { useLocale } from '@island.is/localization'
import { FinancialStatementPoliticalParty } from '../lib/dataSchema'
import { formatCurrency } from '../utils/helpers'
import { m } from '../lib/messages'
import { sectionColumn, starterColumnStyle } from './css/overviewStyles.css'

type Props = {
  answers: FinancialStatementPoliticalParty
}

export const CapitalNumberOverview = ({ answers }: Props) => {
  const { formatMessage } = useLocale()
  return (
    <>
      <Box className={starterColumnStyle}>
        <Text variant="h3" as="h3">
          {formatMessage(m.capitalNumbers)}
        </Text>
      </Box>
      <GridRow>
        <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
          <ValueLine
            label={m.capitalIncome}
            value={formatCurrency(answers.capitalNumbers.capitalIncome)}
          />
        </GridColumn>
        {answers.capitalNumbers?.capitalCost ? (
          <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
            <ValueLine
              label={m.capitalCost}
              value={formatCurrency(answers.capitalNumbers.capitalCost)}
            />
          </GridColumn>
        ) : null}
      </GridRow>
      <GridRow>
        <GridColumn className={sectionColumn}>
          <ValueLine
            isTotal
            label={m.totalCapital}
            value={formatCurrency(answers.capitalNumbers?.total)}
          />
        </GridColumn>
      </GridRow>
    </>
  )
}
