import { FormSystemField } from '@island.is/api/schema'
import { Input, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  valueIndex?: number
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const Email = ({ item, dispatch, valueIndex = 0 }: Props) => {
  const { formatMessage, lang } = useLocale()
  const { control } = useFormContext()

  return (
    <Stack space={2}>
      <Controller
        key={`${item.id}-${valueIndex}`}
        name={`${item.id}.${valueIndex}`}
        control={control}
        defaultValue={getValue(item, 'email', valueIndex) ?? ''}
        rules={{
          required: item?.isRequired
            ? { value: true, message: formatMessage(m.required) }
            : false,
          pattern: {
            value: EMAIL_REGEX,
            message: formatMessage(m.invalidEmail),
          },
        }}
        render={({ field, fieldState }) => (
          <Input
            type="email"
            name={field.name}
            label={item.name?.[lang] ?? ''}
            value={field.value ?? ''}
            onChange={(e) => {
              field.onChange(e)
              dispatch?.({
                type: 'SET_EMAIL',
                payload: { id: item.id, value: e.target.value, valueIndex },
              })
            }}
            onBlur={field.onBlur}
            errorMessage={fieldState.error?.message}
            required={!!item?.isRequired}
            backgroundColor="blue"
          />
        )}
      />
    </Stack>
  )
}
