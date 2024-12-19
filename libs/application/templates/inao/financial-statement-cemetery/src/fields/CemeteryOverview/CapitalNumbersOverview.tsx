import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { ValueLine } from './ValueLine'
import { sectionColumn, starterColumnStyle } from './overviewStyles.css'
import { useLocale } from '@island.is/localization'
import { FormValue } from '@island.is/application/types'
import { getCapitalNumbersOverviewNumbers } from '../../utils/overviewUtils'
import { m } from '../../lib/messages'

type Props = {
  answers: FormValue
}

export const CapitalNumberOverview = ({ answers }: Props) => {
  const { formatMessage } = useLocale()
  const { capitalIncome, capitalCost, totalCapital } =
    getCapitalNumbersOverviewNumbers(answers)
  return (
    <>
      <Box className={starterColumnStyle}>
        <Text variant="h3" as="h3">
          {formatMessage(m.capitalNumbers)}
        </Text>
      </Box>
      <GridRow>
        <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
          <ValueLine label={m.capitalIncome} value={capitalIncome} />
        </GridColumn>
        {capitalCost ? (
          <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
            <ValueLine label={m.capitalCost} value={capitalCost} />
          </GridColumn>
        ) : null}
      </GridRow>
      <GridRow>
        <GridColumn className={sectionColumn}>
          <ValueLine isTotal label={m.totalCapital} value={totalCapital} />
        </GridColumn>
      </GridRow>
    </>
  )
}
