import React, { useState, forwardRef } from 'react'
import {
  InputBackgroundColor,
  Option,
  PhoneInput,
} from '@island.is/island-ui/core'
import {
  Controller,
  Control,
  ValidationRules,
  useFormContext,
} from 'react-hook-form'
import NumberFormat from 'react-number-format'
import { TestSupport } from '@island.is/island-ui/utils'
import { ValueType } from 'react-select'
import { countryCodes as countryCodeList } from './countryCodes'

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
  currency?: boolean
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

const DEFAULT_COUNTRY_CODE = '+354'

const getCountryCodes = (allowedCountryCodes?: string[]) => {
  return countryCodeList
    .filter((x) =>
      allowedCountryCodes ? allowedCountryCodes.includes(x.code) : true,
    )
    .map((x) => ({
      label: `${x.name} ${x.dial_code}`,
      value: x.dial_code,
      description: x.flag,
    }))
}

/**
 * Gets default value for the controller.
 * If the incoming value is empty or starts with "+",
 * then we don't have to prefix it with the country code.
 */
const getDefaultValue = (
  defaultValue?: string,
  defaultCountryCode?: string,
) => {
  return defaultValue === '' || defaultValue?.startsWith('+')
    ? defaultValue
    : `${defaultCountryCode ?? ''}${defaultValue}`
}

/**
 * Gets default country code.
 * This function tries to extract a country calling code from a phone number,
 * and it assumes that the phone number itself is always 7 characters
 * Might need to rethink this logic in the future when more country calling codes are allowed.
 *
 * Example outputs:
 * getDefaultCountryCode("+3545812345") // +354
 * getDefaultCountryCode("+455812345") // +45
 * getDefaultCountryCode("5812345") // +354
 */
const getDefaultCountryCode = (phoneNumber?: string) => {
  if (!phoneNumber) return DEFAULT_COUNTRY_CODE
  const countryCode = phoneNumber.slice(0, -7) || DEFAULT_COUNTRY_CODE
  return countryCode
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

    const { watch, setValue } = useFormContext()
    const formValue = watch(name) as string
    const countryCodes = getCountryCodes(allowedCountryCodes)
    const defaultCountryCode = getDefaultCountryCode(defaultValue)
    const [countryCode, setCountryCode] = useState<ValueType<Option>>(
      countryCodes.find((x) => x.value === defaultCountryCode),
    )

    const cc = (countryCode as Option).value.toString()

    const handleCountryCodeChange = (value: ValueType<Option>) => {
      if (formValue && !formValue.startsWith('+')) {
        // Form value has no country code prefix, set it
        setValue(name, `${(value as Option).value.toString()}${formValue}`)
      } else if (formValue?.startsWith(cc)) {
        // Update existing country code with updated value
        const updatedValue = formValue.replace(
          cc,
          (value as Option).value.toString(),
        )
        setValue(name, updatedValue)
      }
      setCountryCode(value)
    }

    function renderChildInput(c: ChildParams & TestSupport) {
      const { value, onChange, ...props } = c

      return (
        <NumberFormat
          size={size}
          customInput={PhoneInput}
          id={id}
          autoFocus={autoFocus}
          disabled={disabled}
          readOnly={readOnly}
          rightAlign={rightAlign}
          countryCodes={countryCodes}
          backgroundColor={backgroundColor}
          data-testid={dataTestId}
          placeholder={placeholder}
          label={label}
          type="tel"
          value={value?.replace(cc, '')}
          format="###-####"
          autoComplete={autoComplete}
          loading={loading}
          countryCodeValue={countryCode}
          onCountryCodeChange={handleCountryCodeChange}
          hasError={error !== undefined}
          errorMessage={error}
          required={required}
          getInputRef={ref}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => {
            if (onInputChange) {
              onInputChange(e)
            }
          }}
          onValueChange={({ value }) => {
            // Don't prefix value with country code it it's empty.
            value ? onChange(cc + value) : onChange(value)
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
          defaultValue: getDefaultValue(defaultValue, defaultCountryCode),
        })}
        render={renderChildInput}
      />
    )
  },
)

export default PhoneInputController
