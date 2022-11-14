import React, { Fragment } from 'react'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { FinancialStatementsInao } from '../../lib/utils/dataSchema'
import { format as formatNationalId } from 'kennitala'
import { m } from '../../lib/messages'
import { ValueLine } from './ValueLine'
import { starterColumnStyle } from './styles/overviewStyles.css'
import { useLocale } from '@island.is/localization'
import { formatCurrency } from '../../lib/utils/helpers'

export const CapitalNumberOverview = ({
  answers,
}: {
  answers: FinancialStatementsInao
}) => {
  const { formatMessage } = useLocale()
  return (
    <Fragment>
      <Box className={starterColumnStyle}>
        <Text variant="h3" as="h3">
          {formatMessage(m.capitalNumbers)}
        </Text>
      </Box>
      <GridRow>
        <GridColumn span={['12/12', '6/12']}>
          <ValueLine
            label={m.capitalIncome}
            value={answers.capitalNumbers.capitalIncome}
          />
        </GridColumn>
        {answers.capitalNumbers?.capitalCost ? (
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.capitalCost}
              value={formatPhoneNumber(answers.capitalNumbers.capitalCost)}
            />
          </GridColumn>
        ) : null}
      </GridRow>
      <GridRow>
        <GridColumn>
          <ValueLine
            isTotal
            label={m.totalCapital}
            value={formatCurrency(answers.capitalNumbers?.total)}
          />
        </GridColumn>
      </GridRow>
    </Fragment>
  )
}
