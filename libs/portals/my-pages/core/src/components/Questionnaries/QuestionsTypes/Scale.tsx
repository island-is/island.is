import React from 'react'
import { Box, Button, Text, Inline, Stack } from '@island.is/island-ui/core'

export interface ScaleProps {
  id: string
  label?: string
  min: number
  max: number
  value?: number
  onChange: (value: number) => void
  error?: string
  disabled?: boolean
  required?: boolean
  minLabel?: string
  maxLabel?: string
  step?: number
  showLabels?: boolean
}

export const Scale: React.FC<ScaleProps> = ({
  label,
  min,
  max,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  minLabel,
  maxLabel,
  step = 1,
  showLabels = true,
}) => {
  const generateScaleValues = () => {
    const values = []
    for (let i = min; i <= max; i += step) {
      values.push(i)
    }
    return values
  }

  const scaleValues = generateScaleValues()

  return (
    <Box>
      {label && (
        <Text variant="h5" marginBottom={2}>
          {label}
          {required && <span style={{ color: 'red' }}> *</span>}
        </Text>
      )}

      <Stack space={2}>
        {showLabels && (minLabel || maxLabel) && (
          <Box display="flex" justifyContent="spaceBetween">
            {minLabel && (
              <Text variant="small" color="dark300">
                {minLabel}
              </Text>
            )}
            {maxLabel && (
              <Text variant="small" color="dark300">
                {maxLabel}
              </Text>
            )}
          </Box>
        )}

        <Inline space={1}>
          {scaleValues.map((scaleValue) => (
            <Button
              key={scaleValue}
              variant={value === scaleValue ? 'primary' : 'ghost'}
              size="small"
              onClick={() => onChange(scaleValue)}
              disabled={disabled}
            >
              {scaleValue}
            </Button>
          ))}
        </Inline>

        {showLabels && (
          <Box display="flex" justifyContent="spaceBetween">
            <Text variant="small" color="dark300">
              {min}
            </Text>
            <Text variant="small" color="dark300">
              {max}
            </Text>
          </Box>
        )}
      </Stack>

      {error && (
        <Text color="red400" variant="small" marginTop={1}>
          {error}
        </Text>
      )}
    </Box>
  )
}
