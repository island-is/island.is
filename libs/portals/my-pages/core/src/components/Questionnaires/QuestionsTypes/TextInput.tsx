import { Box, Input } from '@island.is/island-ui/core'
import React from 'react'
import { useIsMobile } from '../../..'

export interface TextInputProps {
  id: string
  label?: string
  placeholder?: string
  value?: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
  required?: boolean
  multiline?: boolean
  rows?: number
  maxLength?: number
  type?: 'text' | 'number' | 'decimal'
  min?: string
  max?: string
  backgroundColor?: 'white' | 'blue'
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
  backgroundColor = 'blue',
}) => {
  const isMobile = useIsMobile()
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
  const handleBlur = () => {
    if (type === 'number' && value) {
      const numValue = parseFloat(value)
      if (!isNaN(numValue)) {
        if (min !== undefined && numValue < parseFloat(min)) {
          onChange(min.toString())
        } else if (max !== undefined && numValue > parseFloat(max)) {
          onChange(max.toString())
        }
      }
    }
  }

  return (
    <Box
      width={
        isMobile
          ? 'full'
          : type === 'number' || type === 'decimal'
          ? 'half'
          : 'full'
      }
    >
      <Input
        label={label}
        size="xs"
        backgroundColor={backgroundColor}
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
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
  )
}
