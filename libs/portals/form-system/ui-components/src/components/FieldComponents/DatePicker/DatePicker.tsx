import { FormSystemField } from '@island.is/api/schema'
import { Dispatch } from 'react'
import { Action } from '../../../lib'
import { m } from '../../../lib/messages'
import { useIntl } from 'react-intl'
import { getValue } from '../../../lib/getValue'
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'
import max from 'date-fns/max'
import min from 'date-fns/min'
import parseISO from 'date-fns/parseISO'
import startOfDay from 'date-fns/startOfDay'
import { DatePicker } from '@island.is/island-ui/core'
import { Controller, useFormContext } from 'react-hook-form'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  lang: 'is' | 'en'
  valueIndex?: number
}
const df = 'yyyy-MM-dd'

export const DatePickerField = ({
  item,
  dispatch,
  lang = 'is',
  valueIndex = 0,
}: Props) => {
  const { formatMessage } = useIntl()
  const { control, trigger } = useFormContext()
  const fieldName = `${item.id}.${valueIndex}`
  const today = startOfDay(new Date())
  const settings = item.fieldSettings
  const fixedMinDate = settings?.minDate
    ? parseISO(settings.minDate)
    : undefined
  const fixedMaxDate = settings?.maxDate
    ? parseISO(settings.maxDate)
    : undefined
  const minDate =
    settings?.minDateDaysFromToday != null
      ? addDays(today, settings.minDateDaysFromToday)
      : fixedMinDate ?? new Date(1970, 0)
  const maxDate =
    settings?.maxDateDaysFromToday != null
      ? addDays(today, settings.maxDateDaysFromToday)
      : fixedMaxDate

  const handleDateChange = (dateString: string) => {
    if (dispatch) {
      const date = dateString ? parseISO(dateString) : null
      dispatch({
        type: 'SET_DATE',
        payload: {
          id: item.id,
          value: date,
          valueIndex,
        },
      })
    }
  }

  const rawDefault = getValue(item, 'date', valueIndex)
  const defaultValue =
    rawDefault instanceof Date ? format(rawDefault, df) : rawDefault

  return (
    <Controller
      key={`${item.id}-${valueIndex}`}
      name={fieldName}
      control={control}
      defaultValue={defaultValue}
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
            if (!(date instanceof Date) || isNaN(date.getTime())) {
              onControllerChange('')
              handleDateChange('')
              trigger(fieldName)
              return
            }
            const newVal = format(date, df)
            onControllerChange(newVal)
            handleDateChange(newVal)
            trigger(fieldName)
          }}
          minDate={fixedMinDate ? max([fixedMinDate, minDate]) : minDate}
          maxDate={
            fixedMaxDate && maxDate ? min([fixedMaxDate, maxDate]) : maxDate
          }
          required={item.isRequired ?? false}
          errorMessage={fieldState.error ? fieldState.error.message : undefined}
          hasError={!!fieldState.error}
          selected={
            value instanceof Date
              ? value
              : typeof value === 'string' && value
              ? parseISO(value)
              : undefined
          }
          handleClear={() => {
            onControllerChange('')
            handleDateChange('')
            trigger(fieldName)
          }}
          isClearable={!item.isRequired}
        />
      )}
    />
  )
}
