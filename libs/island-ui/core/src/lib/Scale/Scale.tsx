import cn from 'classnames'
import { FC, useMemo } from 'react'
import { Box } from '../Box/Box'
import { InputError } from '../InputError/InputError'
import { Stack } from '../Stack/Stack'
import { Text } from '../Text/Text'
import * as styles from './Scale.css'

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

  const scaleValues = useMemo(() => {
    // Bail out early if values are invalid
    if (isNaN(minNum) || isNaN(maxNum) || minNum >= maxNum) {
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
  }, [minNum, maxNum, step])

  return (
    <Box>
      {label && (
        <Text variant="h4" marginBottom={2} id={`${id}-label`}>
          {label}
          {required && <span style={{ color: 'red' }}> *</span>}
        </Text>
      )}
      <Stack space={1}>
        <Box
          className={styles.scaleContainer}
          role="radiogroup"
          aria-required={required}
          aria-labelledby={label ? `${id}-label` : undefined}
        >
          {scaleValues.map((scaleValue) => (
            <Box
              key={scaleValue}
              className={cn(styles.scaleButton, {
                [styles.scaleButtonSelected]: value === scaleValue,
                [styles.scaleButtonError]: error !== undefined,
              })}
              onClick={!disabled ? () => onChange(scaleValue) : undefined}
              disabled={disabled}
              role="radio"
              aria-checked={value === scaleValue}
              aria-disabled={disabled}
              type="button"
            >
              <Text className={styles.scaleButtonText}>{scaleValue}</Text>
            </Box>
          ))}
        </Box>

        {showLabels && (minLabel || maxLabel) && (
          <Box display="flex" justifyContent="spaceBetween">
            {minLabel && (
              <Text variant="small" color="blue400" fontWeight="semiBold">
                {minLabel}
              </Text>
            )}
            {maxLabel && (
              <Text variant="small" color="blue400" fontWeight="semiBold">
                {maxLabel}
              </Text>
            )}
          </Box>
        )}
      </Stack>

      {error && (
        <Box paddingBottom={2}>
          <InputError errorMessage={error} />
        </Box>
      )}
    </Box>
  )
}
