import React, { useRef, useCallback, useState } from 'react'
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
}) => {
  const height = 500 // Fixed height constant
  const thermometerRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Handle vertical dragging
  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (disabled || event.button !== 0) return

    event.preventDefault()
    setIsDragging(true)

    const startY = event.clientY
    const rect = thermometerRef.current?.getBoundingClientRect()
    if (!rect) return

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaY = moveEvent.clientY - startY
      const newY = getThumbPosition() + deltaY

      // Convert Y position to value index
      const segmentHeight = height / displayValues.length
      const segmentIndex = Math.round(newY / segmentHeight)
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
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
    }

    document.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerup', handlePointerUp)
  }

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

  // Calculate thumb position based on current value and display values
  const getThumbPosition = () => {
    if (!value || displayValues.length === 0) return height // Start at bottom when no value (+ padding offset)

    const currentIndex = displayValues.indexOf(value)
    if (currentIndex === -1) return height // Start at bottom if value not found (+ padding offset)

    // Calculate position (reversed because highest value is at top)
    const segmentHeight = height / displayValues.length
    const reversedIndex = displayValues.length - 1 - currentIndex
    // Add 18px offset to account for thermometer container's padding + border
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
          </Box>
        </Box>

        {/* Draggable thumb control on the right side */}
        <Box
          style={{
            position: 'relative',
            width: '60px',
            height: `532px`,
          }}
        >
          {/* Connecting line from thumb to thermometer */}
          <Box
            style={{
              position: 'absolute',
              left: '-18px',
              top: `${getThumbPosition()}px`,
              width: '51px',
              height: '2px',
              backgroundColor: theme.color.mint400,
              transition: isDragging ? 'none' : 'transform 0.3s, top 0.2s ease',

              transform: 'translateY(-1px)',
              zIndex: 5,
            }}
          />

          {/* Draggable thumb - exactly like Slider component */}
          <Box
            ref={thumbRef}
            onPointerDown={handlePointerDown}
            style={{
              boxSizing: 'border-box',
              cursor: disabled ? 'not-allowed' : 'pointer',
              background: theme.color.mint400,
              backgroundClip: 'content-box',
              padding: '20px',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              position: 'absolute',
              left: '8px',
              top: `${getThumbPosition()}px`,
              transform: 'translateY(-50%)',
              transition: isDragging ? 'none' : 'transform 0.3s, top 0.2s ease',
              WebkitTapHighlightColor: 'transparent',
              outline: 'none',
              touchAction: 'none',
              zIndex: 10,
            }}
            // Pseudo-elements using Box components since we can't use CSS pseudo-elements in style prop
          >
            {/* Animated background circle (mimics :after pseudo-element) */}
            <Box
              style={{
                content: '""',
                position: 'absolute',
                left: '0px',
                top: '0px',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: theme.color.mint400,
                opacity: 0.25,
                transform: isDragging ? 'scale(0.8)' : 'scale(0.6)',
                transition: 'transform 1.5s ease-in-out',
                pointerEvents: 'none',
              }}
            />
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
