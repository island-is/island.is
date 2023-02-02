import React, { FC, useState, forwardRef } from 'react'
import {
  Icon,
  InputBackgroundColor,
  Option,
  Box,
  Select,
  PhoneInput,
} from '@island.is/island-ui/core'
import { Controller, Control, ValidationRules } from 'react-hook-form'
import NumberFormat, { FormatInputValueFunction } from 'react-number-format'
import { TestSupport } from '@island.is/island-ui/utils'
import { ValueType } from 'react-select'

interface Props {
  autoFocus?: boolean
  defaultValue?: string
  disabled?: boolean
  control?: Control
  rules?: ValidationRules
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
  required?: boolean
  readOnly?: boolean
  rightAlign?: boolean
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

export const PhoneInputController = forwardRef(
  (
    props: Props & TestSupport,
    ref?: React.Ref<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const [countryCode, setCountryCode] = useState(354)
    const {
      autoFocus,
      defaultValue,
      disabled = false,
      error,
      id,
      label,
      name = id,
      placeholder,
      control,
      rules,
      backgroundColor,
      onChange: onInputChange,
      required,
      rightAlign,
      readOnly,
      loading,
      size = 'md',
      dataTestId,
      autoComplete,
    } = props

    const [areaCode, setAreaCode] = useState<ValueType<Option>>({
      label: '',
      value: '',
    })

    console.log('control', control)

    const handleAreaCodeChange = (value: ValueType<Option>) => {
      setAreaCode(value)
    }

    console.log('areaCode', areaCode)

    function renderChildInput(c: ChildParams & TestSupport) {
      const { value, onChange, ...props } = c

      console.log('value', value)

      return (
        <NumberFormat
          size={size}
          customInput={PhoneInput}
          id={id}
          autoFocus={autoFocus}
          disabled={disabled}
          readOnly={readOnly}
          rightAlign={rightAlign}
          backgroundColor={backgroundColor}
          data-testid={dataTestId}
          placeholder={placeholder}
          label={label}
          type="tel"
          value={value}
          format="###-####"
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
    }

    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        {...(defaultValue !== undefined && { defaultValue })}
        render={renderChildInput}
      />
    )
  },
)

export default PhoneInputController
