import React, { useState, useEffect } from 'react'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import debounce from 'lodash/debounce'
import { Application } from '@island.is/application/types'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { m } from '../../lib/messages'
import { Total } from '../KeyNumbers'
import {
  CEMETRYEQUITIESANDLIABILITIESIDS,
  INPUTCHANGEINTERVAL,
  OPERATINGCOST,
} from '../../lib/constants'
import { useTotals } from '../../hooks'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'

export const CemetryEquities = ({
  application,
}: {
  application: Application
}): JSX.Element => {
  const answers = application.answers
  const { formatMessage } = useLocale()
  const { setValue, clearErrors, errors } = useFormContext()

  const operatingCostTotal = getValueViaPath(
    answers,
    OPERATINGCOST.total,
  ) as string

  useEffect(() => {
    setValue(
      CEMETRYEQUITIESANDLIABILITIESIDS.operationResult,
      operatingCostTotal,
    )
    setTotalOperatingCost(operatingCostTotal)
  }, [operatingCostTotal, setValue])

  const [totalOperatingCost, setTotalOperatingCost] = useState('0')
  const [equityTotal, setEquityTotal] = useState(0)

  const [getTotalAssets, totalAssets] = useTotals(
    CEMETRYEQUITIESANDLIABILITIESIDS.assetPrefix,
  )
  const [getTotalLiabilities, totalLiabilities] = useTotals(
    CEMETRYEQUITIESANDLIABILITIESIDS.liabilityPrefix,
  )
  const [getTotalEquity, totalEquity] = useTotals(
    CEMETRYEQUITIESANDLIABILITIESIDS.equityPrefix,
  )

  useEffect(() => {
    const total = totalEquity - totalLiabilities
    setEquityTotal(total)
  }, [totalLiabilities, totalEquity, totalOperatingCost])

  return (
    <GridContainer>
      <GridRow align="spaceBetween">
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text paddingY={1} as="h2" variant="h4">
            {formatMessage(m.properties)}
          </Text>
          <Box paddingY={1}>
            <InputController
              id={CEMETRYEQUITIESANDLIABILITIESIDS.fixedAssetsTotal}
              name={CEMETRYEQUITIESANDLIABILITIESIDS.fixedAssetsTotal}
              error={
                errors &&
                getErrorViaPath(
                  errors,
                  CEMETRYEQUITIESANDLIABILITIESIDS.fixedAssetsTotal,
                )
              }
              onChange={debounce(() => {
                getTotalAssets()
                clearErrors(CEMETRYEQUITIESANDLIABILITIESIDS.fixedAssetsTotal)
              }, INPUTCHANGEINTERVAL)}
              label={formatMessage(m.fixedAssetsTotal)}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Box paddingY={1}>
            <InputController
              id={CEMETRYEQUITIESANDLIABILITIESIDS.currentAssets}
              name={CEMETRYEQUITIESANDLIABILITIESIDS.currentAssets}
              onChange={debounce(() => {
                getTotalAssets()
                clearErrors(CEMETRYEQUITIESANDLIABILITIESIDS.currentAssets)
              }, INPUTCHANGEINTERVAL)}
              label={formatMessage(m.currentAssets)}
              error={
                errors &&
                getErrorViaPath(
                  errors,
                  CEMETRYEQUITIESANDLIABILITIESIDS.currentAssets,
                )
              }
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
            {formatMessage(m.debtsAndCash)}
          </Text>
          <Box paddingY={1}>
            <InputController
              id={CEMETRYEQUITIESANDLIABILITIESIDS.longTerm}
              name={CEMETRYEQUITIESANDLIABILITIESIDS.longTerm}
              onChange={debounce(() => {
                getTotalLiabilities()
                clearErrors(CEMETRYEQUITIESANDLIABILITIESIDS.longTerm)
              }, INPUTCHANGEINTERVAL)}
              error={
                errors &&
                getErrorViaPath(
                  errors,
                  CEMETRYEQUITIESANDLIABILITIESIDS.longTerm,
                )
              }
              label={formatMessage(m.longTerm)}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Box paddingY={1}>
            <InputController
              id={CEMETRYEQUITIESANDLIABILITIESIDS.shortTerm}
              name={CEMETRYEQUITIESANDLIABILITIESIDS.shortTerm}
              onChange={debounce(() => {
                getTotalLiabilities()
                clearErrors(CEMETRYEQUITIESANDLIABILITIESIDS.shortTerm)
              }, INPUTCHANGEINTERVAL)}
              error={
                errors &&
                getErrorViaPath(
                  errors,
                  CEMETRYEQUITIESANDLIABILITIESIDS.shortTerm,
                )
              }
              label={formatMessage(m.shortTerm)}
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
              id={
                CEMETRYEQUITIESANDLIABILITIESIDS.equityAtTheBeginningOfTheYear
              }
              name={
                CEMETRYEQUITIESANDLIABILITIESIDS.equityAtTheBeginningOfTheYear
              }
              onChange={debounce(() => {
                getTotalEquity()
                clearErrors(
                  CEMETRYEQUITIESANDLIABILITIESIDS.equityAtTheBeginningOfTheYear,
                )
              }, INPUTCHANGEINTERVAL)}
              error={
                errors &&
                getErrorViaPath(
                  errors,
                  CEMETRYEQUITIESANDLIABILITIESIDS.equityAtTheBeginningOfTheYear,
                )
              }
              label={formatMessage(m.equityAtTheBeginningOfTheYear)}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Box paddingY={1}>
            <InputController
              id={CEMETRYEQUITIESANDLIABILITIESIDS.revaluationDueToPriceChanges}
              name={
                CEMETRYEQUITIESANDLIABILITIESIDS.revaluationDueToPriceChanges
              }
              onChange={debounce(() => {
                getTotalEquity()
                clearErrors(
                  CEMETRYEQUITIESANDLIABILITIESIDS.revaluationDueToPriceChanges,
                )
              }, INPUTCHANGEINTERVAL)}
              error={
                errors &&
                getErrorViaPath(
                  errors,
                  CEMETRYEQUITIESANDLIABILITIESIDS.revaluationDueToPriceChanges,
                )
              }
              label={formatMessage(m.revaluationDueToPriceChanges)}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Box paddingY={1}>
            <InputController
              id={CEMETRYEQUITIESANDLIABILITIESIDS.reevaluateOther}
              name={CEMETRYEQUITIESANDLIABILITIESIDS.reevaluateOther}
              onChange={debounce(() => {
                getTotalEquity()
                clearErrors(CEMETRYEQUITIESANDLIABILITIESIDS.reevaluateOther)
              }, INPUTCHANGEINTERVAL)}
              error={
                errors &&
                getErrorViaPath(
                  errors,
                  CEMETRYEQUITIESANDLIABILITIESIDS.reevaluateOther,
                )
              }
              label={formatMessage(m.reevaluateOther)}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Box paddingY={1}>
            <InputController
              id={CEMETRYEQUITIESANDLIABILITIESIDS.operationResult}
              name={CEMETRYEQUITIESANDLIABILITIESIDS.operationResult}
              readOnly
              error={
                errors &&
                getErrorViaPath(
                  errors,
                  CEMETRYEQUITIESANDLIABILITIESIDS.operationResult,
                )
              }
              label={formatMessage(m.operationResult)}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Total
            name={CEMETRYEQUITIESANDLIABILITIESIDS.equityTotal}
            total={equityTotal}
            label={formatMessage(m.totalEquity)}
          />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}
