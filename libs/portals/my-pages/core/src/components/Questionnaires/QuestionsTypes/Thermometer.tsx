import React, { useRef, useState, useCallback, useEffect } from 'react'
import { Box, Text } from '@island.is/island-ui/core'

export interface ThermometerProps {
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
  height = 200,
}) => {
  const thermometerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const range = Math.max(0, max - min)
  const percentage =
    range === 0 ? 0 : Math.max(0, Math.min(100, ((value - min) / range) * 100))
  const calculateValueFromPosition = useCallback(
    (clientY: number) => {
      if (!thermometerRef.current) return value

      const rect = thermometerRef.current.getBoundingClientRect()
      const y = clientY - rect.top
      const relativeY = Math.max(0, Math.min(height, height - y)) // Invert Y axis so top is max
      const ratio = relativeY / height
      const rawValue = min + ratio * (max - min)

      const steppedValue = Math.round(rawValue / step) * step
      return Math.max(min, Math.min(max, steppedValue))
    },
    [value, height, min, max, step],
  )

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return
    setIsDragging(true)
    const newValue = calculateValueFromPosition(e.clientY)
    onChange(newValue)
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || disabled) return
      const newValue = calculateValueFromPosition(e.clientY)
      onChange(newValue)
    },
    [isDragging, disabled, calculateValueFromPosition, onChange],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return
    setIsDragging(true)
    const newValue = calculateValueFromPosition(e.touches[0].clientY)
    onChange(newValue)
  }

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || disabled) return
      e.preventDefault()
      const newValue = calculateValueFromPosition(e.touches[0].clientY)
      onChange(newValue)
    },
    [isDragging, disabled, calculateValueFromPosition, onChange],
  )

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      })
      document.addEventListener('touchend', handleTouchEnd)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return
      let next = value
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') next = value + step
      else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft')
        next = value - step
      else if (e.key === 'Home') next = min
      else if (e.key === 'End') next = max
      if (next !== value) {
        onChange(Math.max(min, Math.min(max, next)))
        e.preventDefault()
      }
    },
    [disabled, value, step, min, max, onChange],
  )

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

      <Box display="flex" alignItems="center" justifyContent="center">
        {/* Max label */}
        <Box marginRight={2}>
          <Text variant="small" color="dark300" textAlign="right">
            {maxLabel || max}
          </Text>
        </Box>

        {/* Thermometer visual */}
        <Box>
          <Box
            ref={thermometerRef}
            role="slider"
            aria-labelledby={`${label}-label`}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={handleKeyDown}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{
              width: '24px',
              height: `${height}px`,
              backgroundColor: '#e6e6e6',
              borderRadius: '12px',
              position: 'relative',
              border: error ? '2px solid red' : '1px solid #ccc',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
              userSelect: 'none',
            }}
          >
            {/* Fill */}
            <Box
              style={{
                width: '100%',
                height: `${percentage}%`,
                backgroundColor: error ? '#ff4757' : '#0061ff',
                borderRadius: '12px',
                position: 'absolute',
                bottom: 0,
                transition: isDragging ? 'none' : 'height 0.2s ease',
              }}
            />

            {/* Bulb at bottom */}
            <Box
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: error ? '#ff4757' : '#0061ff',
                borderRadius: '50%',
                position: 'absolute',
                bottom: '-4px',
                left: '-4px',
                border: '2px solid white',
              }}
            />

            {/* Drag indicator at current level */}
            <Box
              style={{
                width: '32px',
                height: '4px',
                backgroundColor: '#333',
                position: 'absolute',
                bottom: `${percentage}%`,
                left: '-4px',
                transform: 'translateY(50%)',
                borderRadius: '2px',
                opacity: isDragging ? 1 : 0.7,
              }}
            />
          </Box>
        </Box>

        {/* Min label */}
        <Box marginLeft={2}>
          <Text variant="small" color="dark300" textAlign="left">
            {minLabel || min}
          </Text>
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
