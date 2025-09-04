import { Dispatch } from 'react'
import { Input, Stack } from '@island.is/island-ui/core'
import { FormSystemField } from '@island.is/api/schema'
import { useIntl } from 'react-intl'
import { m } from '../../../lib/messages'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'
import { useFormContext, Controller } from 'react-hook-form'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  lang?: 'is' | 'en'
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const Email = ({ item, dispatch, lang = 'is' }: Props) => {
  const { formatMessage } = useIntl()
  const { control } = useFormContext()

  return (
    <Stack space={2}>
      <Controller
        name={`${item.id}.email`}
        control={control}
        defaultValue={getValue(item, 'email') ?? ''}
        rules={{
          required: {
            value: item?.isRequired ?? false,
            message: formatMessage(m.required),
          },
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
            value={field.value}
            onChange={(e) => {
              field.onChange(e)
              if (dispatch) {
                dispatch({
                  type: 'SET_EMAIL',
                  payload: {
                    id: item.id,
                    value: e.target.value,
                  },
                })
              }
            }}
            onBlur={field.onBlur}
            errorMessage={fieldState.error?.message}
            required={item?.isRequired ?? false}
            backgroundColor="blue"
          />
        )}
      />
    </Stack>
  )
}
