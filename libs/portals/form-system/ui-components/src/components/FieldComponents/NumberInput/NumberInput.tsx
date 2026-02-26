import { FormSystemField } from '@island.is/api/schema'
import { Box, Input, Text } from '@island.is/island-ui/core'
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
  const { control } = useFormContext()
  const { lang, formatMessage } = useLocale()
  const { minValue, maxValue, hasDescription } = fieldSettings || {}
  return (
    <Box>
      <Controller
        key={item.id}
        name={item.id}
        control={control}
        defaultValue={getValue(item, 'text') ?? ''}
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
            inputMode="numeric"
            required={item.isRequired ?? false}
            tooltip={
              hasDescription ? item?.description?.[lang] ?? '' : undefined
            }
            backgroundColor="blue"
            value={getValue(item, 'text') ?? ''}
            onChange={(e) => {
              field.onChange(e)
              if (dispatch) {
                dispatch({
                  type: 'SET_TEXT',
                  payload: {
                    id: item.id,
                    value: e.target.value,
                  },
                })
              }
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
