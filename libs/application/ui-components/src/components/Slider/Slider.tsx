import { Box, BoxProps, Text } from '@island.is/island-ui/core'
import useComponentSize from '@rehooks/component-size'
import React, { CSSProperties, FC, useEffect, useRef, useState } from 'react'
import { useDrag } from './utils'
import * as styles from './Slider.css'
import { Colors, theme } from '@island.is/island-ui/theme'

interface TooltipProps {
  style?: CSSProperties
  atEnd?: boolean
  textColorOverwrite?: string
}

const Tooltip: FC<React.PropsWithChildren<TooltipProps>> = ({
  style,
  atEnd = false,
  children,
  textColorOverwrite = theme.color.blue400,
}) => (
  <Box
    data-test="slider-tooltip"
    className={styles.TooltipContainer}
    style={style}
  >
    <Box
      className={styles.TooltipBox}
      style={{
        transform: `translateX(${atEnd ? -88 : -50}%)`,
        color: textColorOverwrite,
      }}
    >
      {children}
    </Box>
  </Box>
)

interface ColorValues {
  hexColor: string
  themeColorName: Colors
}

const getColorValues = (color: Colors): ColorValues => {
  const hexColor = color.startsWith('#') ? color : theme.color[color]
  const themeColorName = color.startsWith('#')
    ? (Object.entries(theme.color).find(
        ([_, value]) => value === color,
      )?.[0] as Colors)
    : color

  return { hexColor, themeColorName }
}

const useLatest = <T extends number>(value: T) => {
  const ref = useRef<T>()
  ref.current = value
  return ref
}

const roundByNum = (num: number, rounder: number) => {
  const multiplier = 1 / (rounder || 0.5)
  return Math.round(num * multiplier) / multiplier
}

const toFixedNumber = (num: number, digits: number, base: number) => {
  const pow = Math.pow(base || 10, digits)
  return Math.floor(num * pow) / pow
}

interface TrackProps {
  min: number
  max: number
  step?: number
  snap?: boolean
  trackStyle?: CSSProperties
  calculateCellStyle?: (index: number) => CSSProperties
  showLabel?: boolean
  showMinMaxLabels?: boolean
  showRemainderOverlay?: boolean
  showProgressOverlay?: boolean
  showToolTip?: boolean
  label?: {
    singular: string
    plural: string
  }
  rangeDates?: {
    start: {
      date: string | Date
      message: string
    }
    end: {
      date: string | Date
      message: string
    }
  }
  currentIndex: number
  onChange?: (index: number) => void
  onChangeEnd?(index: number): void

  labelMultiplier?: number
  textColor?: Colors
  progressOverlayColor?: Colors
}

