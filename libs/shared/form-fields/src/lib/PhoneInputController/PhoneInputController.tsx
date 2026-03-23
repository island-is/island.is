import React, { forwardRef } from 'react'
import { InputBackgroundColor, PhoneInput } from '@island.is/island-ui/core'
import {
  Controller,
  Control,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form'
import { TestSupport } from '@island.is/island-ui/utils'
import { Locale } from '@island.is/shared/types'
import { clearInputsOnChange } from '@island.is/shared/utils'

interface Props {
  autoFocus?: boolean
  defaultValue?: string
  disabled?: boolean
  control?: Control
  rules?: RegisterOptions
  error?: string
  id: string
  label?: string
  locale?: Locale
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
  disableDropdown?: boolean
  clearOnChange?: string[]
  clearOnChangeDefaultValue?:
    | string
    | string[]
    | boolean
    | boolean[]
    | number
    | number[]
    | undefined
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
      locale,
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
      disableDropdown,
      clearOnChange,
      clearOnChangeDefaultValue,
    } = props
    const { setValue } = useFormContext()

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
          locale={locale}
          value={value}
          defaultValue={defaultValue}
          autoComplete={autoComplete}
          loading={loading}
          hasError={error !== undefined}
          errorMessage={error}
          required={required}
          disableDropdown={disableDropdown}
          ref={ref}
          onFormatValueChange={onChange}
          allowedCountryCodes={allowedCountryCodes}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => {
            if (onInputChange) {
              onInputChange(e)
            }
            if (clearOnChange) {
              clearInputsOnChange(
                clearOnChange,
                setValue,
                clearOnChangeDefaultValue,
              )
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
        render={({ field: { onChange, onBlur, value, name } }) =>
          renderChildInput({ value, onBlur, onChange, name })
        }
      />
    )
  },
)

export default PhoneInputController
