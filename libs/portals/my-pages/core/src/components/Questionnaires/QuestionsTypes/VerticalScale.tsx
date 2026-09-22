import { Box, InputError, Text } from '@island.is/island-ui/core'
import cn from 'classnames'
import { FC, Fragment, KeyboardEvent, useMemo } from 'react'
import * as styles from './Scales.css'
import { getScaleKeyIndex, getScaleValues } from './scaleValues'

export interface VerticalScaleProps {
  id: string
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
  labelledBy?: string
}

export const VerticalScale: FC<VerticalScaleProps> = ({
  id,
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
  labelledBy,
}) => {
  const values = useMemo(() => getScaleValues(min, max, step), [min, max, step])
  const descendingValues = useMemo(() => [...values].reverse(), [values])

  const errorId = error ? `${id}-error` : undefined

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || values.length === 0) {
      return
    }
    const nextIndex = getScaleKeyIndex(
      event.key,
      value ? values.indexOf(value) : -1,
      values.length,
    )
    if (nextIndex === undefined) {
      return
    }
    event.preventDefault()
    const nextValue = values[nextIndex]
    onChange(nextValue)
    document.getElementById(`${id}-${nextValue}`)?.focus()
  }

  if (values.length === 0) {
    return null
  }

  return (
    <Box>
      <Box display="flex" alignItems="stretch">
        {(minLabel || maxLabel) && (
          <Box className={styles.verticalEndLabels} paddingRight={3}>
            <Text variant="small" color="blue400" fontWeight="semiBold">
              {maxLabel}
            </Text>
            <Text variant="small" color="blue400" fontWeight="semiBold">
              {minLabel}
            </Text>
          </Box>
        )}
        <Box
          background="white"
          border="standard"
          borderColor="blue200"
          borderRadius="lg"
          paddingY={3}
          paddingX={4}
        >
          <Box
            className={styles.verticalMeter}
            role="radiogroup"
            aria-required={required}
            aria-invalid={error !== undefined}
            aria-describedby={errorId}
            aria-labelledby={labelledBy}
            onKeyDown={handleKeyDown}
          >
            <span className={cn(styles.track, styles.verticalTrack)} />
            {descendingValues.map((scaleValue) => {
              const selected = value === scaleValue
              return (
                <Fragment key={scaleValue}>
                  <input
                    id={`${id}-${scaleValue}`}
                    className={cn('visually-hidden', styles.input)}
                    type="radio"
                    name={id}
                    value={scaleValue}
                    checked={selected}
                    disabled={disabled}
                    onChange={(event) => onChange(event.target.value)}
                  />
                  <label
                    htmlFor={`${id}-${scaleValue}`}
                    className={cn(styles.tick, styles.verticalTick)}
                  >
                    <span className={styles.verticalBubbleArea}>
                      <span
                        className={cn(styles.bubble, {
                          [styles.bubbleSelected]: selected,
                          [styles.bubbleError]: !!error && !selected,
                        })}
                      />
                    </span>
                    <Box marginLeft={1}>
                      <Text variant="small" fontWeight="regular">
                        {scaleValue}
                      </Text>
                    </Box>
                  </label>
                </Fragment>
              )
            })}
          </Box>
        </Box>
      </Box>

      {error && (
        <Box paddingTop={1}>
          <InputError id={errorId} errorMessage={error} />
        </Box>
      )}
    </Box>
  )
}
