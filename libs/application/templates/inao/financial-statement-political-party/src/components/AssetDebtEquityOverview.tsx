import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { ValueLine } from './ValueLine'
import { useLocale } from '@island.is/localization'
import { formatCurrency } from '../utils/helpers'
import { m } from '../lib/messages'
import { FinancialStatementPoliticalParty } from '../lib/dataSchema'
import { sectionColumn } from './css/overviewStyles.css'
import { getValueViaPath } from '@island.is/application/core'

type Props = {
  answers: FinancialStatementPoliticalParty
}

export const AssetDebtEquityOverview = ({ answers }: Props) => {
  const { formatMessage } = useLocale()

  const fixedAssetsTotal = getValueViaPath<string>(
    answers,
    'asset.fixedAssetsTotal',
  )
  const currentAssets = getValueViaPath<string>(answers, 'asset.currentAssets')
  const assetsTotal = getValueViaPath<string>(
    answers,
    'equityAndLiabilitiesTotals.assetsTotal',
  )
  const longTermLiability = getValueViaPath<string>(
    answers,
    'liability.longTerm',
  )
  const shortTermLiability = getValueViaPath<string>(
    answers,
    'liability.shortTerm',
  )
  const totalLiabilities = getValueViaPath<string>(
    answers,
    'equityAndLiabilitiesTotals.liabilitiesTotal',
  )
  const totalEquity = getValueViaPath<string>(answers, 'equity.totalEquity')
  const equityAndLiabilitiesTotal = getValueViaPath<string>(
    answers,
    'equityAndLiabilitiesTotals.equityAndLiabilitiesTotal',
  )
  return (
    <GridRow>
      <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
        <Box paddingTop={3} paddingBottom={2}>
          <Text variant="h4" as="h4">
            {formatMessage(m.properties)}
          </Text>
        </Box>
        <ValueLine
          label={m.fixedAssetsTotal}
          value={formatCurrency(fixedAssetsTotal ?? '0')}
        />
        <ValueLine
          label={m.currentAssets}
          value={formatCurrency(currentAssets ?? '0')}
        />
        <ValueLine
          label={m.totalAssets}
          value={formatCurrency(assetsTotal ?? '0')}
          isTotal
        />
      </GridColumn>

      <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
        <Box paddingTop={3} paddingBottom={2}>
          <Text variant="h4" as="h4">
            {formatMessage(m.debtsAndEquity)}
          </Text>
        </Box>
        <ValueLine
          label={m.longTerm}
          value={formatCurrency(longTermLiability ?? '0')}
        />
        <ValueLine
          label={m.shortTerm}
          value={formatCurrency(shortTermLiability ?? '0')}
        />
        <ValueLine
          label={m.totalLiabilities}
          value={formatCurrency(totalLiabilities ?? '0')}
          isTotal
        />
        <Box paddingTop={3}>
          <ValueLine
            label={m.equity}
            value={formatCurrency(totalEquity ?? '0')}
          />
          <ValueLine
            label={m.debtsAndCash}
            value={formatCurrency(equityAndLiabilitiesTotal ?? '0')}
            isTotal
          />
        </Box>
      </GridColumn>
    </GridRow>
  )
}
