import React, { forwardRef } from 'react'
import { InputBackgroundColor, PhoneInput } from '@island.is/island-ui/core'
import { Controller, Control, ValidationRules } from 'react-hook-form'
import { TestSupport } from '@island.is/island-ui/utils'
import InputController from '../InputController/InputController'
import { useFeatureFlag } from '@island.is/react/feature-flags'

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
    const { value: isPhoneInputV2Enabled } = useFeatureFlag(
      'isPhoneInputV2Enabled',
      false,
    )

    if (!isPhoneInputV2Enabled) {
      return (
        <InputController
          type="tel"
          format="###-####"
          {...props}
          id={`${props.id}NoV2`}
        />
      )
    }

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

    function renderChildInput(c: ChildParams & TestSupport) {
      const { value, onChange, ...props } = c

      return (
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
