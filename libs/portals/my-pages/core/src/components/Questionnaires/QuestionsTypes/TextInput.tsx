import { Box, Input, Text } from '@island.is/island-ui/core'
import React from 'react'

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
  maxLength?: string
  type?: 'text' | 'number' | 'decimal'
  min?: string
  max?: string
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
        if (min !== undefined && numValue < parseFloat(min)) {
          newValue = min.toString()
        } else if (max !== undefined && numValue > parseFloat(max)) {
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
        {type === 'number' && min && max && ' ' + min + ' - ' + max + ' '}
      </Text>
      <Box width={type === 'number' || type === 'decimal' ? 'half' : 'full'}>
        <Input
          size="xs"
          backgroundColor="blue"
          id={id}
          name={id}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          hasError={!!error}
          errorMessage={error}
          disabled={disabled}
          required={required}
          maxLength={maxLength ? +maxLength : undefined}
          min={min}
          max={max}
          textarea={multiline}
          rows={multiline ? rows : undefined}
          type={type === 'decimal' ? 'number' : type}
          inputMode={
            type === 'decimal'
              ? 'decimal'
              : type === 'number'
              ? 'numeric'
              : 'text'
          }
        />
      </Box>
    </>
  )
}
