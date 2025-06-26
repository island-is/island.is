import { FormSystemField } from '@island.is/api/schema'
import { Dispatch } from 'react'
import { Action } from '../../../lib'
import { DatePicker as DatePickerCore } from '@island.is/island-ui/core'
import { m } from '../../../lib/messages'
import { useIntl } from 'react-intl'
import { getValue } from '../../../lib/getValue'
import { parseISO } from 'date-fns'
import { useFormContext, Controller } from 'react-hook-form'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  lang: 'is' | 'en'
}

export const DatePicker = ({ item, dispatch, lang = 'is' }: Props) => {
  const { formatMessage } = useIntl()
  const { control } = useFormContext()

  return (
    <Controller
      name={item.id}
      control={control}
      defaultValue={(() => {
        const dateValue = getValue(item, 'date')
        if (!dateValue) return null
        try {
          return parseISO(dateValue)
        } catch {
          return null
        }
      })()}
      rules={{
        required: {
          value: item.isRequired ?? false,
          message: formatMessage(m.required),
        },
        validate: (value) =>
          (value !== null && value !== '') || formatMessage(m.required),
      }}
      render={({ field, fieldState }) => (
        <DatePickerCore
          label={item.name[lang] ?? ''}
          placeholderText={formatMessage(m.chooseDate)}
          backgroundColor="blue"
          handleChange={(date: Date) => {
            field.onChange(date)
            if (dispatch) {
              dispatch({
                type: 'SET_DATE',
                payload: {
                  id: item.id,
                  value: date,
                },
              })
            }
          }}
          selected={field.value ?? null}
          required={item.isRequired}
          errorMessage={fieldState.error?.message}
        />
      )}
    />
  )
}