const Slider = ({
  min = 0,
  max,
  step = 0.5,
  snap = true,
  trackStyle = { gridTemplateRows: 8 },
  calculateCellStyle,
  showLabel = false,
  showMinMaxLabels = false,
  showRemainderOverlay = true,
  showProgressOverlay = true,
  showToolTip = false,
  label,
  rangeDates,
  currentIndex,
  onChange,
  onChangeEnd,
  labelMultiplier = 1,
  textColor = 'blue400',
  progressOverlayColor = 'mint400',
}: TrackProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const ref = useRef(null)
  const size = useComponentSize(ref)
  const dragX = useRef<number>()
  const indexRef = useLatest(currentIndex)
  const stepCount = max - min
  const sizePerCell = size.width / stepCount
  const x = sizePerCell * currentIndex - sizePerCell * min
  const thumbRef = React.useRef<HTMLDivElement>(null)
  const remainderRef = React.useRef<HTMLDivElement>(null)
  const progressRef = React.useRef<HTMLDivElement>(null)

  const convertDeltaToIndex = (delta: number) => {
    const currentX = x + delta
    const roundedMin = toFixedNumber(min, 1, 10)
    dragX.current = Math.max(0, Math.min(size.width, currentX))
    // Get value to display in slider.
    // Get max if more or equal to max, get min if less or equal to min and then show rest with only one decimal point.
    const index =
      dragX.current / sizePerCell + min >= max
        ? max
        : dragX.current / sizePerCell + min <= min
        ? min
        : roundByNum(dragX.current / sizePerCell, step) === 0
        ? min
        : roundByNum(dragX.current / sizePerCell, step) + roundedMin
    return index
  }

  useEffect(() => {
    if (thumbRef.current != null && !isDragging) {
      thumbRef.current.style.transform = `translateX(${x}px)`
    }

    if (remainderRef.current != null) {
      remainderRef.current.style.left = `${x}px`
    }

    if (progressRef.current != null) {
      progressRef.current.style.width = `${x}px`
    }
  }, [isDragging, x])

  const hasAllRequiredForMinMaxLabels = () => {
    if (showMinMaxLabels) {
      if (hasValidLabels()) return true

      throw new Error(
        'The labels object has to be defined if you want to show the min max labels',
      )
    }
    return false
  }

  const hasAllRequiredForTooltip = () => {
    if (showToolTip) {
      if (hasValidLabels()) return true

      throw new Error(
        'The labels object has to be defined if you want to show the tooltip',
      )
    }
    return false
  }

  const hasValidLabels = () => {
    return label && label.singular && label.plural
  }

  const hasAllRequiredForLabels = () => {
    if (showLabel) {
      if (hasValidLabels()) return true

      throw new Error(
        'The labels object has to be defined if you want to show them',
      )
    }

    return false
  }

  const formatDates = (date: string | Date | undefined): string => {
    if (date === undefined) return ''

    if (typeof date === 'string') return date

    return date.toLocaleDateString('is-IS')
  }

  const hasAllLabels =
    hasAllRequiredForTooltip() &&
    hasAllRequiredForMinMaxLabels() &&
    hasAllRequiredForTooltip()

  const tooltipStyle = {
    transform: `translateX(${x}px)`,
    marginBottom: hasAllLabels ? '60px' : '30px',
  }

  const thumbStyle = {
    transform: `translateX(${dragX.current == null ? x : dragX.current}px)`,
    transition: isDragging ? 'none' : '',
    touchAction: 'none',
    '--thumb-color': getColorValues(progressOverlayColor).hexColor,
  }

  const remainderStyle = {
    left: `${dragX.current == null ? x : dragX.current}px`,
    transition: isDragging ? 'none' : '',
  }

  const progressStyle = {
    right: `${dragX.current == null ? x : dragX.current}px`,
    transition: isDragging ? 'none' : '',
    background: getColorValues(progressOverlayColor).hexColor,
  }

  const dragBind = useDrag({
    onDragMove(deltaX: number) {
      const index = convertDeltaToIndex(deltaX)

      if (onChange && index !== indexRef.current) {
        onChange(index)
      }

      if (thumbRef.current && dragX.current != null) {
        thumbRef.current.style.transform = `translateX(${dragX.current}px)`
      }

      if (remainderRef.current && dragX.current != null) {
        if (!snap) remainderRef.current.style.left = `${dragX.current}px`
      }

      if (progressRef.current && dragX.current != null) {
        if (!snap) progressRef.current.style.width = `${dragX.current}px`
      }
    },
    onDragStart() {
      setIsDragging(true)
    },
    onDragEnd(deltaX: number) {
      dragX.current = undefined
      if (onChangeEnd) {
        const index = convertDeltaToIndex(deltaX)
        onChangeEnd?.(index)
      }
      setIsDragging(false)
    },
  })

  const formatTooltip = (count: number, max?: number) => {
    let selectedAmount = count * labelMultiplier
    if (max) {
      const maxValue = max * labelMultiplier
      if (selectedAmount > maxValue) {
        selectedAmount = maxValue
      }
    }
    return count <= 1
      ? `${selectedAmount.toLocaleString('is-IS')} ${label?.singular}`
      : `${selectedAmount.toLocaleString('is-IS')} ${label?.plural}`
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (onChange == null) {
      return
    }
    switch (event.key) {
      case 'ArrowLeft':
        if (currentIndex > min) {
          onChange(Number(currentIndex) - step)
        }
        break
      case 'ArrowRight':
        if (currentIndex < max) {
          onChange(Number(currentIndex) + step)
        }
        break
    }
  }

  const onCellClick = (
    index: number,
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const percentClicked = event.nativeEvent.offsetX / rect.width
    const newIndex = Math.max(
      min,
      index + min + roundByNum(percentClicked, step),
    )
    onChange && onChange(newIndex)
    onChangeEnd?.(newIndex)
  }

  const textColorValues = getColorValues(textColor)

  let requiredMarginTop: BoxProps['marginTop'] = 0
  requiredMarginTop = hasAllRequiredForTooltip() ? 10 : 0
  if (hasAllRequiredForTooltip()) {
    // If there is a tooltip and we are using all labels, we can reduce the amount of margin top we need
    // because the labels themselves will provide some space
    requiredMarginTop = hasAllRequiredForLabels() ? 6 : requiredMarginTop
  }

  if (showRemainderOverlay && calculateCellStyle === undefined) {
    // Add a default background color here if none is defined
    calculateCellStyle = () => {
      return {
        background: theme.color.dark200,
      }
    }
  }

  return (
    <Box marginTop={requiredMarginTop}>
      {hasAllRequiredForMinMaxLabels() && (
        <Box display="flex" justifyContent="spaceBetween" width="full">
          <Text color={textColorValues.themeColorName} variant="eyebrow">
            {formatTooltip(min)}
          </Text>
          <Text color={textColorValues.themeColorName} variant="eyebrow">
            {formatTooltip(max)}
          </Text>
        </Box>
      )}
      {hasAllRequiredForLabels() && (
        <Text variant="h4" as="p" color={textColorValues.themeColorName}>
          {formatTooltip(currentIndex)}
        </Text>
      )}
      <Box
        className={styles.TrackGrid}
        marginTop={1}
        style={{
          gridTemplateColumns: `repeat(${Math.floor(stepCount)}, 1fr)`,
          ...trackStyle,
        }}
        ref={ref}
      >
        {Array.from({ length: stepCount }).map((_, index) => {
          return (
            <Box
              className={styles.TrackCell}
              key={index}
              style={calculateCellStyle?.(index)}
              onClick={(e) => onCellClick(index, e)}
            />
          )
        })}
        {hasAllRequiredForTooltip() && (
          <Tooltip
            style={tooltipStyle}
            atEnd={currentIndex === max}
            textColorOverwrite={textColorValues.hexColor}
          >
            {formatTooltip(currentIndex, max)}
          </Tooltip>
        )}
        <Box
          className={styles.Thumb}
          data-test="slider-thumb"
          style={thumbStyle}
          ref={thumbRef}
          {...dragBind}
          onKeyDown={onKeyDown}
          tabIndex={0}
        />
        {showRemainderOverlay && (
          <Box
            className={styles.remainderBar}
            style={remainderStyle}
            ref={remainderRef}
          />
        )}
        {showProgressOverlay && (
          <Box
            className={styles.progressBar}
            style={progressStyle}
            ref={progressRef}
          />
        )}
      </Box>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        width="full"
        marginTop={9}
      >
        {rangeDates && (
          <>
            <Box>
              <Text color={textColorValues.themeColorName} variant="eyebrow">
                {rangeDates.start.message}
              </Text>

              <Text
                color={textColorValues.themeColorName}
                variant="eyebrow"
                fontWeight="semiBold"
              >
                {formatDates(rangeDates.start.date)}
              </Text>
            </Box>

            <Box textAlign="right">
              <Text color={textColorValues.themeColorName} variant="eyebrow">
                {rangeDates.end.message}
              </Text>

              <Text
                color={textColorValues.themeColorName}
                variant="eyebrow"
                fontWeight="semiBold"
              >
                {formatDates(rangeDates.end.date)}
              </Text>
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}

export default Slider
