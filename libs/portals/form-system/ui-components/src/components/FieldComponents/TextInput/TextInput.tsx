import { FormSystemField } from '@island.is/api/schema'
import { Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
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
  const { formatMessage } = useIntl()
  const { lang } = useLocale()

  return (
    <Controller
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
          textarea={fieldSettings?.isLarge ?? false}
          required={item.isRequired ?? false}
          backgroundColor="blue"
          value={field.value}
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
  )
}
