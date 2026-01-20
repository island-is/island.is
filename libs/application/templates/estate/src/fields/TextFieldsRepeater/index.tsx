import { FC, useCallback, useEffect, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { InputController } from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/types'
import NumberFormat from 'react-number-format'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  Text,
  Input,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import * as styles from '../styles.css'
import { useLocale } from '@island.is/localization'
import { Field, Props } from './utils'
import { ErrorValue } from '../../types'

const stocksValueKeys = ['rateOfExchange', 'faceValue']
const bankAccountsValueKeys = ['balance', 'accruedInterest']

export const TextFieldsRepeater: FC<
  React.PropsWithChildren<FieldBaseProps & Props>
> = ({ field, errors }) => {
  const [, updateState] = useState<unknown>()
  const forceUpdate = useCallback(() => updateState({}), [])
  const { id, props } = field
  const { fields, append, remove, replace } = useFieldArray({
    name: id,
  })
  const { setValue, getValues, clearErrors } = useFormContext()
  const { formatMessage } = useLocale()

  const [total, setTotal] = useState(0)

  const calculateTotal = useCallback(() => {
    const values = getValues(id)

    if (!values) {
      return
    }

    const total = values.reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (acc: number, current: any) =>
        Number(acc) + Number(current[props.sumField]),
      0,
    )

    setTotal(total)
  }, [getValues, id, props.sumField])

  useEffect(() => {
    calculateTotal()
  }, [fields, calculateTotal])

  const handleAddRepeaterFields = useCallback(() => {
    const values = props.fields.map((field: Field) => {
      return Object.values(field)[1]
    })

    const repeaterFields = values.reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (acc: Record<string, string>, elem: any) => {
        acc[elem] = ''
        return acc
      },
      {},
    )

    if (fields.length === 0) {
      replace(repeaterFields)
    } else {
      append(repeaterFields)
    }
  }, [append, fields.length, props.fields, replace])

  useEffect(() => {
    if (fields.length === 0) {
      handleAddRepeaterFields()
    }
  }, [fields.length, handleAddRepeaterFields])

  const updateStocksValue = (fieldIndex: string) => {
    const stockValues: { faceValue?: string; rateOfExchange?: string } =
      getValues(fieldIndex)

    const faceValue = parseFloat(
      stockValues?.faceValue?.replace(/[^\d.]/g, '') || '0',
    )
    const rateOfExchange = parseFloat(
      stockValues?.rateOfExchange?.replace(/[^\d.]/g, '') || '0',
    )

    if (!faceValue || !rateOfExchange) {
      setValue(`${fieldIndex}.value`, '')
      forceUpdate()
      return
    }

    const total = faceValue * rateOfExchange
    const totalString = total.toFixed(0)

    setValue(`${fieldIndex}.value`, totalString)

    if (total > 0) {
      clearErrors(`${fieldIndex}.value`)
    }

    forceUpdate()
  }

  const updateBankAccountTotalValue = (fieldIndex: string) => {
    const bankAccountValues = getValues(fieldIndex)
    const balance = bankAccountValues?.balance?.replace(/[^\d.]/g, '') || '0'
    const accruedInterest =
      bankAccountValues?.accruedInterest?.replace(/[^\d.]/g, '') || '0'

    const accountTotal = parseFloat(balance) + parseFloat(accruedInterest)
    setValue(`${fieldIndex}.accountTotal`, accountTotal ?? '0')
    forceUpdate()
    calculateTotal()
  }

  return (
    <Box>
      {/* All types of fields */}
      {fields.map((repeaterField: any, index) => {
        const fieldIndex = `${id}[${index}]`

        return (
          <Box
            position="relative"
            key={repeaterField.id}
            marginTop={2}
            hidden={repeaterField.initial}
          >
            {/* Remove field button */}
            {fields.length > 1 && (
              <>
                <Text variant="h4" marginBottom={2}>
                  {formatMessage(props.repeaterHeaderText)}
                </Text>
                <Box position="absolute" className={styles.removeFieldButton}>
                  <Button
                    variant="ghost"
                    size="small"
                    circle
                    icon="remove"
                    onClick={() => {
                      remove(index)
                      calculateTotal()
                    }}
                  />
                </Box>
              </>
            )}

            <GridRow>
              {props.fields.map((field: Field) => {
                const key = `${id}.${field.id}`

                if (key === 'stocks.value') {
                  const value = getValues(fieldIndex)?.value ?? ''
                  const newValue = parseFloat(value)
                  return (
                    <GridColumn
                      span={['1/1', '1/2']}
                      paddingBottom={2}
                      key={field.id}
                    >
                      <NumberFormat
                        customInput={Input}
                        id={`${fieldIndex}.${field.id}`}
                        name={`${fieldIndex}.${field.id}`}
                        readOnly
                        label={formatMessage(field.title)}
                        placeholder={field.placeholder}
                        value={newValue}
                        type="text"
                        decimalScale={6}
                        decimalSeparator=","
                        backgroundColor="blue"
                        thousandSeparator="."
                        suffix=" kr."
                        autoComplete="off"
                      />
                    </GridColumn>
                  )
                }

                return (
                  <GridColumn
                    span={['1/1', '1/2']}
                    paddingBottom={2}
                    key={field.id}
                  >
                    <InputController
                      id={`${fieldIndex}.${field.id}`}
                      name={`${fieldIndex}.${field.id}`}
                      defaultValue={repeaterField[field.id] || ''}
                      format={field.format}
                      label={formatMessage(field.title)}
                      placeholder={field.placeholder}
                      backgroundColor={
                        field.backgroundColor ? field.backgroundColor : 'blue'
                      }
                      currency={field.currency}
                      readOnly={field.readOnly}
                      type={field.type}
                      error={
                        !!errors &&
                        errors[id] &&
                        (errors[id] as ErrorValue)[index]
                          ? (errors[id] as ErrorValue)[index][field.id]
                          : undefined
                      }
                      onChange={() => {
                        if (stocksValueKeys.includes(field.id)) {
                          updateStocksValue(fieldIndex)
                        }
                        if (bankAccountsValueKeys.includes(field.id)) {
                          updateBankAccountTotalValue(fieldIndex)
                        }
                        if (props.sumField === field.id) {
                          calculateTotal()
                        }
                      }}
                    />
                  </GridColumn>
                )
              })}
            </GridRow>
          </Box>
        )
      })}

      {/* Total field */}
      {!!fields.length && props.sumField && (
        <Box marginTop={5} marginBottom={3}>
          <GridRow>
            <GridColumn span={['1/1', '1/2']}>
              {props.currency ? (
                <NumberFormat
                  customInput={Input}
                  id={`${id}.total`}
                  name={`${id}.total`}
                  label={formatMessage(m.total)}
                  type="text"
                  decimalSeparator=","
                  thousandSeparator="."
                  suffix=" kr."
                  value={String(total)}
                  readOnly={true}
                />
              ) : (
                <Input
                  id={`${id}.total`}
                  name={`${id}.total`}
                  label={formatMessage(m.total)}
                  type="text"
                  value={String(total)}
                  readOnly={true}
                />
              )}
            </GridColumn>
          </GridRow>
        </Box>
      )}

      {/* Add field button */}
      <Box marginTop={2}>
        <Button
          variant="text"
          icon="add"
          iconType="outline"
          onClick={handleAddRepeaterFields}
          size="small"
        >
          {formatMessage(props.repeaterButtonText)}
        </Button>
      </Box>
    </Box>
  )
}

export default TextFieldsRepeater
