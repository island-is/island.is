import { useState, useEffect } from 'react'
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
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import {
  CAPITALNUMBERS,
  INPUTCHANGEINTERVAL,
  OPERATINGCOST,
  VALIDATOR,
} from '../../../../shared/utils/constants'
import { CEMETERYEQUITIESANDLIABILITIESIDS } from '../../utils/constants'
import { useTotals } from '../../hooks/useTotals'
import { getTotal } from '../../utils/helpers'
import { Total } from '../../../../shared/components/Total'

export const CemeteryEquities = ({
  application,
  setBeforeSubmitCallback,
}: FieldBaseProps) => {
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
    setValue(CEMETERYEQUITIESANDLIABILITIESIDS.operationResult, total)
    setTotalOperatingCost(total)
  }, [operatingCostTotal, capitalTotal, setValue])

  const [totalOperatingCost, setTotalOperatingCost] = useState(0)
  const [equityTotal, setEquityTotal] = useState(0)
  const [equityAndDebts, setEquityAndDebts] = useState(0)

  const [getTotalAssets, totalAssets] = useTotals(
    CEMETERYEQUITIESANDLIABILITIESIDS.assetPrefix,
  )
  const [getTotalLiabilities, totalLiabilities] = useTotals(
    CEMETERYEQUITIESANDLIABILITIESIDS.liabilityPrefix,
  )
  const [getTotalEquity, totalEquity] = useTotals(
    CEMETERYEQUITIESANDLIABILITIESIDS.equityPrefix,
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
              id={CEMETERYEQUITIESANDLIABILITIESIDS.fixedAssetsTotal}
              name={CEMETERYEQUITIESANDLIABILITIESIDS.fixedAssetsTotal}
              error={
                errors &&
                getErrorViaPath(
                  errors,
                  CEMETERYEQUITIESANDLIABILITIESIDS.fixedAssetsTotal,
                )
              }
              onChange={debounce(() => {
                getTotalAssets()
                clearErrors(CEMETERYEQUITIESANDLIABILITIESIDS.fixedAssetsTotal)
              }, INPUTCHANGEINTERVAL)}
              label={formatMessage(m.fixedAssetsTotal)}
              backgroundColor="blue"
              rightAlign
              currency
            />
          </Box>
          <Box paddingY={1}>
            <InputController
              id={CEMETERYEQUITIESANDLIABILITIESIDS.currentAssets}
              name={CEMETERYEQUITIESANDLIABILITIESIDS.currentAssets}
              onChange={debounce(() => {
                getTotalAssets()
                clearErrors(CEMETERYEQUITIESANDLIABILITIESIDS.currentAssets)
              }, INPUTCHANGEINTERVAL)}
              label={formatMessage(m.currentAssets)}
              error={
                errors &&
                getErrorViaPath(
                  errors,
                  CEMETERYEQUITIESANDLIABILITIESIDS.currentAssets,
                )
              }
              backgroundColor="blue"
              rightAlign
              currency
            />
          </Box>
          <Total
            name={CEMETERYEQUITIESANDLIABILITIESIDS.assetTotal}
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
              id={CEMETERYEQUITIESANDLIABILITIESIDS.longTerm}
              name={CEMETERYEQUITIESANDLIABILITIESIDS.longTerm}
              onChange={debounce(() => {
                getTotalLiabilities()
                clearErrors(CEMETERYEQUITIESANDLIABILITIESIDS.longTerm)
              }, INPUTCHANGEINTERVAL)}
              error={
                errors &&
                getErrorViaPath(
                  errors,
                  CEMETERYEQUITIESANDLIABILITIESIDS.longTerm,
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
              id={CEMETERYEQUITIESANDLIABILITIESIDS.shortTerm}
              name={CEMETERYEQUITIESANDLIABILITIESIDS.shortTerm}
              onChange={debounce(() => {
                getTotalLiabilities()
                clearErrors(CEMETERYEQUITIESANDLIABILITIESIDS.shortTerm)
              }, INPUTCHANGEINTERVAL)}
              error={
                errors &&
                getErrorViaPath(
                  errors,
                  CEMETERYEQUITIESANDLIABILITIESIDS.shortTerm,
                )
              }
              label={formatMessage(m.shortTerm)}
              backgroundColor="blue"
              rightAlign
              currency
            />
          </Box>
          <Total
            name={CEMETERYEQUITIESANDLIABILITIESIDS.liabilityTotal}
            total={totalLiabilities}
            label={formatMessage(m.totalDebts)}
          />
          <Box paddingBottom={1} paddingTop={2}>
            <InputController
              id={
                CEMETERYEQUITIESANDLIABILITIESIDS.equityAtTheBeginningOfTheYear
              }
              name={
                CEMETERYEQUITIESANDLIABILITIESIDS.equityAtTheBeginningOfTheYear
              }
              onChange={debounce(() => {
                getTotalEquity()
                clearErrors(
                  CEMETERYEQUITIESANDLIABILITIESIDS.equityAtTheBeginningOfTheYear,
                )
              }, INPUTCHANGEINTERVAL)}
              error={
                errors &&
                getErrorViaPath(
                  errors,
                  CEMETERYEQUITIESANDLIABILITIESIDS.equityAtTheBeginningOfTheYear,
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
              id={
                CEMETERYEQUITIESANDLIABILITIESIDS.revaluationDueToPriceChanges
              }
              name={
                CEMETERYEQUITIESANDLIABILITIESIDS.revaluationDueToPriceChanges
              }
              onChange={debounce(() => {
                getTotalEquity()
                clearErrors(
                  CEMETERYEQUITIESANDLIABILITIESIDS.revaluationDueToPriceChanges,
                )
              }, INPUTCHANGEINTERVAL)}
              error={
                errors &&
                getErrorViaPath(
                  errors,
                  CEMETERYEQUITIESANDLIABILITIESIDS.revaluationDueToPriceChanges,
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
              id={CEMETERYEQUITIESANDLIABILITIESIDS.reevaluateOther}
              name={CEMETERYEQUITIESANDLIABILITIESIDS.reevaluateOther}
              onChange={debounce(() => {
                getTotalEquity()
                clearErrors(CEMETERYEQUITIESANDLIABILITIESIDS.reevaluateOther)
              }, INPUTCHANGEINTERVAL)}
              error={
                errors &&
                getErrorViaPath(
                  errors,
                  CEMETERYEQUITIESANDLIABILITIESIDS.reevaluateOther,
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
              id={CEMETERYEQUITIESANDLIABILITIESIDS.operationResult}
              name={CEMETERYEQUITIESANDLIABILITIESIDS.operationResult}
              readOnly
              error={
                errors &&
                getErrorViaPath(
                  errors,
                  CEMETERYEQUITIESANDLIABILITIESIDS.operationResult,
                )
              }
              label={formatMessage(m.operationResult)}
              backgroundColor="blue"
              rightAlign
              currency
            />
          </Box>
          <Total
            name={CEMETERYEQUITIESANDLIABILITIESIDS.equityTotal}
            total={equityTotal}
            label={formatMessage(m.totalEquity)}
          />
          <Box paddingY={1}>
            <Total
              name={CEMETERYEQUITIESANDLIABILITIESIDS.totalEquityAndLiabilities}
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
