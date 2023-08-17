import React, { CSSProperties, FC, useRef, useState, useEffect } from 'react'
import useComponentSize from '@rehooks/component-size'
import { useDrag } from '../utils'

import * as styles from './Slider.css'
import { Box, Text } from '@island.is/island-ui/core'

interface TooltipProps {
  style?: CSSProperties
  atEnd?: boolean
}

const Tooltip: FC<React.PropsWithChildren<TooltipProps>> = ({
  style,
  atEnd = false,
  children,
}) => (
  <Box
    data-test="slider-tooltip"
    className={styles.TooltipContainer}
    style={style}
  >
    <Box
      className={styles.TooltipBox}
      style={{
        transform: `translateX(${atEnd ? -85 : -50}%)`,
      }}
    >
      {children}
    </Box>
  </Box>
)

const useLatest = <T extends number>(value: T) => {
  const ref = useRef<T>()
  ref.current = value
  return ref
}

const roundByNum = (num: number, rounder: number) => {
  const multiplier = 1 / (rounder || 0.5)
  return Math.round(num * multiplier) / multiplier
}

interface TrackProps {
  min: number
  max: number
  step?: number
  snap?: boolean
  trackStyle?: CSSProperties
  calculateCellStyle: (index: number) => CSSProperties
  showLabel?: boolean
  showMinMaxLabels?: boolean
  showRemainderOverlay?: boolean
  showProgressOverlay?: boolean
  showToolTip?: boolean
  label: {
    singular: string
    plural: string
  }
  currentIndex: number
  onChange?: (index: number) => void
}

const Slider = ({
  min = 0,
  max,
  step = 0.5,
  snap = true,
  trackStyle,
  calculateCellStyle,
  showLabel = false,
  showMinMaxLabels = false,
  showRemainderOverlay = true,
  showProgressOverlay = true,
  showToolTip = false,
  label,
  currentIndex,
  onChange,
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

  const tooltipStyle = { transform: `translateX(${x}px)` }
  const thumbStyle = {
    transform: `translateX(${dragX.current == null ? x : dragX.current}px)`,
    transition: isDragging ? 'none' : '',
    touchAction: 'none',
  }
  const remainderStyle = {
    left: `${dragX.current == null ? x : dragX.current}px`,
    transition: isDragging ? 'none' : '',
  }
  const progressStyle = {
    right: `${dragX.current == null ? x : dragX.current}px`,
    transition: isDragging ? 'none' : '',
  }

  const dragBind = useDrag({
    onDragMove(deltaX) {
      const currentX = x + deltaX
      dragX.current = Math.max(0, Math.min(size.width, currentX))
      const index = roundByNum(dragX.current / sizePerCell, step) + min

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
    onDragEnd() {
      dragX.current = undefined
      setIsDragging(false)
    },
  })

  const formatTooltip = (count: number) =>
    count <= 1
      ? `${currentIndex} ${label.singular}`
      : `${count} ${label.plural}`

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (onChange == null) {
      return
    }
    switch (event.key) {
      case 'ArrowLeft':
        if (currentIndex > min) {
          onChange(currentIndex - step)
        }
        break
      case 'ArrowRight':
        if (currentIndex < max) {
          onChange(currentIndex + step)
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
  }

  return (
    <Box>
      {showMinMaxLabels && (
        <Box display="flex" justifyContent="spaceBetween" width="full">
          <Text color="blue400" variant="eyebrow">
            {formatTooltip(min)}
          </Text>
          <Text color="blue400" variant="eyebrow">
            {formatTooltip(max)}
          </Text>
        </Box>
      )}
      {showLabel && (
        <Text variant="h4" as="p">
          {formatTooltip(currentIndex)}
        </Text>
      )}
      <Box
        className={styles.TrackGrid}
        marginTop={1}
        style={{
          gridTemplateColumns: `repeat(${stepCount}, 1fr)`,
          ...trackStyle,
        }}
        ref={ref}
      >
        {Array.from({ length: stepCount }).map((_, index) => {
          return (
            <Box
              className={styles.TrackCell}
              key={index}
              style={calculateCellStyle(index)}
              onClick={(e) => onCellClick(index, e)}
            />
          )
        })}
        {showToolTip && (
          <Tooltip style={tooltipStyle} atEnd={currentIndex === max}>
            {formatTooltip(currentIndex)}
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
    </Box>
  )
}

export default Slider
