import React, { FC, useState, useEffect } from 'react'
import debounce from 'lodash/debounce'
import { useFormContext } from 'react-hook-form'
import { FieldBaseProps } from '@island.is/application/types'
import {
  AlertBanner,
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
import {
  INPUTCHANGEINTERVAL,
  EQUITIESANDLIABILITIESIDS,
  VALIDATOR,
} from '../../lib/constants'
import { useTotals } from '../../hooks'
import { getTotal } from '../../lib/utils/helpers'

export const ElectionEquities: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  setBeforeSubmitCallback,
}): JSX.Element => {
  const { formatMessage } = useLocale()

  const {
    formState: { errors },
    clearErrors,
    getValues,
    setError,
  } = useFormContext()

  const [getTotalEquity, totalEquity] = useTotals(
    EQUITIESANDLIABILITIESIDS.equityPrefix,
  )
  const [getTotalAssets, totalAssets] = useTotals(
    EQUITIESANDLIABILITIESIDS.assetPrefix,
  )
  const [getTotalLiabilities, totalLiabilities] = useTotals(
    EQUITIESANDLIABILITIESIDS.liabilityPrefix,
  )

  const [equityAndDebts, setEquityAndDebts] = useState(0)

  useEffect(() => {
    const total = totalEquity + totalLiabilities
    setEquityAndDebts(total)
  }, [totalEquity, totalLiabilities])

  useEffect(() => {
    clearErrors(VALIDATOR)
  }, [totalEquity, totalLiabilities, totalAssets, clearErrors])

  setBeforeSubmitCallback &&
    setBeforeSubmitCallback(async () => {
      const values = getValues()
      const assets = getTotal(values, 'asset')
      const liabilties = getTotal(values, 'liability')
      const equities = getTotal(values, 'equity')

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
              id={EQUITIESANDLIABILITIESIDS.fixedAssetsTotal}
              name={EQUITIESANDLIABILITIESIDS.fixedAssetsTotal}
              rightAlign
              error={
                errors &&
                getErrorViaPath(
                  errors,
                  EQUITIESANDLIABILITIESIDS.fixedAssetsTotal,
                )
              }
              label={formatMessage(m.fixedAssetsTotal)}
              onChange={debounce(() => {
                getTotalAssets()
                clearErrors(EQUITIESANDLIABILITIESIDS.fixedAssetsTotal)
              }, INPUTCHANGEINTERVAL)}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Box paddingY={1}>
            <InputController
              id={EQUITIESANDLIABILITIESIDS.currentAssets}
              name={EQUITIESANDLIABILITIESIDS.currentAssets}
              error={
                errors &&
                getErrorViaPath(errors, EQUITIESANDLIABILITIESIDS.currentAssets)
              }
              rightAlign
              onChange={debounce(() => {
                getTotalAssets()
                clearErrors(EQUITIESANDLIABILITIESIDS.currentAssets)
              }, INPUTCHANGEINTERVAL)}
              label={formatMessage(m.currentAssets)}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Total
            name={EQUITIESANDLIABILITIESIDS.assetTotal}
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
              id={EQUITIESANDLIABILITIESIDS.longTerm}
              name={EQUITIESANDLIABILITIESIDS.longTerm}
              rightAlign
              onChange={debounce(() => {
                getTotalLiabilities()
                clearErrors(EQUITIESANDLIABILITIESIDS.longTerm)
              }, INPUTCHANGEINTERVAL)}
              error={
                errors &&
                getErrorViaPath(errors, EQUITIESANDLIABILITIESIDS.longTerm)
              }
              label={formatMessage(m.longTerm)}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Box paddingY={1}>
            <InputController
              id={EQUITIESANDLIABILITIESIDS.shortTerm}
              name={EQUITIESANDLIABILITIESIDS.shortTerm}
              rightAlign
              onChange={debounce(() => {
                getTotalLiabilities()
                clearErrors(EQUITIESANDLIABILITIESIDS.shortTerm)
              }, INPUTCHANGEINTERVAL)}
              error={
                errors &&
                getErrorViaPath(errors, EQUITIESANDLIABILITIESIDS.shortTerm)
              }
              label={formatMessage(m.shortTerm)}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Total
            name={EQUITIESANDLIABILITIESIDS.totalLiability}
            total={totalLiabilities}
            label={formatMessage(m.totalDebts)}
          />
          <Box paddingBottom={1} paddingTop={2}>
            <InputController
              id={EQUITIESANDLIABILITIESIDS.totalEquity}
              name={EQUITIESANDLIABILITIESIDS.totalEquity}
              rightAlign
              onChange={debounce(() => {
                getTotalEquity()
                clearErrors(EQUITIESANDLIABILITIESIDS.totalEquity)
              }, INPUTCHANGEINTERVAL)}
              error={
                errors &&
                getErrorViaPath(errors, EQUITIESANDLIABILITIESIDS.totalEquity)
              }
              label={formatMessage(m.equity)}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Box paddingY={1}>
            <Total
              name={EQUITIESANDLIABILITIESIDS.totalEquityAndLiabilities}
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
