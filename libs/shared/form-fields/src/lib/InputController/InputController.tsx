import React, { FC } from 'react'
import { Input, InputBackgroundColor } from '@island.is/island-ui/core'
import { Controller } from 'react-hook-form'
import NumberFormat, { FormatInputValueFunction } from 'react-number-format'

interface Props {
  autoFocus?: boolean
  defaultValue?: string
  disabled?: boolean
  error?: string
  id: string
  label?: string
  name?: string
  onChange?: (
    event?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  placeholder?: string
  textarea?: boolean
  backgroundColor?: InputBackgroundColor
  currency?: boolean
  type?: 'text' | 'email' | 'number' | 'tel'
  suffix?: string
  rows?: number
  format?: string | FormatInputValueFunction
  required?: boolean
}

interface ChildParams {
  value?: string
  onBlur: () => void
  onChange: (...event: any[]) => void
  name: string
}

export const InputController: FC<Props> = ({
  autoFocus,
  defaultValue,
  disabled = false,
  error,
  id,
  label,
  name = id,
  placeholder,
  backgroundColor,
  textarea,
  currency,
  type = 'text',
  format,
  onChange: onInputChange,
  suffix,
  rows,
  required,
}) => {
  function renderChildInput(c: ChildParams) {
    const { value, onChange, ...props } = c
    if (currency) {
      return (
        <NumberFormat
          customInput={Input}
          id={id}
          disabled={disabled}
          placeholder={placeholder}
          label={label}
          type="text"
          decimalSeparator=","
          backgroundColor={backgroundColor}
          thousandSeparator="."
          suffix=" kr."
          value={value}
          format={format}
          onValueChange={({ value }) => {
            onChange(value)
            if (onInputChange) {
              onInputChange()
            }
          }}
          hasError={error !== undefined}
          errorMessage={error}
          required={required}
          {...props}
        />
      )
    } else if (type === 'number' && suffix) {
      return (
        <NumberFormat
          customInput={Input}
          id={id}
          disabled={disabled}
          backgroundColor={backgroundColor}
          placeholder={placeholder}
          label={label}
          suffix={suffix}
          value={value}
          format={format}
          onValueChange={({ value }) => {
            onChange(value)
            if (onInputChange) {
              onInputChange()
            }
          }}
          hasError={error !== undefined}
          errorMessage={error}
          required={required}
          {...props}
        />
      )
    } else if (format && ['text', 'tel'].includes(type)) {
      return (
        <NumberFormat
          customInput={Input}
          id={id}
          disabled={disabled}
          backgroundColor={backgroundColor}
          placeholder={placeholder}
          label={label}
          type={type as 'text' | 'tel'}
          value={value}
          format={format}
          onValueChange={({ value }) => {
            onChange(value)
            if (onInputChange) {
              onInputChange()
            }
          }}
          hasError={error !== undefined}
          errorMessage={error}
          required={required}
          {...props}
        />
      )
    } else {
      return (
        <Input
          id={id}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          label={label}
          backgroundColor={backgroundColor}
          autoFocus={autoFocus}
          hasError={error !== undefined}
          errorMessage={error}
          required={required}
          textarea={textarea}
          type={type}
          onChange={(e) => {
            onChange(e.target.value)
            if (onInputChange) {
              onInputChange(e)
            }
          }}
          rows={rows}
          {...props}
        />
      )
    }
  }

  return (
    <Controller
      name={name}
      {...(defaultValue !== undefined && { defaultValue })}
      render={renderChildInput}
    />
  )
}

export default InputController
