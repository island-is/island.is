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

export const TextInput = ({ item, dispatch }: Props) => {
  const { fieldSettings } = item
  const { control } = useFormContext()
  const { lang, formatMessage } = useLocale()
  const { isLarge, maxLength: maxL, hasDescription } = fieldSettings || {}
  const maxLength = maxL === undefined || maxL === 0 ? -1 : maxL
  return (
    <Box>
      {isLarge && maxLength && maxLength > 0 && (
        <Box display="flex" justifyContent={'flexEnd'}>
          <Text variant="eyebrow">{`${
            getValue(item, 'text')?.length ?? 0
          }/${maxLength}`}</Text>
        </Box>
      )}
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
            textarea={isLarge ?? false}
            required={item.isRequired ?? false}
            maxLength={maxLength ?? -1}
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
