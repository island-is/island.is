import { FormSystemField } from '@island.is/api/schema'
import { Input, Stack } from '@island.is/island-ui/core'
import { Dispatch } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  lang?: 'is' | 'en'
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const Email = ({ item, dispatch, lang = 'is' }: Props) => {
  const { formatMessage } = useIntl()
  const { control } = useFormContext()
  const safeId = item.id.replace(/[^a-zA-Z0-9_]/g, '_')
  const fieldName = `emails.${safeId}`
  return (
    <Stack space={2}>
      <Controller
        key={fieldName}
        name={fieldName}
        control={control}
        defaultValue={getValue(item, 'email') ?? ''}
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
                payload: { id: item.id, value: e.target.value },
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
