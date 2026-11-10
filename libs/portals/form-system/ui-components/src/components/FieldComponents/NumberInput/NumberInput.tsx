import { FormSystemField } from '@island.is/api/schema'
import { Box, Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  valueIndex?: number
}

export const NumberInput = ({ item, dispatch, valueIndex = 0 }: Props) => {
  const { fieldSettings } = item
  const { control, trigger, getFieldState } = useFormContext()
  const { lang, formatMessage } = useLocale()
  const { hasDescription, minLength, maxLength } = fieldSettings || {}

  const defaultNumberValue: number | '' = (() => {
    const v = getValue(item, 'number', valueIndex)
    if (v === null || v === undefined || v === '') return ''
    const n = typeof v === 'number' ? v : Number(v)
    return Number.isFinite(n) ? n : ''
  })()

  const isDecimal = fieldSettings?.isDecimal ?? false
  const minValue = fieldSettings?.minValue ?? Number.MIN_SAFE_INTEGER
  const maxValue = fieldSettings?.maxValue ?? Number.MAX_SAFE_INTEGER
  const fieldName = `${item.id}.${valueIndex}`

  useEffect(() => {
    const { isDirty, isTouched } = getFieldState(fieldName)
    if (isDirty || isTouched) {
      void trigger(fieldName)
    }
  }, [
    fieldName,
    minLength,
    maxLength,
    minValue,
    maxValue,
    getFieldState,
    trigger,
  ])

  return (
    <Box>
      <Controller
        key={`${item.id}-${valueIndex}`}
        name={`${item.id}.${valueIndex}`}
        control={control}
        defaultValue={defaultNumberValue}
        rules={{
          required: {
            value: item.isRequired ?? false,
            message: formatMessage(m.required),
          },
          min: {
            value: minValue,
            message: formatMessage(m.minValue, { minValue: minValue }),
          },
          max: {
            value: maxValue,
            message: formatMessage(m.maxValue, { maxValue: maxValue }),
          },
          validate: (value) => {
            if (value === '' || value === null || value === undefined) {
              return true
            }
            const digitCount = Number(value)
              .toLocaleString('en-US', {
                useGrouping: false,
                maximumSignificantDigits: 21,
              })
              .replace(/\D/g, '').length

            if (
              minLength != null &&
              minLength === maxLength &&
              digitCount !== minLength
            ) {
              return formatMessage(m.exactNumberLength, { length: minLength })
            }
            if (minLength != null && digitCount < minLength) {
              return formatMessage(m.minNumberLength, { minLength })
            }
            if (maxLength != null && digitCount > maxLength) {
              return formatMessage(m.maxNumberLength, { maxLength })
            }
            return true
          },
        }}
        render={({ field, fieldState }) => (
          <Input
            label={item?.name?.[lang] ?? ''}
            name={field.name}
            type="number"
            max={maxValue}
            min={minValue}
            required={item.isRequired ?? false}
            tooltip={
              hasDescription ? item?.description?.[lang] ?? '' : undefined
            }
            backgroundColor="blue"
            value={field.value ?? ''}
            onChange={(e) => {
              const raw = e.target.value
              if (
                maxLength != null &&
                raw.replace(/\D/g, '').length > maxLength
              ) {
                return
              }
              const parsed = isDecimal ? parseFloat(raw) : parseInt(raw, 10)

              const nextValue =
                raw === '' ? '' : Number.isNaN(parsed) ? '' : parsed

              field.onChange(nextValue)

              if (dispatch) {
                dispatch({
                  type: 'SET_NUMBER',
                  payload: {
                    id: item.id,
                    value: nextValue === '' ? null : nextValue,
                    valueIndex,
                  },
                })
              }
              if (nextValue !== '') trigger(field.name)
            }}
            onBlur={(e) => {
              if (e.target.value === null || e.target.value === '') {
                field.onChange('')
              }

              field.onBlur()
              void trigger(field.name)
            }}
            errorMessage={fieldState.error?.message}
          />
        )}
      />
    </Box>
  )
}
