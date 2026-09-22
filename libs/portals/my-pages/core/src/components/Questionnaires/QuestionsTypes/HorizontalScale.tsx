import { Box, InputError, Text } from '@island.is/island-ui/core'
import { useIsMobile } from '@island.is/portals/core'
import cn from 'classnames'
import { CSSProperties, FC, Fragment, KeyboardEvent, useMemo } from 'react'
import * as styles from './Scales.css'
import { getScaleKeyIndex, getScaleValues } from './scaleValues'

const MAX_TICKS_PER_ROW = 6

export interface HorizontalScaleProps {
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

export const HorizontalScale: FC<HorizontalScaleProps> = ({
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
  const { isMobile } = useIsMobile()
  const values = useMemo(() => getScaleValues(min, max, step), [min, max, step])

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

  // A short last row is narrowed in proportion to the ticks it holds, so the
  // spacing matches the rows above it and every row starts at the left edge
  const rowStyle = (ticksInRow: number): CSSProperties | undefined =>
    isSplit && ticksInRow > 1 && columns > 1
      ? { width: `${((ticksInRow - 1) / (columns - 1)) * 100}%` }
      : undefined

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
        {rows.map((row, rowIndex) => (
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
        ))}
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

      {error && (
        <Box paddingTop={1}>
          <InputError id={errorId} errorMessage={error} />
        </Box>
      )}
    </Box>
  )
}
