import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatCurrency } from '../utils/helpers'
import { sectionColumn, starterColumnStyle } from './css/overviewStyles.css'
import { ValueLine } from './ValueLine'
import { MessageDescriptor } from 'react-intl'

type Props = {
  data: {
    capitalIncome: string
    capitalCost: string
    total: string
  }
  messages: {
    capitalNumbersMessage: MessageDescriptor
    capitalIncomeMessage: MessageDescriptor
    capitalCostMessage: MessageDescriptor
    totalCapitalMessage: MessageDescriptor
  }
}

export const CapitalNumberOverview = ({ data, messages }: Props) => {
  const { capitalIncome, capitalCost, total } = data
  const {
    capitalNumbersMessage,
    capitalIncomeMessage,
    capitalCostMessage,
    totalCapitalMessage,
  } = messages
  const { formatMessage } = useLocale()
  return (
    <>
      <Box className={starterColumnStyle}>
        <Text variant="h3" as="h3">
          {formatMessage(capitalNumbersMessage)}
        </Text>
      </Box>
      <GridRow>
        <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
          <ValueLine
            label={capitalIncomeMessage}
            value={formatCurrency(capitalIncome)}
          />
        </GridColumn>
        {capitalCost ? (
          <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
            <ValueLine
              label={capitalCostMessage}
              value={formatCurrency(capitalCost)}
            />
          </GridColumn>
        ) : null}
      </GridRow>
      <GridRow>
        <GridColumn className={sectionColumn}>
          <ValueLine
            isTotal
            label={totalCapitalMessage}
            value={total && formatCurrency(total)}
          />
        </GridColumn>
      </GridRow>
    </>
  )
}
