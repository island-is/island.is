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

interface Props {
  defaultValue?: string
  error?: string
  id: string
  disabled?: boolean
  name?: string
  locale?: Locale
  label: string
  placeholder?: string
  backgroundColor?: DatePickerBackgroundColor
  maxDate?: DatePickerProps['maxDate']
  minDate?: DatePickerProps['minDate']
  excludeDates?: DatePickerProps['excludeDates']
}

const df = 'yyyy-MM-dd'

export const DatePickerController: FC<Props> = ({
  error,
  defaultValue,
  disabled = false,
  id,
  name = id,
  locale,
  label,
  placeholder,
  backgroundColor,
  maxDate,
  minDate,
  excludeDates,
}) => {
  const { clearErrors, setValue } = useFormContext()

  return (
    <Controller
      defaultValue={defaultValue}
      name={name}
      render={({ onChange, value }) => (
        <DatePicker
          hasError={error !== undefined}
          disabled={disabled}
          id={id}
          errorMessage={error}
          locale={locale}
          label={label}
          placeholderText={placeholder}
          backgroundColor={backgroundColor}
          selected={value ? parseISO(value) : undefined}
          maxDate={maxDate}
          minDate={minDate}
          excludeDates={excludeDates}
          handleChange={(date) => {
            clearErrors(id)
            const newVal = format(date, df)
            onChange(newVal)
            setValue(name, newVal)
          }}
        />
      )}
    />
  )
}

export default DatePickerController
