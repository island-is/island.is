import React from 'react'
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
import { CEMETRYEQUITIESANDLIABILITIESIDS } from '../../lib/constants'
import { useTotals } from '../../hooks'

export const CemetryEquities = (): JSX.Element => {
  const { formatMessage } = useLocale()

  const [getTotalAssets, totalAssets] = useTotals(
    CEMETRYEQUITIESANDLIABILITIESIDS.assetPrefix,
  )
  const [getTotalLiabilities, totalLiabilities] = useTotals(
    CEMETRYEQUITIESANDLIABILITIESIDS.liabilityPrefix,
  )
  const [getTotalEquity, totalEquity] = useTotals(
    CEMETRYEQUITIESANDLIABILITIESIDS.equityPrefix,
  )

  return (
    <GridContainer>
      <GridRow align="spaceBetween">
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text paddingY={1} as="h2" variant="h4">
            {formatMessage(m.properties)}
          </Text>
          <Box paddingY={1}>
            <InputController
              id={CEMETRYEQUITIESANDLIABILITIESIDS.current}
              name={CEMETRYEQUITIESANDLIABILITIESIDS.current}
              label={formatMessage(m.currentAssets)}
              onBlur={() => getTotalAssets()}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Box paddingY={1}>
            <InputController
              id={CEMETRYEQUITIESANDLIABILITIESIDS.tangible}
              name={CEMETRYEQUITIESANDLIABILITIESIDS.tangible}
              label={formatMessage(m.tangibleAssets)}
              onBlur={() => getTotalAssets()}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Total
            name={CEMETRYEQUITIESANDLIABILITIESIDS.assetTotal}
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
              id={CEMETRYEQUITIESANDLIABILITIESIDS.longTerm}
              name={CEMETRYEQUITIESANDLIABILITIESIDS.longTerm}
              label={formatMessage(m.longTerm)}
              onBlur={() => getTotalLiabilities()}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Box paddingY={1}>
            <InputController
              id={CEMETRYEQUITIESANDLIABILITIESIDS.shortTerm}
              name={CEMETRYEQUITIESANDLIABILITIESIDS.shortTerm}
              label={formatMessage(m.shortTerm)}
              onBlur={() => getTotalLiabilities()}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Total
            name={CEMETRYEQUITIESANDLIABILITIESIDS.liabilityTotal}
            total={totalLiabilities}
            label={formatMessage(m.totalDebts)}
          />
          <Box paddingY={1}>
            <InputController
              id={CEMETRYEQUITIESANDLIABILITIESIDS.newYearEquity}
              name={CEMETRYEQUITIESANDLIABILITIESIDS.newYearEquity}
              label={formatMessage(m.newYearequity)}
              onBlur={() => getTotalEquity()}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Box paddingY={1}>
            <InputController
              id={CEMETRYEQUITIESANDLIABILITIESIDS.reevaluatePrice}
              name={CEMETRYEQUITIESANDLIABILITIESIDS.reevaluatePrice}
              label={formatMessage(m.reevaluatePrice)}
              onBlur={() => getTotalEquity()}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Box paddingY={1}>
            <InputController
              id={CEMETRYEQUITIESANDLIABILITIESIDS.reevaluateOther}
              name={CEMETRYEQUITIESANDLIABILITIESIDS.reevaluateOther}
              label={formatMessage(m.reevaluateOther)}
              onBlur={() => getTotalEquity()}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Box paddingY={1}>
            <InputController
              id={CEMETRYEQUITIESANDLIABILITIESIDS.operationResult}
              name={CEMETRYEQUITIESANDLIABILITIESIDS.operationResult}
              label={formatMessage(m.operationResult)}
              onBlur={() => getTotalEquity()}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Total
            name={CEMETRYEQUITIESANDLIABILITIESIDS.equityTotal}
            total={totalEquity - totalLiabilities}
            label={formatMessage(m.totalExpenses)}
          />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}
