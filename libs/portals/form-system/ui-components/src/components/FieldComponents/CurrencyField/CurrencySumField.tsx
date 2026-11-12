import { FormSystemField } from '@island.is/api/schema'
import { FieldTypesEnum } from '@island.is/form-system/enums'
import {
  GridColumn as Column,
  Input,
  GridRow as Row,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch, useEffect, useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import NumberFormat from 'react-number-format'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'
import { m } from '../../../lib/messages'
import { ApplicationState } from '../../../lib/reducerTypes'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  state?: ApplicationState
  valueIndex?: number
}

export const CurrencySumField = ({
  item,
  dispatch,
  state,
  valueIndex = 0,
}: Props) => {
  const { currentScreen } = state || {}
  const { formatMessage, lang } = useLocale()
  const label = item?.name?.[lang]
  const { control, setValue } = useFormContext()
  const isPartOfMultiset = item.isPartOfMultiset === true
  const fieldName = isPartOfMultiset ? `${item.id}.${valueIndex}` : item.id

  const sum = useMemo(() => {
    const fields = currentScreen?.data?.fields ?? []

    const currentSumFieldIndex = fields.findIndex(
      (field) => field?.id === item.id,
    )

    if (currentSumFieldIndex === -1) return ''

    let previousSumFieldIndex = -1

    for (let idx = currentSumFieldIndex - 1; idx >= 0; idx--) {
      if (fields[idx]?.fieldType === FieldTypesEnum.ISK_SUMBOX) {
        previousSumFieldIndex = idx
        break
      }
    }

    const fieldsToSum = isPartOfMultiset
      ? fields.slice(previousSumFieldIndex + 1, currentSumFieldIndex)
      : fields

    let hasValue = false

    const total = fieldsToSum.reduce((total, field) => {
      if (field?.fieldType !== FieldTypesEnum.ISK_NUMBERBOX) return total
      if (isPartOfMultiset && field.isPartOfMultiset === false) return total

      const valueCount = field.values?.length ?? 0
      const firstValueIndex = isPartOfMultiset ? valueIndex : 0
      const lastValueIndex = isPartOfMultiset ? valueIndex + 1 : valueCount

      let fieldTotal = 0

      for (let idx = firstValueIndex; idx < lastValueIndex; idx++) {
        const value = getValue(field, 'iskNumber', idx)

        if (!value) continue

        const numericValue = parseInt(String(value).replace(/\./g, ''), 10)

        if (!Number.isNaN(numericValue)) {
          hasValue = true
          fieldTotal += numericValue
        }
      }

      return total + fieldTotal
    }, 0)

    return hasValue ? total : ''
  }, [currentScreen?.data?.fields, item.id, isPartOfMultiset, valueIndex])

  const formattedSum =
    sum === '' ? '' : sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  useEffect(() => {
    setValue(fieldName, formattedSum)

    if (dispatch) {
      dispatch({
        type: 'SET_CURRENCY',
        payload: {
          value: formattedSum,
          id: item.id,
          valueIndex: isPartOfMultiset ? valueIndex : 0,
        },
      })
    }
  }, [
    dispatch,
    formattedSum,
    item.id,
    setValue,
    fieldName,
    isPartOfMultiset,
    valueIndex,
  ])

  return (
    <Row marginTop={2}>
      <Column span="10/10">
        <Controller
          key={fieldName}
          name={fieldName}
          control={control}
          defaultValue=""
          rules={{
            required: {
              value: item?.isRequired ?? false,
              message: formatMessage(m.required),
            },
            pattern: {
              value: /^\d{1,3}(\.\d{3})*$/,
              message: formatMessage(m.onlyNumbers),
            },
          }}
          render={({ field, fieldState }) => (
            <NumberFormat
              customInput={Input}
              label={label ?? ''}
              name={field.name}
              value={formattedSum}
              suffix=" kr."
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={0}
              allowNegative={false}
              type="text"
              inputMode="numeric"
              readOnly
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      </Column>
    </Row>
  )
}
