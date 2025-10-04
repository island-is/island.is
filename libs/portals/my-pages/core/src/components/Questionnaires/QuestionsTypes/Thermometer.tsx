import React, { useRef, useCallback } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

export interface ThermometerProps {
  id: string
  label?: string
  min: string
  max: string
  value?: string | null
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
  required?: boolean
  minLabel?: string
  maxLabel?: string
  step?: number
  showValue?: boolean
  height?: number
}

export const Thermometer: React.FC<ThermometerProps> = ({
  label,
  min,
  max,
  value = min,
  onChange,
  error,
  disabled = false,
  required = false,
  minLabel,
  maxLabel,
  step = 1,
  showValue = false,
  height = 500,
}) => {
  const thermometerRef = useRef<HTMLDivElement>(null)

  // Calculate display values (show every 10th if range is large)
  const getDisplayValues = () => {
    const minNum = parseFloat(min)
    const maxNum = parseFloat(max)
    const stepNum = step || 1

    // Safety checks to prevent infinite loops
    if (isNaN(minNum) || isNaN(maxNum) || stepNum <= 0 || minNum > maxNum) {
      console.warn('Invalid thermometer values:', { min, max, step })
      return ['0', '50', '100'] // Fallback values
    }

    const allValues = []
    for (let i = minNum; i <= maxNum; i += stepNum) {
      allValues.push(i.toString())
    }

    // If we have more than 20 values, show only every 10th
    if (allValues.length > 20) {
      return allValues.filter((val) => parseFloat(val) % 10 === 0)
    }
    return allValues
  }

  const displayValues = getDisplayValues()

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return

      const currentIndex = value ? displayValues.indexOf(value) : -1
      let nextIndex = currentIndex

      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
        nextIndex = Math.min(displayValues.length - 1, currentIndex + 1)
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
        nextIndex = Math.max(0, currentIndex - 1)
      } else if (e.key === 'Home') {
        nextIndex = 0
      } else if (e.key === 'End') {
        nextIndex = displayValues.length - 1
      }

      if (nextIndex !== currentIndex && nextIndex >= 0) {
        onChange(displayValues[nextIndex])
        e.preventDefault()
      }
    },
    [disabled, value, displayValues, onChange],
  )

  // Generate clickable segments
  const generateSegments = (): React.ReactNode[] => {
    const segments: React.ReactNode[] = []
    const segmentHeight = height / displayValues.length

    // Reverse the display values so highest value appears at top
    const reversedDisplayValues = [...displayValues].reverse()

    reversedDisplayValues.forEach((segmentValue, index) => {
      const isSelected = value === segmentValue

      segments.push(
        <Box
          key={segmentValue}
          onClick={() => !disabled && onChange(segmentValue)}
          padding={3}
          borderTopWidth={index === 0 ? undefined : 'standard'}
          borderColor="blue200"
          style={{
            width: '100%',
            height: `${segmentHeight}px`,
            backgroundColor: isSelected
              ? theme.color.blue400
              : theme.color.blue100,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s ease',
          }}
        >
          <Text variant="default" color={isSelected ? 'white' : 'dark400'}>
            {segmentValue}
          </Text>
        </Box>,
      )
    })

    return segments
  }

  return (
    <Box>
      {label && (
        <Box marginBottom={3}>
          <Text variant="h5">
            {label}
            {required && <span style={{ color: 'red' }}> *</span>}
          </Text>
          {showValue && (
            <Text variant="small" color="dark300" marginTop={1}>
              Current value: {value}
            </Text>
          )}
        </Box>
      )}

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        style={{ position: 'relative' }}
      >
        {/* Labels */}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="spaceBetween"
          marginRight={2}
          height="full"
        >
          {/* Max label */}
          <Box>
            <Text variant="small" color="blue400">
              {maxLabel || 'Gifurleg vanlíðan'}
            </Text>
          </Box>
          {/* Min label */}
          <Box>
            <Text variant="small" color="blue400">
              {minLabel || 'Engin vanlíðan'}
            </Text>
          </Box>
        </Box>

        {/* Thermometer container */}
        <Box
          padding={2}
          borderRadius="lg"
          borderColor="blue200"
          border="standard"
        >
          <Box
            ref={thermometerRef}
            role="slider"
            aria-labelledby={`${label}-label`}
            aria-valuemin={parseFloat(min)}
            aria-valuemax={parseFloat(max)}
            aria-valuenow={
              value && typeof value === 'string' ? parseFloat(value) : undefined
            }
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={handleKeyDown}
            borderRadius="large"
            border={'standard'}
            borderColor="blue200"
            style={{
              width: '80px',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
              userSelect: 'none',
              overflow: 'hidden',
            }}
          >
            {/* Clickable segments */}
            {generateSegments()}

            {/* Cyan indicator line for selected value */}
            {/* {displayValues.includes(value) && (
              <Box
                style={{
                  width: '70px',
                  height: '4px',
                  backgroundColor: '#40e0d0',
                  position: 'absolute',
                  bottom: `${
                    (displayValues.indexOf(value) / displayValues.length) *
                      height +
                    height / displayValues.length / 2 -
                    2
                  }px`,
                  left: '-5px',
                  borderRadius: '2px',
                  boxShadow: '0 2px 4px rgba(64, 224, 208, 0.4)',
                  zIndex: 10,
                  pointerEvents: 'none',
                }}
              />
            )} */}
          </Box>
        </Box>
      </Box>

      {error && (
        <Text color="red400" variant="small" marginTop={2}>
          {error}
        </Text>
      )}
    </Box>
  )
}
