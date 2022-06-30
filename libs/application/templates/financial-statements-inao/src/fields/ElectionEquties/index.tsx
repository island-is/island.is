import React, { useCallback, useEffect, useState } from 'react'
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
import { m } from '../../lib/messages'
import { Total } from '../KeyNumbers'
import { EQUITIESANDLIABILITIESIDS } from '../../lib/constants'
import { useTotals } from '../../hooks'

export const ElectionEquities = (): JSX.Element => {
  const [getTotalEquity, totalEquity] = useTotals(
    EQUITIESANDLIABILITIESIDS.equityPrefix
  )
  const [getTotalAssets, totalAssets] = useTotals(
    EQUITIESANDLIABILITIESIDS.assetPrefix,
  )
  const [getTotalLiabilities, totalLiabilities] = useTotals(
    EQUITIESANDLIABILITIESIDS.liabilityPrefix,
  )

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
              label={formatMessage(m.tangibleAssets)}
              onBlur={() => getTotalAssets()}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Total
            name="assets.total"
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
              id={EQUITIESANDLIABILITIESIDS.equity}
              name={EQUITIESANDLIABILITIESIDS.equity}
              label={formatMessage(m.equity)}
              onBlur={() => getTotalEquity()}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Total
            name="equity.total"
            total={totalEquity - totalLiabilities}
            label={formatMessage(m.totalExpenses)}
          />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}
