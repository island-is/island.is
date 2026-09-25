import { Box, Input } from '@island.is/island-ui/core'
import cn from 'classnames'
import React from 'react'
import * as styles from './QuestionTypes.css'

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
  resizable?: boolean
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
  resizable = false,
  maxLength,
  type = 'text',
  min,
  max,
  backgroundColor = 'blue',
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let newValue = e.target.value

    if (type === 'number' || type === 'decimal') {
      if (newValue === '') {
        onChange(newValue)
        return
      }

      const allowedPattern = type === 'decimal' ? /^-?\d*[.,]?\d*$/ : /^-?\d*$/
      if (!allowedPattern.test(newValue)) {
        return
      }

      // Icelandic decimal commas are accepted but stored with a dot so
      // downstream parsing (formulas, triggers, submission) keeps working;
      // the input renders the stored value back with a comma
      newValue = newValue.replace(',', '.')

      // Range is enforced on blur: clamping per keystroke makes every value
      // between min and max unreachable, the first digit is always below min
    }

    onChange(newValue)
  }
  const handleBlur = () => {
    if ((type === 'number' || type === 'decimal') && value) {
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
      width="full"
      className={cn({
        [styles.numberInput]: type === 'number' || type === 'decimal',
        [styles.noResizeTextarea]: multiline && !resizable,
      })}
    >
      <Input
        label={label}
        size="xs"
        backgroundColor={backgroundColor}
        id={id}
        name={id}
        placeholder={placeholder}
        value={type === 'decimal' ? value.replace('.', ',') : value}
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
        type="text"
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
