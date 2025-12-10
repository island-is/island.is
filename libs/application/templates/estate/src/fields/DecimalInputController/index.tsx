import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Input } from '@island.is/island-ui/core'

interface DecimalInputControllerProps {
  id: string
  name: string
  label: string
  defaultValue?: string
  placeholder?: string
  error?: string | undefined
  size?: 'xs' | 'sm' | 'md'
  backgroundColor?: 'blue' | 'white'
  disabled?: boolean
  onChange?: (value: string) => void
  required?: boolean
  maxDecimals?: number
}

export const DecimalInputController: React.FC<DecimalInputControllerProps> = ({
  name,
  onChange,
  defaultValue = '',
  id,
  label,
  placeholder,
  error,
  size,
  backgroundColor = 'blue',
  disabled,
  required,
  maxDecimals = 2,
}) => {
  const { control } = useFormContext()

  const normalizeDecimalInput = (input: string): string => {
    // Remove all characters except digits, dots, and commas
    let cleaned = input.replace(/[^\d.,]/g, '')

    // Count dots and commas
    const dotCount = (cleaned.match(/\./g) || []).length
    const commaCount = (cleaned.match(/,/g) || []).length

    // If there are multiple decimal separators, keep only the first one
    if (dotCount + commaCount > 1) {
      // Find the first decimal separator (dot or comma)
      const firstDotIndex = cleaned.indexOf('.')
      const firstCommaIndex = cleaned.indexOf(',')

      let firstSeparatorIndex = -1
      let separatorChar = ''

      if (firstDotIndex !== -1 && firstCommaIndex !== -1) {
        // Both exist, use whichever comes first
        if (firstDotIndex < firstCommaIndex) {
          firstSeparatorIndex = firstDotIndex
          separatorChar = '.'
        } else {
          firstSeparatorIndex = firstCommaIndex
          separatorChar = ','
        }
      } else if (firstDotIndex !== -1) {
        firstSeparatorIndex = firstDotIndex
        separatorChar = '.'
      } else if (firstCommaIndex !== -1) {
        firstSeparatorIndex = firstCommaIndex
        separatorChar = ','
      }

      if (firstSeparatorIndex !== -1) {
        // Keep everything before the first separator, the separator, and remove all other separators after
        const beforeSeparator = cleaned.substring(0, firstSeparatorIndex)
        const afterSeparator = cleaned
          .substring(firstSeparatorIndex + 1)
          .replace(/[.,]/g, '')
        cleaned = beforeSeparator + separatorChar + afterSeparator
      }
    }

    // Convert comma to dot for internal consistency
    let normalized = cleaned.replace(',', '.')

    // Limit decimal places to maxDecimals
    const decimalIndex = normalized.indexOf('.')

    if (
      decimalIndex !== -1 &&
      normalized.length > decimalIndex + maxDecimals + 1
    ) {
      normalized = normalized.substring(0, decimalIndex + maxDecimals + 1)
    }

    return normalized
  }

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <Input
          id={id}
          name={field.name}
          label={label}
          placeholder={placeholder}
          backgroundColor={backgroundColor}
          size={size}
          disabled={disabled}
          required={required}
          hasError={!!error}
          errorMessage={error}
          value={field.value || ''}
          onChange={(event) => {
            const inputValue = event.target.value
            const normalizedValue = normalizeDecimalInput(inputValue)
            field.onChange(normalizedValue)
            if (onChange) {
              onChange(normalizedValue)
            }
          }}
        />
      )}
    />
  )
}

export default DecimalInputController
