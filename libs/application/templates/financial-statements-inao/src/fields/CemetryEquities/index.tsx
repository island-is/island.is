import React, { FC, useState, useEffect } from 'react'
import {
  AlertBanner,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import debounce from 'lodash/debounce'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import { InputController } from '@island.is/shared/form-fields'
import { m } from '../../lib/messages'
import { Total } from '../KeyNumbers'
import {
  VALIDATOR,
  CEMETRYEQUITIESANDLIABILITIESIDS,
  INPUTCHANGEINTERVAL,
  OPERATINGCOST,
  CAPITALNUMBERS,
} from '../../lib/constants'
import { useTotals } from '../../hooks'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { getTotal } from '../../lib/utils/helpers'

export const CemetryEquities: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  setBeforeSubmitCallback,
}): JSX.Element => {
  const answers = application.answers
  const { formatMessage } = useLocale()
  const {
    clearErrors,
    formState: { errors },
    setValue,
    getValues,
    setError,
  } = useFormContext()

  const operatingCostTotal = Number(
    getValueViaPath(answers, OPERATINGCOST.total),
  )

  const capitalTotal = Number(getValueViaPath(answers, CAPITALNUMBERS.total))

  useEffect(() => {
    const total = operatingCostTotal + capitalTotal
    setValue(CEMETRYEQUITIESANDLIABILITIESIDS.operationResult, total)
    setTotalOperatingCost(total)
  }, [operatingCostTotal, capitalTotal, setValue])

  const [totalOperatingCost, setTotalOperatingCost] = useState(0)
  const [equityTotal, setEquityTotal] = useState(0)
  const [equityAndDebts, setEquityAndDebts] = useState(0)

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
    setEquityTotal(totalEquity)
  }, [totalEquity, totalOperatingCost])

  useEffect(() => {
    const total = totalEquity + totalLiabilities
    setEquityAndDebts(total)
  }, [totalEquity, totalLiabilities])

  useEffect(() => {
    clearErrors(VALIDATOR)
  }, [totalEquity, totalLiabilities, totalAssets, clearErrors])

  // we need to validate some info before allowing submission of the current screen data
  // since we're comparing values from different objects, doing it via zod is not an option
  setBeforeSubmitCallback &&
    setBeforeSubmitCallback(async () => {
      const values = getValues()
      const assets = getTotal(values, 'cemetryAsset')
      const liabilties = getTotal(values, 'cemetryLiability')
      const equities = getTotal(values, 'cemetryEquity')

      // assets should equal liabilties + equities
      const isValid = liabilties + equities === assets
      if (!isValid) {
        setError(VALIDATOR, {
          type: 'custom',
          message: formatMessage(m.equityDebtsAssetsValidatorError),
        })
        return [false, formatMessage(m.equityDebtsAssetsValidatorError)]
      }
      return [true, null]
    })

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
              rightAlign
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
              rightAlign
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
            {formatMessage(m.debtsAndEquity)}
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
              rightAlign
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
              rightAlign
              currency
            />
          </Box>
          <Total
            name={CEMETRYEQUITIESANDLIABILITIESIDS.liabilityTotal}
            total={totalLiabilities}
            label={formatMessage(m.totalDebts)}
          />
          <Box paddingBottom={1} paddingTop={2}>
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
              rightAlign
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
              rightAlign
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
              rightAlign
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
              rightAlign
              currency
            />
          </Box>
          <Total
            name={CEMETRYEQUITIESANDLIABILITIESIDS.equityTotal}
            total={equityTotal}
            label={formatMessage(m.totalEquity)}
          />
          <Box paddingY={1}>
            <Total
              name={CEMETRYEQUITIESANDLIABILITIESIDS.totalEquityAndLiabilities}
              total={equityAndDebts}
              label={formatMessage(m.debtsAndCash)}
            />
          </Box>
        </GridColumn>
      </GridRow>
      {errors && errors.validator ? (
        <Box paddingY={2}>
          <AlertBanner
            title={formatMessage(m.equityErrorTitle)}
            description={formatMessage(m.equityDebtsAssetsValidatorError)}
            variant="error"
          />
        </Box>
      ) : null}
    </GridContainer>
  )
}
