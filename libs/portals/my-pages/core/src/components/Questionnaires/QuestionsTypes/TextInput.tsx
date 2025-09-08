import React from 'react'
import { Input, Text } from '@island.is/island-ui/core'

export interface TextInputProps {
  id: string
  label: string
  placeholder?: string
  value?: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
  required?: boolean
  multiline?: boolean
  rows?: number
  maxLength?: number
  type?: 'text' | 'number'
  min?: number
  max?: number
  step?: number
}

export const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  placeholder,
  value = '',
  onChange,
  error,
  disabled = false,
  required = false,
  multiline = false,
  rows = 4,
  maxLength,
  type = 'text',
  min,
  max,
  step: _step,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let newValue = e.target.value

    if (type === 'number') {
      if (newValue === '') {
        onChange(newValue)
        return
      }

      if (!/^-?\d*\.?\d*$/.test(newValue)) {
        return
      }

      const numValue = parseFloat(newValue)
      if (!isNaN(numValue)) {
        if (min !== undefined && numValue < min) {
          newValue = min.toString()
        } else if (max !== undefined && numValue > max) {
          newValue = max.toString()
        }
      }
    }

    onChange(newValue)
  }

  return (
    <>
      <Text variant="h5" marginBottom={2}>
        {label}
      </Text>
      <Input
        size="xs"
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        hasError={!!error}
        errorMessage={error}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        textarea={multiline}
        rows={multiline ? rows : undefined}
        type={multiline ? undefined : type}
      />
    </>
  )
}
