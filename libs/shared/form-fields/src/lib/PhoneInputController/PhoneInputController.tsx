import React, { forwardRef } from 'react'
import { InputBackgroundColor, PhoneInput } from '@island.is/island-ui/core'
import {
  Controller,
  Control,
  ValidationRules,
  useFormContext,
} from 'react-hook-form'
import { TestSupport } from '@island.is/island-ui/utils'

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
  backgroundColor?: InputBackgroundColor
  required?: boolean
  readOnly?: boolean
  rightAlign?: boolean
  loading?: boolean
  size?: 'xs' | 'sm' | 'md'
  autoComplete?: 'off' | 'on'
  allowedCountryCodes?: string[]
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
      allowedCountryCodes,
    } = props

    const { watch } = useFormContext()
    const formValue = watch(name) as string

    function renderChildInput(c: ChildParams & TestSupport) {
      const { value, onChange, ...props } = c

      return (
        <>
          <PhoneInput
            size={size}
            id={id}
            autoFocus={autoFocus}
            disabled={disabled}
            readOnly={readOnly}
            rightAlign={rightAlign}
            backgroundColor={backgroundColor}
            data-testid={dataTestId}
            placeholder={placeholder}
            label={label}
            value={value}
            defaultValue={defaultValue}
            autoComplete={autoComplete}
            loading={loading}
            hasError={error !== undefined}
            errorMessage={error}
            required={required}
            ref={ref}
            onFormatValueChange={onChange}
            allowedCountryCodes={allowedCountryCodes}
            onChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => {
              if (onInputChange) {
                onInputChange(e)
              }
            }}
            {...props}
          />
          {formValue}
        </>
      )
    }

    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        {...(defaultValue !== undefined && {
          defaultValue,
        })}
        render={renderChildInput}
      />
    )
  },
)

export default PhoneInputController
