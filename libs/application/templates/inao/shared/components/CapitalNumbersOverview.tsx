import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatCurrency } from '../utils/formatCurrency'
import { sectionColumn, starterColumnStyle } from './css/overviewStyles.css'
import { ValueLine } from './ValueLine'
import { MessageDescriptor } from 'react-intl'

type Props = {
  capitalNumbers: {
    capitalIncome?: string
    capitalCost?: string
    total?: string
  }
  capitalIncome: MessageDescriptor
  capitalCost: MessageDescriptor
  totalCapital: MessageDescriptor
}

export const CapitalNumberOverview = ({
  capitalNumbers,
  capitalIncome,
  capitalCost,
  totalCapital,
}: Props) => {
  const { formatMessage } = useLocale()
  return (
    <>
      <Box className={starterColumnStyle}>
        <Text variant="h3" as="h3">
          {formatMessage(capitalNumbers)}
        </Text>
      </Box>
      <GridRow>
        <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
          <ValueLine
            label={capitalIncome}
            value={formatCurrency(capitalNumbers.capitalIncome)}
          />
        </GridColumn>
        {capitalNumbers?.capitalCost ? (
          <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
            <ValueLine
              label={capitalCost}
              value={formatCurrency(capitalNumbers.capitalCost)}
            />
          </GridColumn>
        ) : null}
      </GridRow>
      <GridRow>
        <GridColumn className={sectionColumn}>
          <ValueLine
            isTotal
            label={totalCapital}
            value={formatCurrency(capitalNumbers?.total)}
          />
        </GridColumn>
      </GridRow>
    </>
  )
}
