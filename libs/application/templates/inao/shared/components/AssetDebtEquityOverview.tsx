import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatCurrency } from '../utils/helpers'
import { sectionColumn } from './css/overviewStyles.css'
import { ValueLine } from './ValueLine'
import { MessageDescriptor } from 'react-intl'

type Props = {
  liability: {
    longTerm: string
    shortTerm: string
    total: string
  }
  asset: {
    fixedAssetsTotal: string
    currentAssets: string
    total: string
  }
  equity: {
    totalEquity: string
  }
  equityAndLiabilities: {
    total: string
  }
  fixedAssetsTotal: MessageDescriptor
  currentAssets: MessageDescriptor
  totalAssets: MessageDescriptor
  longTerm: MessageDescriptor
  shortTerm: MessageDescriptor
  totalLiabilities: MessageDescriptor
  equityTitle: MessageDescriptor
  debtsAndCash: MessageDescriptor
  properties: MessageDescriptor
  debtsAndEquity: MessageDescriptor
}

export const AssetDebtEquityOverview = ({
  liability,
  asset,
  equity,
  equityAndLiabilities,
  fixedAssetsTotal,
  currentAssets,
  totalAssets,
  longTerm,
  shortTerm,
  totalLiabilities,
  equityTitle,
  debtsAndCash,
  properties,
  debtsAndEquity,
}: Props) => {
  const { formatMessage } = useLocale()

  return (
    <GridRow>
      <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
        <Box paddingTop={3} paddingBottom={2}>
          <Text variant="h4" as="h4">
            {formatMessage(properties)}
          </Text>
        </Box>
        <ValueLine
          label={fixedAssetsTotal}
          value={formatCurrency(asset?.fixedAssetsTotal)}
        />
        <ValueLine
          label={currentAssets}
          value={formatCurrency(asset?.currentAssets)}
        />
        <ValueLine
          label={totalAssets}
          value={formatCurrency(asset?.total)}
          isTotal
        />
      </GridColumn>

      <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
        <Box paddingTop={3} paddingBottom={2}>
          <Text variant="h4" as="h4">
            {formatMessage(debtsAndEquity)}
          </Text>
        </Box>
        <ValueLine
          label={longTerm}
          value={formatCurrency(liability?.longTerm)}
        />
        <ValueLine
          label={shortTerm}
          value={formatCurrency(liability?.shortTerm)}
        />
        <ValueLine
          label={totalLiabilities}
          value={formatCurrency(liability?.total)}
          isTotal
        />
        <Box paddingTop={3}>
          <ValueLine
            label={equityTitle}
            value={formatCurrency(equity?.totalEquity)}
          />
          <ValueLine
            label={debtsAndCash}
            value={formatCurrency(equityAndLiabilities?.total)}
            isTotal
          />
        </Box>
      </GridColumn>
    </GridRow>
  )
}
