import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import { DatePicker } from '@island.is/island-ui/core'

interface Props {
  defaultValue?: string
  error?: string
  id: string
  disabled?: boolean
  name?: string
  label: string
  placeholder?: string
}
const df = 'yyyy-MM-dd'
export const DatePickerController: FC<Props> = ({
  error,
  defaultValue,
  disabled = false,
  id,
  name = id,
  label,
  placeholder,
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
          label={label}
          placeholderText={placeholder}
          selected={value ? parseISO(value) : undefined}
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
