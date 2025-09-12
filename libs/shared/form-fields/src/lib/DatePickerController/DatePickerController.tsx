import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

import {
  DatePicker,
  DatePickerBackgroundColor,
  DatePickerProps,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import { clearInputsOnChange } from '@island.is/shared/utils'

interface Props {
  defaultValue?: string
  error?: string
  id: string
  disabled?: boolean
  name?: string
  locale?: Locale
  label: string
  size?: DatePickerProps['size']
  placeholder?: string
  backgroundColor?: DatePickerBackgroundColor
  maxDate?: DatePickerProps['maxDate']
  minDate?: DatePickerProps['minDate']
  minYear?: number
  maxYear?: number
  excludeDates?: DatePickerProps['excludeDates']
  onChange?: (_: string) => void
  required?: boolean
  readOnly?: boolean
  calendarStartDay?: number
  clearOnChange?: string[]
}

const df = 'yyyy-MM-dd'

export const DatePickerController: FC<React.PropsWithChildren<Props>> = ({
  error,
  defaultValue,
  disabled = false,
  id,
  name = id,
  locale,
  label,
  size,
  placeholder,
  backgroundColor,
  maxDate,
  minDate,
  excludeDates,
  required,
  minYear,
  maxYear,
  readOnly,
  onChange = () => undefined,
  calendarStartDay = 0,
  clearOnChange,
}) => {
  const { clearErrors, setValue } = useFormContext()

  return (
    <Controller
      defaultValue={defaultValue}
      name={name}
      render={({ field: { onChange: onControllerChange, value } }) => (
        <DatePicker
          hasError={error !== undefined}
          disabled={disabled}
          size={size}
          id={id}
          errorMessage={error}
          required={required}
          locale={locale}
          label={label}
          placeholderText={placeholder}
          backgroundColor={backgroundColor}
          selected={value ? parseISO(value) : undefined}
          maxDate={maxDate}
          minDate={minDate}
          minYear={minYear}
          maxYear={maxYear}
          excludeDates={excludeDates}
          readOnly={readOnly}
          calendarStartDay={calendarStartDay}
          handleChange={(date) => {
            clearErrors(id)
            if (!(date instanceof Date) || isNaN(date.getTime())) {
              return
            }
            const newVal = format(date, df)
            onControllerChange(newVal)
            setValue(name, newVal)
            onChange(newVal)
            if (clearOnChange) {
              clearInputsOnChange(clearOnChange, setValue)
            }
          }}
        />
      )}
    />
  )
}

export default DatePickerController
