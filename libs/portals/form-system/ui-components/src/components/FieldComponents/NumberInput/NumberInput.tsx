import { FormSystemField } from '@island.is/api/schema'
import { Box, Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
}

export const NumberInput = ({ item, dispatch }: Props) => {
  const { fieldSettings } = item
  const { control, trigger } = useFormContext()
  const { lang, formatMessage } = useLocale()
  const { hasDescription } = fieldSettings || {}

  const defaultNumberValue = (() => {
    const v = getValue(item, 'number')
    if (v === null || v === undefined || v === '') return ''
    const n = typeof v === 'number' ? v : Number(v)
    return Number.isFinite(n) ? n : ''
  })()

  return (
    <Box>
      <Controller
        key={item.id}
        name={item.id}
        control={control}
        defaultValue={defaultNumberValue}
        rules={{
          required: {
            value: item.isRequired ?? false,
            message: formatMessage(m.required),
          },
        }}
        render={({ field, fieldState }) => (
          <Input
            label={item?.name?.[lang] ?? ''}
            name={field.name}
            type="number"
            required={item.isRequired ?? false}
            tooltip={
              hasDescription ? item?.description?.[lang] ?? '' : undefined
            }
            backgroundColor="blue"
            value={field.value ?? ''}
            onChange={(e) => {
              const raw = e.target.value

              // Keep empty as empty, otherwise coerce to an integer
              const parsed = parseInt(raw, 10)
              const nextValue =
                raw === '' ? '' : Number.isNaN(parsed) ? '' : parsed

              field.onChange(nextValue)

              if (dispatch) {
                dispatch({
                  type: 'SET_NUMBER',
                  payload: {
                    id: item.id,
                    value: nextValue === '' ? null : nextValue,
                  },
                })
              }
              if (nextValue !== '') trigger(item.id)
            }}
            onBlur={(e) => {
              if (e.target.value === null || e.target.value === '') {
                field.onChange('')
              }
              field.onBlur()
            }}
            errorMessage={fieldState.error?.message}
          />
        )}
      />
    </Box>
  )
}
