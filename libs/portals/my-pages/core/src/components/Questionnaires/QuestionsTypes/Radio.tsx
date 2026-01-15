import { Box, RadioButton, Stack, Text } from '@island.is/island-ui/core'
import React from 'react'
import HtmlParser from 'react-html-parser'

export interface RadioOption {
  label: string
  value: string
  disabled?: boolean
}

export interface RadioProps {
  id: string
  label?: string
  options: RadioOption[]
  value?: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
  required?: boolean
  direction?: 'horizontal' | 'vertical'
}

export const Radio: React.FC<RadioProps> = ({
  id,
  label,
  options,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  direction = 'vertical',
}) => {
  const radioButtons = options.map((option) => (
    <Box width="full" key={option.value}>
      <RadioButton
        large={options.length <= 2}
        backgroundColor={options.length <= 2 ? 'blue' : 'white'}
        id={`${id}-${option.value}`}
        name={id}
        label={option.label}
        value={option.value}
        checked={value === option.value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || option.disabled}
        hasError={!!error}
      />
    </Box>
  ))

  return (
    <Box>
      {label && (
        <Text variant="h5" marginBottom={2}>
          {HtmlParser(label)}
          {required && <span style={{ color: 'red' }}> *</span>}
        </Text>
      )}
      {direction === 'horizontal' || options.length <= 2 ? (
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="spaceBetween"
          rowGap={2}
          columnGap={2}
        >
          {radioButtons}
        </Box>
      ) : (
        <Stack space={2}>{radioButtons}</Stack>
      )}
      {error && (
        <Text color="red400" variant="small" marginTop={1}>
          {error}
        </Text>
      )}
    </Box>
  )
}
