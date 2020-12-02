import React, { FC } from 'react'
import { Input } from '@island.is/island-ui/core'
import { useFormContext, Controller } from 'react-hook-form'
import NumberFormat, { FormatInputValueFunction } from 'react-number-format'

interface Props {
  autoFocus?: boolean
  disabled?: boolean
  error?: string
  id: string
  label?: string
  name?: string
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  placeholder?: string
  textarea?: boolean
  currency?: boolean
  type?: 'text' | 'email' | 'number' | 'tel'
  format?: string | FormatInputValueFunction
}

export const InputController: FC<Props> = ({
  autoFocus,
  disabled = false,
  error,
  id,
  label,
  name = id,
  placeholder,
  textarea,
  currency,
  type = 'text',
  format,
  onChange,
}) => {
  const { register } = useFormContext()

  if (currency) {
    return (
      <Controller
        name={name}
        render={({ value, onChange }) => (
          <NumberFormat
            customInput={Input}
            id={id}
            disabled={disabled}
            name={name}
            placeholder={placeholder}
            label={label}
            type="text"
            decimalSeparator=","
            thousandSeparator="."
            suffix=" kr."
            value={value}
            format={format}
            onValueChange={({ value }) => {
              onChange(value)
            }}
            hasError={error !== undefined}
            errorMessage={error}
          />
        )}
      />
    )
  }

  if (format && ['text', 'tel'].includes(type)) {
    return (
      <Controller
        name={name}
        render={({ value, onChange }) => (
          <NumberFormat
            customInput={Input}
            id={id}
            disabled={disabled}
            name={name}
            placeholder={placeholder}
            label={label}
            type={type as 'text' | 'tel'}
            value={value}
            format={format}
            onValueChange={({ value }) => {
              onChange(value)
            }}
            hasError={error !== undefined}
            errorMessage={error}
          />
        )}
      />
    )
  }

  return (
    <Input
      id={id}
      disabled={disabled}
      name={name}
      placeholder={placeholder}
      label={label}
      ref={register}
      autoFocus={autoFocus}
      hasError={error !== undefined}
      errorMessage={error}
      textarea={textarea}
      type={type}
      onChange={onChange}
    />
  )
}

export default InputController
