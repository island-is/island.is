import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import cn from 'classnames'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import * as styles from './QuestionTypes.css'

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
}

export const Thermometer: FC<ThermometerProps> = ({
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
}) => {
  const height = 442 // Fixed height constant
  const segmentHeight = 40

  const thermometerRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Refs to track active listeners for cleanup
  const pointerMoveHandlerRef = useRef<((e: PointerEvent) => void) | null>(null)
  const pointerUpHandlerRef = useRef<((e: PointerEvent) => void) | null>(null)

  // Cleanup listeners on unmount
  useEffect(() => {
    return () => {
      if (pointerMoveHandlerRef.current) {
        document.removeEventListener(
          'pointermove',
          pointerMoveHandlerRef.current,
        )
        pointerMoveHandlerRef.current = null
      }
      if (pointerUpHandlerRef.current) {
        document.removeEventListener('pointerup', pointerUpHandlerRef.current)
        pointerUpHandlerRef.current = null
      }
    }
  }, [])

  // Handle vertical dragging
  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (disabled || event.button !== 0) return

    event.preventDefault()
    setIsDragging(true)

    const rect = thermometerRef.current?.getBoundingClientRect()
    if (!rect) return

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const relativeY = moveEvent.clientY - rect.top

      // Convert Y position to value index
      const segmentIndex = Math.round(relativeY / segmentHeight)
      const clampedIndex = Math.max(
        0,
        Math.min(displayValues.length - 1, segmentIndex),
      )

      // Reverse index because highest value is at top
      const reversedIndex = displayValues.length - 1 - clampedIndex
      const newValue = displayValues[reversedIndex]

      if (newValue && newValue !== value) {
        onChange(newValue)
      }
    }

    const handlePointerUp = () => {
      setIsDragging(false)
      if (pointerMoveHandlerRef.current) {
        document.removeEventListener(
          'pointermove',
          pointerMoveHandlerRef.current,
        )
        pointerMoveHandlerRef.current = null
      }
      if (pointerUpHandlerRef.current) {
        document.removeEventListener('pointerup', pointerUpHandlerRef.current)
        pointerUpHandlerRef.current = null
      }
    }

    // Store refs for cleanup
    pointerMoveHandlerRef.current = handlePointerMove
    pointerUpHandlerRef.current = handlePointerUp

    document.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerup', handlePointerUp)
  }

  // Calculate display values (sample by index if range is large)
  const getDisplayValues = () => {
    const minNum = parseFloat(min)
    const maxNum = parseFloat(max)
    const stepNum = step ?? 1

    // Safety checks to prevent infinite loops
    if (isNaN(minNum) || isNaN(maxNum) || stepNum <= 0 || minNum > maxNum) {
      console.warn('Invalid thermometer values:', { min, max, step })
      return []
    }

    const allValues = []
    for (let i = minNum; i <= maxNum; i += stepNum) {
      allValues.push(i.toString())
    }

    // If we have more than 20 values, sample by value intervals
    if (allValues.length > 10) {
      const minNum = parseFloat(min)
      const maxNum = parseFloat(max)
      const range = maxNum - minNum
      const valueInterval = Math.ceil(range / 10)

      const sampledValues = allValues.filter((val) => {
        const numVal = parseFloat(val)
        return (numVal - minNum) % valueInterval === 0
      })

      // Ensure the last value is always included
      const lastValue = allValues[allValues.length - 1]
      if (sampledValues[sampledValues.length - 1] !== lastValue) {
        sampledValues.push(lastValue)
      }

      return sampledValues
    }
    return allValues
  }

  const displayValues = getDisplayValues()

  // Calculate thumb position based on current value and display values
  const getThumbPosition = () => {
    if (!value || displayValues.length === 0) return height // Start at bottom when no value (+ padding offset)

    const currentIndex = displayValues.indexOf(value)
    if (currentIndex === -1) return height // Start at bottom if value not found (+ padding offset)

    // Calculate position (reversed because highest value is at top)
    const reversedIndex = displayValues.length - 1 - currentIndex
    return reversedIndex * segmentHeight + segmentHeight / 2
  }

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

    // Reverse the display values so highest value appears at top
    const reversedDisplayValues = [...displayValues].reverse()

    reversedDisplayValues.forEach((segmentValue, index) => {
      const isSelected = value === segmentValue
      const isBelowSelected = value
        ? displayValues.indexOf(segmentValue) < displayValues.indexOf(value)
        : false

      segments.push(
        <Box
          key={segmentValue}
          onClick={() => !disabled && onChange(segmentValue)}
          padding={0}
          borderTopWidth={index === 0 ? undefined : 'standard'}
          borderColor={isSelected || isBelowSelected ? 'blue400' : 'blue200'}
          className={styles.thermoMeterSegment}
          background={isSelected || isBelowSelected ? 'blue400' : 'blue100'}
          style={{
            height: `${segmentHeight}px`,
            borderTopColor:
              isSelected || isBelowSelected
                ? theme.color.white
                : theme.color.blue200,
          }}
        >
          <Text
            variant="default"
            color={isSelected || isBelowSelected ? 'white' : 'dark400'}
          >
            {segmentValue}
          </Text>
        </Box>,
      )
    })

    return segments
  }

  return (
    <Box onKeyDown={handleKeyDown}>
      {label && (
        <Box marginBottom={3}>
          <Text variant="h5" id={`${label}-label`}>
            {label}
            {required && <span style={{ color: 'red' }}> *</span>}
          </Text>
        </Box>
      )}

      <Box display="flex" alignItems="center" justifyContent="center">
        {/* Labels */}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="spaceBetween"
          marginRight={2}
          style={{
            height: `${height}px`,
          }}
        >
          {/* Max label */}
          <Box>
            <Text variant="small" color="blue400" fontWeight="medium">
              {maxLabel || 'Max'}
            </Text>
          </Box>
          {/* Min label */}
          <Box>
            <Text variant="small" color="blue400" fontWeight="medium">
              {minLabel || 'Min'}
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
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
            }}
            className={styles.thermoMeterContainer}
          >
            {/* Clickable segments */}
            {generateSegments()}
          </Box>
        </Box>

        {/* Draggable thumb control on the right side */}
        <Box
          className={styles.thermoMeterThumbContainer}
          style={{ height: height }}
        >
          {/* Connecting line from thumb to thermometer */}
          <Box
            className={cn(styles.thermoMeterDragLine, {
              [styles.thermoMeterDragLineActive]: !isDragging,
            })}
            style={{
              top: `${getThumbPosition()}px`,
            }}
          />

          {/* Draggable thumb - exactly like Slider component */}
          <Box
            className={cn(styles.thermoMeterDraggerContainer, {
              [styles.thermoMeterDragLineActive]: !isDragging,
            })}
            ref={thumbRef}
            onPointerDown={handlePointerDown}
            style={{
              cursor: disabled ? 'not-allowed' : 'pointer',
              top: `${getThumbPosition()}px`,
            }}
            // Pseudo-elements using Box components since we can't use CSS pseudo-elements in style prop
          >
            {/* Animated background circle  */}
            <Box className={styles.thermoMeterDragger} />
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
