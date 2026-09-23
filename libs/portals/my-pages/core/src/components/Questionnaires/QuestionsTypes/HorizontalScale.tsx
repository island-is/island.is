import { Box, Button, InputError, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useIsMobile } from '@island.is/portals/core'
import cn from 'classnames'
import { CSSProperties, FC, Fragment, KeyboardEvent, useMemo } from 'react'
import { m } from '../../../lib/messages'
import * as styles from './Scales.css'
import { getScaleKeyIndex, getScaleValues } from './scaleValues'

const MAX_TICKS_PER_ROW = 6

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

export const HorizontalScale: FC<HorizontalScaleProps> = ({
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
}) => {
  const { formatMessage } = useLocale()
  const { isMobile } = useIsMobile()
  const values = useMemo(() => getScaleValues(min, max, step), [min, max, step])
  const selectedIndex = value ? values.indexOf(value) : -1

  const columns = isMobile
    ? Math.min(values.length, MAX_TICKS_PER_ROW)
    : values.length
  const isSplit = isMobile && values.length > MAX_TICKS_PER_ROW

  const rows = useMemo(() => {
    if (!isSplit) {
      return [values]
    }
    return values.reduce<string[][]>((acc, scaleValue, index) => {
      if (index % columns === 0) {
        acc.push([])
      }
      acc[acc.length - 1].push(scaleValue)
      return acc
    }, [])
  }, [values, columns, isSplit])

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

  // A short last row is narrowed to its share of the gaps plus the width its
  // own ticks take up, so tick spacing matches the rows above it and every row
  // still starts at the left edge
  const rowStyle = (ticksInRow: number): CSSProperties | undefined => {
    if (!isSplit || ticksInRow < 2 || columns < 2) {
      return undefined
    }
    const share = (ticksInRow - 1) / (columns - 1)
    return {
      width: `calc(${share * 100}% + ${(1 - share) * styles.tickWidth}px)`,
    }
  }

  // The fill stops at the selected tick, so rows before it are filled whole and
  // rows after it not at all
  const fillStyle = (
    rowStart: number,
    ticksInRow: number,
  ): CSSProperties | undefined => {
    const reached = selectedIndex - rowStart
    if (selectedIndex < 0 || reached <= 0 || ticksInRow < 2) {
      return undefined
    }
    const share = Math.min(reached / (ticksInRow - 1), 1)
    return {
      width: `calc(${share * 100}% - ${share * styles.tickWidth}px)`,
    }
  }

  if (values.length === 0) {
    return null
  }

  return (
    <Box>
      <Box
        role="radiogroup"
        aria-required={required}
        aria-invalid={error !== undefined}
        aria-describedby={errorId}
        aria-labelledby={labelledBy}
        onKeyDown={handleKeyDown}
      >
        {rows.map((row, rowIndex) => {
          const fill = fillStyle(rowIndex * columns, row.length)
          return (
            <Box
              key={`${id}-row-${rowIndex}`}
              marginTop={rowIndex === 0 ? 0 : 3}
              className={cn(styles.horizontalRow, {
                [styles.horizontalRowSplit]: isSplit,
              })}
              style={rowStyle(row.length)}
            >
              {row.length > 1 && (
                <span className={cn(styles.track, styles.horizontalTrack)} />
              )}
              {fill && (
                <span
                  className={cn(styles.trackFill, styles.horizontalTrackFill)}
                  style={fill}
                />
              )}
              {row.map((scaleValue) => {
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
                      className={cn(styles.tick, styles.horizontalTick)}
                    >
                      <span className={styles.horizontalBubbleArea}>
                        <span
                          className={cn(styles.bubble, {
                            [styles.bubbleSelected]: selected,
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
