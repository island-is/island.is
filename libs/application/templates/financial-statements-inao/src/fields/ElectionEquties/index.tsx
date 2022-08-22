import React from 'react'
import { useFormContext } from 'react-hook-form'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { getErrorViaPath } from '@island.is/application/core'

import { m } from '../../lib/messages'
import { Total } from '../KeyNumbers'
import { EQUITIESANDLIABILITIESIDS } from '../../lib/constants'
import { useTotals } from '../../hooks'

export const ElectionEquities = (): JSX.Element => {
  const [getTotalEquity, totalEquity] = useTotals(
    EQUITIESANDLIABILITIESIDS.equityPrefix,
  )
  const [getTotalAssets, totalAssets] = useTotals(
    EQUITIESANDLIABILITIESIDS.assetPrefix,
  )
  const [getTotalLiabilities, totalLiabilities] = useTotals(
    EQUITIESANDLIABILITIESIDS.liabilityPrefix,
  )

  const { errors } = useFormContext()
  const { formatMessage } = useLocale()

  return (
    <GridContainer>
      <GridRow align="spaceBetween">
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text paddingY={1} as="h2" variant="h4">
            {formatMessage(m.properties)}
          </Text>
          <Box paddingY={1}>
            <InputController
              id={EQUITIESANDLIABILITIESIDS.current}
              name={EQUITIESANDLIABILITIESIDS.current}
              error={
                errors &&
                getErrorViaPath(errors, EQUITIESANDLIABILITIESIDS.current)
              }
              label={formatMessage(m.currentAssets)}
              onBlur={() => getTotalAssets()}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Box paddingY={1}>
            <InputController
              id={EQUITIESANDLIABILITIESIDS.tangible}
              name={EQUITIESANDLIABILITIESIDS.tangible}
              error={
                errors &&
                getErrorViaPath(errors, EQUITIESANDLIABILITIESIDS.tangible)
              }
              label={formatMessage(m.tangibleAssets)}
              onBlur={() => getTotalAssets()}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Total
            name="asset.total"
            total={totalAssets}
            label={formatMessage(m.totalAssets)}
          />
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text paddingY={1} as="h2" variant="h4">
            {formatMessage(m.expenses)}
          </Text>
          <Box paddingY={1}>
            <InputController
              id={EQUITIESANDLIABILITIESIDS.longTerm}
              name={EQUITIESANDLIABILITIESIDS.longTerm}
              error={
                errors &&
                getErrorViaPath(errors, EQUITIESANDLIABILITIESIDS.longTerm)
              }
              label={formatMessage(m.longTerm)}
              onBlur={() => getTotalLiabilities()}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Box paddingY={1}>
            <InputController
              id={EQUITIESANDLIABILITIESIDS.shortTerm}
              name={EQUITIESANDLIABILITIESIDS.shortTerm}
              error={
                errors &&
                getErrorViaPath(errors, EQUITIESANDLIABILITIESIDS.shortTerm)
              }
              label={formatMessage(m.shortTerm)}
              onBlur={() => getTotalLiabilities()}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Total
            name="liability.total"
            total={totalLiabilities}
            label={formatMessage(m.totalDebts)}
          />
          <Box paddingY={1}>
            <InputController
              id={EQUITIESANDLIABILITIESIDS.totalEquity}
              name={EQUITIESANDLIABILITIESIDS.totalEquity}
              error={
                errors &&
                getErrorViaPath(errors, EQUITIESANDLIABILITIESIDS.totalEquity)
              }
              label={formatMessage(m.equity)}
              onBlur={() => getTotalEquity()}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Total
            name={EQUITIESANDLIABILITIESIDS.totalCash}
            total={totalEquity - totalLiabilities}
            label={formatMessage(m.totalExpenses)}
          />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}
