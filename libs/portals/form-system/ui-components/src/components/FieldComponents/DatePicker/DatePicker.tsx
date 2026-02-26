import { FormSystemField } from '@island.is/api/schema'
import { Dispatch } from 'react'
import { Action } from '../../../lib'
import { m } from '../../../lib/messages'
import { useIntl } from 'react-intl'
import { getValue } from '../../../lib/getValue'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import { DatePicker } from '@island.is/island-ui/core'
import { Controller, useFormContext } from 'react-hook-form'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  lang: 'is' | 'en'
}
const df = 'yyyy-MM-dd'
export const DatePickerField = ({ item, dispatch, lang = 'is' }: Props) => {
  const { formatMessage } = useIntl()
  const { control, clearErrors } = useFormContext()

  const handleDateChange = (dateString: string) => {
    if (dispatch) {
      const date = dateString ? parseISO(dateString) : null
      dispatch({
        type: 'SET_DATE',
        payload: {
          id: item.id,
          value: date,
        },
      })
    }
  }

  return (
    <Controller
      key={item.id}
      name={item.id}
      control={control}
      defaultValue={getValue(item, 'date')}
      rules={{
        required: {
          value: item.isRequired ?? false,
          message: formatMessage(m.required),
        },
      }}
      render={({
        field: { onChange: onControllerChange, value },
        fieldState,
      }) => (
        <DatePicker
          label={item.name[lang] ?? ''}
          placeholderText={formatMessage(m.chooseDate)}
          id={item.id}
          locale={lang}
          backgroundColor="blue"
          handleChange={(date) => {
            clearErrors(item.id)
            if (!(date instanceof Date) || isNaN(date.getTime())) {
              return
            }
            const newVal = format(date, df)
            onControllerChange(newVal)
            handleDateChange(newVal)
          }}
          minDate={new Date(1970, 0)}
          required={item.isRequired ?? false}
          errorMessage={fieldState.error ? fieldState.error.message : undefined}
          hasError={!!fieldState.error}
          selected={value ? parseISO(value) : undefined}
        />
      )}
    />
  )
}
