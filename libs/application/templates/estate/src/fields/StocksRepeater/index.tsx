import { FC, useEffect, useCallback, useState } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { DecimalInputController } from '../DecimalInputController'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  Text,
} from '@island.is/island-ui/core'

import { m } from '../../lib/messages'
import { getEstateDataFromApplication } from '../../lib/utils'
import { ErrorValue } from '../../types'
import { RepeaterTotal } from '../RepeaterTotal'
import { useRepeaterTotal } from '../../hooks/useRepeaterTotal'

interface StockFormField {
  id: string
  organization?: string
  nationalId?: string
  faceValue?: string
  rateOfExchange?: string
  value?: string
  initial?: boolean
  enabled?: boolean
}

interface StocksRepeaterProps {
  field: {
    props: {
      repeaterButtonText: string
    }
  }
}

export const StocksRepeater: FC<
  React.PropsWithChildren<FieldBaseProps & StocksRepeaterProps>
> = ({ application, field, errors }) => {
  const { id } = field
  const repeaterButtonText = field?.props?.repeaterButtonText
  const error = (errors as ErrorValue)?.estate?.stocks
  const { formatMessage } = useLocale()
  const { fields, append, remove, update, replace } = useFieldArray({
    name: id,
  })
  const { control, clearErrors, setValue, getValues } = useFormContext()
  const [, updateState] = useState<unknown>()
  const forceUpdate = useCallback(() => updateState({}), [])

  const { total, calculateTotal } = useRepeaterTotal(
    id,
    getValues,
    fields,
    (field: StockFormField) => field.value,
  )

  useEffect(() => {
    const estateData = getEstateDataFromApplication(application)
    if (fields.length === 0 && estateData.estate?.stocks) {
      replace(estateData.estate.stocks)
    }
  }, [application, fields.length, replace])

  // Calculate stock value from faceValue * rateOfExchange
  const updateStocksValue = (fieldIndex: string) => {
    const stockValues = getValues(fieldIndex)
    const faceValue = stockValues?.faceValue?.replace(/[^\d.]/g, '') || '0'
    const rateOfExchange = stockValues?.rateOfExchange || '0'

    // Check if rateOfExchange contains invalid characters (anything other than numbers and dots)
    const hasInvalidChars = /[^\d.]/.test(rateOfExchange)

    if (hasInvalidChars) {
      // If invalid characters found, clear the value field
      setValue(`${fieldIndex}.value`, '')
      forceUpdate()
      return
    }

    // Clean the rate of exchange for calculation
    const cleanRateOfExchange = rateOfExchange.replace(/[^\d.]/g, '') || '0'
    const parsedFaceValue = parseFloat(faceValue)
    const parsedRateOfExchange = parseFloat(cleanRateOfExchange)

    if (!parsedFaceValue || !parsedRateOfExchange) {
      setValue(`${fieldIndex}.value`, '')
      forceUpdate()
      return
    }

    const total = parsedFaceValue * parsedRateOfExchange
    const totalString = total.toFixed(0)

    setValue(`${fieldIndex}.value`, totalString)

    if (total > 0) {
      clearErrors(`${fieldIndex}.value`)
    }

    forceUpdate()
    calculateTotal()
  }

  const handleAddStock = () =>
    append({
      organization: '',
      nationalId: '',
      faceValue: '',
      rateOfExchange: '',
      value: '',
      initial: false,
      enabled: true,
    })

  const handleRemoveStock = (index: number) => remove(index)

  return (
    <Box marginTop={2}>
      {fields.map((field: StockFormField, index) => {
        const fieldIndex = `${id}[${index}]`
        const organizationField = `${fieldIndex}.organization`
        const nationalIdField = `${fieldIndex}.nationalId`
        const faceValueField = `${fieldIndex}.faceValue`
        const rateOfExchangeField = `${fieldIndex}.rateOfExchange`
        const valueField = `${fieldIndex}.value`
        const initialField = `${fieldIndex}.initial`
        const enabledField = `${fieldIndex}.enabled`
        const fieldError = error && error[index] ? error[index] : null

        return (
          <Box position="relative" key={field.id} marginTop={2}>
            <Controller
              name={initialField}
              control={control}
              defaultValue={field.initial || false}
              render={() => <input type="hidden" />}
            />
            <Controller
              name={enabledField}
              control={control}
              defaultValue={field.enabled ?? true}
              render={() => <input type="hidden" />}
            />
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              marginBottom={0}
            >
              <Text variant="h4" />
              <Box display="flex" alignItems="center" columnGap={2}>
                {field.initial && (
                  <Button
                    variant="text"
                    icon={field.enabled ? 'remove' : 'add'}
                    size="small"
                    iconType="outline"
                    onClick={() => {
                      const updatedStock = {
                        ...field,
                        enabled: !field.enabled,
                      }
                      update(index, updatedStock)
                      clearErrors(`${id}[${index}].value`)
                    }}
                  >
                    {field.enabled
                      ? formatMessage(m.inheritanceDisableMember)
                      : formatMessage(m.inheritanceEnableMember)}
                  </Button>
                )}
                {!field.initial && (
                  <Button
                    variant="ghost"
                    size="small"
                    circle
                    icon="remove"
                    onClick={handleRemoveStock.bind(null, index)}
                  />
                )}
              </Box>
            </Box>
            <GridRow>
              <GridColumn
                span={['1/1', '1/2']}
                paddingBottom={2}
                paddingTop={2}
              >
                <InputController
                  id={organizationField}
                  name={organizationField}
                  label={formatMessage(m.stocksOrganization)}
                  backgroundColor="blue"
                  defaultValue={field.organization}
                  error={fieldError?.organization}
                  size="sm"
                  onChange={() => updateStocksValue(fieldIndex)}
                />
              </GridColumn>
              <GridColumn
                span={['1/1', '1/2']}
                paddingBottom={2}
                paddingTop={2}
              >
                <InputController
                  id={nationalIdField}
                  name={nationalIdField}
                  label={formatMessage(m.stocksNationalId)}
                  defaultValue={field.nationalId}
                  placeholder="000000-0000"
                  error={fieldError?.nationalId}
                  format="######-####"
                  size="sm"
                  backgroundColor="blue"
                  disabled={field.initial && !field.enabled}
                  onChange={() => updateStocksValue(fieldIndex)}
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={faceValueField}
                  name={faceValueField}
                  label={formatMessage(m.stocksFaceValue)}
                  defaultValue={field.faceValue}
                  placeholder="0 kr."
                  error={fieldError?.faceValue}
                  currency
                  size="sm"
                  backgroundColor="blue"
                  disabled={field.initial && !field.enabled}
                  onChange={() => updateStocksValue(fieldIndex)}
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <DecimalInputController
                  id={rateOfExchangeField}
                  name={rateOfExchangeField}
                  label={formatMessage(m.stocksRateOfChange)}
                  defaultValue={field.rateOfExchange}
                  placeholder="0"
                  error={fieldError?.rateOfExchange}
                  size="sm"
                  backgroundColor="blue"
                  disabled={field.initial && !field.enabled}
                  onChange={() => updateStocksValue(fieldIndex)}
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={valueField}
                  name={valueField}
                  label={formatMessage(m.stocksValue)}
                  defaultValue={field.value}
                  placeholder="0 kr."
                  error={fieldError?.value}
                  currency
                  size="sm"
                  backgroundColor="white"
                  disabled={field.initial && !field.enabled}
                  readOnly
                />
              </GridColumn>
            </GridRow>
          </Box>
        )
      })}
      <Box marginTop={2}>
        <Button
          variant="text"
          icon="add"
          iconType="outline"
          onClick={handleAddStock}
          size="small"
        >
          {formatMessage(repeaterButtonText)}
        </Button>
      </Box>
      <RepeaterTotal id={id} total={total} show={!!fields.length} />
    </Box>
  )
}

export default StocksRepeater
