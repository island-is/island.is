import { Box, Stack, Text } from '@island.is/island-ui/core'
import cn from 'classnames'
import { FC, useMemo } from 'react'
import * as styles from './QuestionTypes.css'
export interface ScaleProps {
  id: string
  label?: string
  min: string | number
  max: string | number
  value?: string | null
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
  required?: boolean
  minLabel?: string
  maxLabel?: string
  step?: number
  showLabels?: boolean
}

export const Scale: FC<ScaleProps> = ({
  id,
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
  // Ensure numeric values
  const minNum = Number(min)
  const maxNum = Number(max)

  const generateScaleValues = useMemo(() => {
    // Bail out early if values are invalid
    if (isNaN(minNum) || isNaN(maxNum) || minNum >= maxNum) {
      console.warn('Invalid min/max in Scale component', { min, max })
      return []
    }

    const s = typeof step === 'number' && step > 0 ? step : 1
    const values: string[] = []

    for (let i = minNum; i <= maxNum; i += s) {
      values.push(i.toString())
      if (i + s > maxNum) break // prevent floating point overflow
    }
    // If we have more than 20 values, sample by index
    if (values.length > 20) {
      const interval = Math.ceil(values.length / 20)
      const sampledValues = values.filter((_, index) => index % interval === 0)

      // Ensure the last value is always included
      const lastValue = values[values.length - 1]
      if (sampledValues[sampledValues.length - 1] !== lastValue) {
        sampledValues.push(lastValue)
      }

      return sampledValues
    }
    return values
  }, [minNum, maxNum, step, min, max])

  return (
    <Box>
      {label && (
        <Text variant="h5" marginBottom={2} id={`${id}-label`}>
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

        <Box
          className={styles.scaleContainer}
          display="flex"
          flexWrap="nowrap"
          role="radiogroup"
          aria-required={required}
          aria-labelledby={label ? `${id}-label` : undefined}
        >
          {generateScaleValues.map((scaleValue) => (
            <Box
              key={scaleValue}
              className={cn(styles.scaleButton, {
                [styles.scaleButtonSelected]: value === scaleValue,
              })}
              style={{ height: '80px', width: '74px' }}
              onClick={!disabled ? () => onChange(scaleValue) : undefined}
              disabled={disabled}
              display="flex"
              justifyContent="center"
              alignItems="center"
              role="radio"
              aria-checked={value === scaleValue}
              aria-disabled={disabled}
              type="button"
              color={value === scaleValue ? 'white' : 'dark400'}
            >
              <Text
                color={value === scaleValue ? 'white' : 'dark400'}
                fontWeight={value === scaleValue ? 'medium' : 'light'}
                textAlign="center"
              >
                {scaleValue}
              </Text>
            </Box>
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
