import { FC, useEffect, useCallback, useRef } from 'react'
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  ProfileCard,
  Text,
} from '@island.is/island-ui/core'

import * as styles from '../styles.css'
import { m } from '../../lib/messages'
import { getEstateDataFromApplication } from '../../lib/utils'
import { ErrorValue } from '../../types'

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
  const { control, clearErrors } = useFormContext()
  const estateData = getEstateDataFromApplication(application)
  
  // Watch all field values to calculate stock values dynamically
  const watchedFields = useWatch({
    control,
    name: id,
  })
  
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (fields.length === 0 && estateData.estate?.stocks) {
      replace(estateData.estate.stocks)
    }
  }, [])

  // Calculate stock value from faceValue * rateOfExchange
  const calculateStockValue = (faceValue: string, rateOfExchange: string): string => {
    const face = parseFloat(faceValue?.replace(/[^0-9.-]/g, '') || '0')
    const rate = parseFloat(rateOfExchange?.replace(/[^0-9.-]/g, '') || '0')
    return (face * rate).toString()
  }

  // Debounced update function to prevent focus loss
  const debouncedUpdateValues = useCallback(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      if (watchedFields && Array.isArray(watchedFields)) {
        watchedFields.forEach((stock: StockFormField, index: number) => {
          if (stock && !stock.initial) {
            const calculatedValue = calculateStockValue(stock.faceValue || '0', stock.rateOfExchange || '0')
            if (calculatedValue !== stock.value) {
              update(index, {
                ...stock,
                value: calculatedValue,
              })
            }
          }
        })
      }
    }, 300) // 300ms debounce
  }, [watchedFields, update, calculateStockValue])

  // Update stock values when faceValue or rateOfExchange changes
  useEffect(() => {
    debouncedUpdateValues()
    
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [debouncedUpdateValues])

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
      <GridRow>
        {fields.reduce((acc, stock: StockFormField, index) => {
          if (!stock.initial) {
            return acc
          }
          return [
            ...acc,
            <GridColumn
              key={stock.id}
              span={['12/12', '12/12', '6/12']}
              paddingBottom={3}
            >
              <ProfileCard
                disabled={!stock.enabled}
                title={
                  stock.organization || formatMessage(m.stocksTitle)
                }
                key={stock.organization}
                description={[
                  `${formatMessage(m.stocksValue)}: ${
                    watchedFields && watchedFields[index] 
                      ? calculateStockValue(
                          watchedFields[index].faceValue || '0',
                          watchedFields[index].rateOfExchange || '0'
                        )
                      : stock.value || '0'
                  } kr.`,
                  `${formatMessage(m.stocksNationalId)}: ${
                    stock.nationalId || ''
                  }`,
                  <Box marginTop={1} as="span">
                    <Button
                      variant="text"
                      icon={stock.enabled ? 'remove' : 'add'}
                      size="small"
                      iconType="outline"
                      onClick={() => {
                        const updatedStock = {
                          ...stock,
                          enabled: !stock.enabled,
                        }
                        update(index, updatedStock)
                        clearErrors(`${id}[${index}].value`)
                      }}
                    >
                      {stock.enabled
                        ? formatMessage(m.inheritanceDisableMember)
                        : formatMessage(m.inheritanceEnableMember)}
                    </Button>
                  </Box>,
                ]}
              />
              <Box marginTop={2}>
                <InputController
                  id={`${id}[${index}].value`}
                  name={`${id}[${index}].value`}
                  label={formatMessage(m.stocksValue)}
                  disabled={!stock.enabled}
                  backgroundColor="blue"
                  placeholder="0 kr."
                  defaultValue={stock.value}
                  error={error && error[index]?.value}
                  currency
                  size="sm"
                  required
                />
              </Box>
            </GridColumn>,
          ]
        }, [] as JSX.Element[])}
      </GridRow>
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
          <Box
            position="relative"
            key={field.id}
            marginTop={2}
            hidden={field.initial}
          >
            <Controller
              name={initialField}
              control={control}
              defaultValue={field.initial || false}
              render={() => <input type="hidden" />}
            />
            <Controller
              name={enabledField}
              control={control}
              defaultValue={true}
              render={() => <input type="hidden" />}
            />
            <Text variant="h4">{formatMessage(m.stocksTitle)}</Text>
            <Box position="absolute" className={styles.removeFieldButton}>
              <Button
                variant="ghost"
                size="small"
                circle
                icon="remove"
                onClick={handleRemoveStock.bind(null, index)}
              />
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
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={rateOfExchangeField}
                  name={rateOfExchangeField}
                  label={formatMessage(m.stocksRateOfChange)}
                  defaultValue={field.rateOfExchange}
                  placeholder="0"
                  error={fieldError?.rateOfExchange}
                  size="sm"
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
                  readOnly
                />
              </GridColumn>
            </GridRow>
          </Box>
        )
      })}
      <Box marginTop={1}>
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
    </Box>
  )
}

export default StocksRepeater
