import { Box, Button, InputError, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import cn from 'classnames'
import { CSSProperties, Fragment, KeyboardEvent, useMemo } from 'react'
import { m } from '../../../lib/messages'
import * as styles from './Scales.css'
import { getScaleKeyIndex, getScaleValues } from './scaleValues'

export interface HorizontalScaleProps {
  id: string
  min: string | number
  max: string | number
  value?: string | null
  onChange: (value: string) => void
  onClear?: () => void
  error?: string
  disabled?: boolean
  required?: boolean
  minLabel?: string
  maxLabel?: string
  step?: number
  labelledBy?: string
}

export const HorizontalScale = ({
  id,
  min,
  max,
  value,
  onChange,
  onClear,
  error,
  disabled = false,
  required = false,
  minLabel,
  maxLabel,
  step = 1,
  labelledBy,
}: HorizontalScaleProps) => {
  const { formatMessage } = useLocale()
  const values = useMemo(() => getScaleValues(min, max, step), [min, max, step])
  const selectedIndex = value ? values.indexOf(value) : -1

  const errorId = error ? `${id}-error` : undefined

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || values.length === 0) {
      return
    }
    const nextIndex = getScaleKeyIndex(event.key, selectedIndex, values.length)
    if (nextIndex === undefined) {
      return
    }
    event.preventDefault()
    const nextValue = values[nextIndex]
    onChange(nextValue)
    document.getElementById(`${id}-${nextValue}`)?.focus()
  }

  const fillStyle = (): CSSProperties | undefined => {
    if (selectedIndex <= 0 || values.length < 2) {
      return undefined
    }
    const share = selectedIndex / (values.length - 1)
    return {
      width: `calc(${share * 100}% - ${share * styles.tickWidth}px)`,
    }
  }

  if (values.length === 0) {
    return null
  }

  const fill = fillStyle()

  return (
    <Box>
      <Box
        className={styles.horizontalRow}
        role="radiogroup"
        aria-required={required}
        aria-invalid={error !== undefined}
        aria-describedby={errorId}
        aria-labelledby={labelledBy}
        onKeyDown={handleKeyDown}
      >
        {values.length > 1 && (
          <span className={cn(styles.track, styles.horizontalTrack)} />
        )}
        {fill && (
          <span
            className={cn(styles.trackFill, styles.horizontalTrackFill)}
            style={fill}
          />
        )}
        {values.map((scaleValue, index) => {
          const selected = value === scaleValue
          const passed = selectedIndex > index
          return (
            <Fragment key={scaleValue}>
              {/* Nested: an absolute sibling input sits at the top of the flex
                  container, so focusing it would scroll the page */}
              <label
                className={cn(styles.tick, styles.horizontalTick, {
                  [styles.tickDisabled]: disabled,
                })}
              >
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
                <span className={styles.horizontalBubbleArea}>
                  <span
                    className={cn(styles.bubble, {
                      [styles.bubbleSelected]: selected,
                      [styles.bubblePassed]: passed,
                      [styles.bubbleError]: !!error && !selected,
                    })}
                  />
                </span>
                <Text
                  variant="small"
                  fontWeight="regular"
                  className={styles.horizontalTickText}
                >
                  {scaleValue}
                </Text>
              </label>
            </Fragment>
          )
        })}
      </Box>

      {(minLabel || maxLabel) && (
        <Box display="flex" justifyContent="spaceBetween" marginTop={1}>
          <Text variant="small" color="blue400" fontWeight="semiBold">
            {minLabel}
          </Text>
          <Text variant="small" color="blue400" fontWeight="semiBold">
            {maxLabel}
          </Text>
        </Box>
      )}

      {onClear && selectedIndex >= 0 && !disabled && (
        <Box display="flex" justifyContent="flexEnd" marginTop={2}>
          <Button
            variant="text"
            size="small"
            icon="reload"
            onClick={onClear}
            type="button"
          >
            {formatMessage(m.clearAnswer)}
          </Button>
        </Box>
      )}

      {error && (
        <Box paddingTop={1}>
          <InputError id={errorId} errorMessage={error} />
        </Box>
      )}
    </Box>
  )
}
