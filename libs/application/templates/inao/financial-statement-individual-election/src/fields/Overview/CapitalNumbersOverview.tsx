import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { sectionColumn, starterColumnStyle } from './overviewStyles.css'
import { useLocale } from '@island.is/localization'
import { formatCurrency } from '../../lib/utils/helpers'
import { FinancialStatementIndividualElection } from '../../lib/utils/dataSchema'
import { m } from '../../lib/utils/messages'
import { ValueLine } from 'libs/application/templates/inao/shared/components/ValueLine'

type Props = {
  answers: FinancialStatementIndividualElection
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
