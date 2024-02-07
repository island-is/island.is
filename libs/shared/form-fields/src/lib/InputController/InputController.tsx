import React, { forwardRef } from 'react'
import { Input, Icon, InputBackgroundColor } from '@island.is/island-ui/core'
import { Controller, Control, RegisterOptions } from 'react-hook-form'
import NumberFormat, { FormatInputValueFunction } from 'react-number-format'
import { TestSupport } from '@island.is/island-ui/utils'

interface Props {
  autoFocus?: boolean
  defaultValue?: string
  disabled?: boolean
  control?: Control | Control<any, string>
  icon?: React.ComponentProps<typeof Icon>['icon']
  rules?: RegisterOptions
  error?: string
  id: string
  label?: string
  name?: string
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
  readOnly?: boolean
  rightAlign?: boolean
  thousandSeparator?: boolean
  maxLength?: number
  loading?: boolean
  size?: 'xs' | 'sm' | 'md'
  autoComplete?: 'off' | 'on'
}

interface ChildParams {
  value?: string
  onBlur: () => void
  onChange: (...event: any[]) => void
  name: string
}

export const InputController = forwardRef(
  (
    props: Props & TestSupport,
    ref?: React.Ref<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const {
      autoFocus,
      defaultValue,
      disabled = false,
      error,
      id,
      icon,
      label,
      name = id,
      placeholder,
      control,
      rules,
      backgroundColor,
      textarea,
      currency,
      type = 'text',
      format,
      onChange: onInputChange,
      suffix,
      rows,
      required,
      rightAlign,
      readOnly,
      maxLength,
      loading,
      size = 'md',
      dataTestId,
      autoComplete,
      thousandSeparator,
    } = props
    function renderChildInput(c: ChildParams & TestSupport) {
      const { value, onChange, ...props } = c
      if (currency) {
        return (
          <NumberFormat
            customInput={Input}
            id={id}
            icon={icon ? { name: icon } : undefined}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder}
            label={label}
            data-testid={dataTestId}
            type="text"
            decimalSeparator=","
            backgroundColor={backgroundColor}
            thousandSeparator="."
            suffix=" kr."
            value={value}
            format={format}
            maxLength={maxLength}
            autoComplete={autoComplete}
            loading={loading}
            rightAlign={rightAlign}
            onChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => {
              if (onInputChange) {
                onInputChange(e)
              }
            }}
            onValueChange={({ value }) => {
              onChange(value)
            }}
            hasError={error !== undefined}
            errorMessage={error}
            required={required}
            getInputRef={ref}
            {...props}
          />
        )
      } else if (type === 'number' && suffix) {
        return (
          <NumberFormat
            size={size}
            customInput={Input}
            id={id}
            icon={icon ? { name: icon } : undefined}
            disabled={disabled}
            rightAlign={rightAlign}
            readOnly={readOnly}
            backgroundColor={backgroundColor}
            placeholder={placeholder}
            data-testid={dataTestId}
            label={label}
            suffix={suffix}
            value={value}
            format={format}
            maxLength={maxLength}
            autoComplete={autoComplete}
            loading={loading}
            onChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => {
              if (onInputChange) {
                onInputChange(e)
              }
            }}
            onValueChange={({ value }) => {
              onChange(value)
            }}
            hasError={error !== undefined}
            errorMessage={error}
            required={required}
            decimalSeparator={thousandSeparator ? ',' : undefined}
            thousandSeparator={thousandSeparator ? '.' : undefined}
            getInputRef={ref}
            {...props}
          />
        )
      } else if (format && ['text', 'tel'].includes(type)) {
        return (
          <NumberFormat
            size={size}
            customInput={Input}
            icon={icon ? { name: icon } : undefined}
            id={id}
            disabled={disabled}
            readOnly={readOnly}
            rightAlign={rightAlign}
            backgroundColor={backgroundColor}
            data-testid={dataTestId}
            placeholder={placeholder}
            label={label}
            type={type as 'text' | 'tel'}
            value={value}
            format={format}
            maxLength={maxLength}
            autoComplete={autoComplete}
            loading={loading}
            onChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => {
              if (onInputChange) {
                onInputChange(e)
              }
            }}
            onValueChange={({ value }) => {
              onChange(value)
            }}
            hasError={error !== undefined}
            errorMessage={error}
            required={required}
            getInputRef={ref}
            {...props}
          />
        )
      } else {
        return (
          <Input
            id={id}
            value={value}
            disabled={disabled}
            readOnly={readOnly}
            rightAlign={rightAlign}
            icon={icon ? { name: icon } : undefined}
            placeholder={placeholder}
            label={label}
            backgroundColor={backgroundColor}
            autoFocus={autoFocus}
            data-testid={dataTestId}
            hasError={error !== undefined}
            errorMessage={error}
            required={required}
            textarea={textarea}
            type={type}
            maxLength={maxLength}
            autoComplete={autoComplete}
            loading={loading}
            onChange={(e) => {
              onChange(e.target.value)
              if (onInputChange) {
                onInputChange(e)
              }
            }}
            rows={rows}
            size={size}
            ref={ref}
            {...props}
          />
        )
      }
    }

    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        {...(defaultValue !== undefined && { defaultValue })}
        render={({ field: { onChange, onBlur, value, name } }) =>
          renderChildInput({ value, onBlur, onChange, name })
        }
      />
    )
  },
)

export default InputController
