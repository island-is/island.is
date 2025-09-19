import React from 'react'
import {
  Box,
  Button,
  Text,
  Inline,
  Stack,
  FocusableBox,
} from '@island.is/island-ui/core'
import * as styles from './QuestionTypes.css'

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
    const s = typeof step === 'number' && step > 0 ? step : 1
    const values = []
    for (let i = min; i <= max; i += s) {
      values.push(i)
      if (i === max) break
    }
    return values
  }

  console.log('sd')
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

        <Box className={styles.scaleContainer} display="flex" flexWrap="nowrap">
          {scaleValues?.map((scaleValue) => (
            <FocusableBox
              className={styles.scaleButton}
              style={{ height: '80px', width: '74px' }}
              background={value === scaleValue ? 'blue400' : 'blue100'}
              key={scaleValue}
              borderColor={value === scaleValue ? 'blue400' : 'blue200'}
              onClick={() => onChange(scaleValue)}
              disabled={disabled}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Text
                color={value === scaleValue ? 'white' : 'dark400'}
                fontWeight={value === scaleValue ? 'medium' : 'light'}
                textAlign="center"
              >
                {scaleValue}
              </Text>
            </FocusableBox>
          ))}
        </Box>

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
