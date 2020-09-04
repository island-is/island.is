import React, { CSSProperties, FC, useRef, useState, useEffect } from 'react'
import useComponentSize from '@rehooks/component-size'

import * as styles from './Slider.treat'
import { Box, Typography } from '@island.is/island-ui/core'

interface TooltipProps {
  style?: CSSProperties
  atEnd?: boolean
}

const Tooltip: FC<TooltipProps> = ({ style, atEnd = false, children }) => (
  <Box
    style={style}
    data-test="slider-tooltip"
    className={styles.TooltipContainer}
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

const useLatest = <T extends any>(value: T) => {
  const ref = useRef<T>()
  ref.current = value
  return ref
}

interface UseDragOptions {
  onDragStart?: () => void
  onDragEnd?: (delta: number) => void
  onDragMove?: (delta: number) => void
}

const roundByNum = (num: number, rounder: number) => {
  var multiplier = 1 / (rounder || 0.5)
  return Math.round(num * multiplier) / multiplier
}

const isMouseEvent = <T extends any>(
  event: React.MouseEvent<T, MouseEvent> | React.TouchEvent<T>,
): event is React.MouseEvent<T, MouseEvent> => {
  return event.nativeEvent instanceof MouseEvent
}

const useDrag = ({ onDragStart, onDragEnd, onDragMove }: UseDragOptions) => {
  const start = useRef(0)

  const handleDragMove = (event: MouseEvent | TouchEvent) => {
    const x =
      event instanceof MouseEvent ? event.clientX : event.targetTouches[0].pageX
    const deltaX = x - start.current

    if (onDragMove) {
      onDragMove(deltaX)
    }
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent) => {
    document.removeEventListener('mouseup', handleDragEnd)
    document.removeEventListener('touchend', handleDragEnd)
    document.removeEventListener('mousemove', handleDragMove)
    document.removeEventListener('touchmove', handleDragMove)

    const x =
      event instanceof MouseEvent ? event.clientX : event.targetTouches[0].pageX
    const deltaX = x - start.current

    if (onDragEnd) {
      onDragEnd(deltaX)
    }
  }

  const handleDragStart = (
    event: React.MouseEvent<any, MouseEvent> | React.TouchEvent<any>,
  ) => {
    start.current = isMouseEvent(event)
      ? event.clientX
      : event.targetTouches[0].pageX
    document.addEventListener('mousemove', handleDragMove)
    document.addEventListener('touchmove', handleDragMove)
    document.addEventListener('mouseup', handleDragEnd)
    document.addEventListener('touchend', handleDragEnd)

    if (onDragStart) {
      onDragStart()
    }
  }

  return {
    onMouseDown: handleDragStart,
    onTouchStart: handleDragStart,
  }
}

interface TrackProps {
  totalCells: number
  sharedCells: number
  currentIndex: number
  onChange?: (index: number) => void
  step?: number
  showToolTip?: boolean
  showLabel?: boolean
  showRemainderOverlay?: boolean
  fadeRemainderCells?: boolean
}

const Slider = ({
  totalCells,
  sharedCells,
  currentIndex,
  onChange,
  step = 0.5,
  showToolTip = false,
  showLabel = true,
  showRemainderOverlay = true,
  fadeRemainderCells = false,
}: TrackProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const ref = useRef(null)
  const size = useComponentSize(ref)
  const dragX = useRef<number>()
  const indexRef = useLatest(currentIndex)
  const sizePerCell = size.width / totalCells
  const x = sizePerCell * currentIndex

  useEffect(() => {
    if (thumbRef.current != null && !isDragging) {
      thumbRef.current.style.transform = `translateX(${x}px)`
    }

    if (remainderRef.current != null) {
      remainderRef.current.style.transform = `translateX(${x}px)`
    }
  }, [isDragging, x])

  const tooltipStyle = { transform: `translateX(${x}px)` }
  const thumbStyle = {
    transform: `translateX(${dragX.current == null ? x : dragX.current}px)`,
    transition: isDragging ? 'none' : '',
  }

  const thumbRef = React.useRef<HTMLDivElement>(null)
  const remainderRef = React.useRef<HTMLDivElement>(null)

  const dragBind = useDrag({
    onDragMove(deltaX) {
      const currentX = x + deltaX
      dragX.current = Math.max(1 * sizePerCell, Math.min(size.width, currentX))
      const index = roundByNum(dragX.current / sizePerCell, step)

      if (onChange && index !== indexRef.current) {
        onChange(index)
      }

      if (thumbRef.current && dragX.current != null) {
        thumbRef.current.style.transform = `translateX(${dragX.current}px)`
      }

      if (remainderRef.current && dragX.current != null) {
        remainderRef.current.style.transform = `translateX(${dragX.current}px)`
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
    count === 1 ? '1 mánuður' : `${count} mánuðir`

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (onChange == null) {
      return
    }
    switch (event.key) {
      case 'ArrowLeft':
        if (currentIndex > 1) {
          onChange(currentIndex - step)
        }
        break
      case 'ArrowRight':
        if (currentIndex < totalCells) {
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
    onChange && onChange(index + roundByNum(percentClicked, step))
  }

  return (
    <Box>
      {showLabel && (
        <Typography variant="h4" as="p">
          {formatTooltip(currentIndex)}
        </Typography>
      )}
      <Box
        className={styles.TrackGrid}
        marginTop={1}
        style={{ gridTemplateColumns: `repeat(${totalCells || 12}, 1fr)` }}
        ref={ref}
      >
        {Array.from({ length: totalCells }).map((_, index) => {
          const isShared = index >= totalCells - sharedCells
          const isActive = index < currentIndex
          return (
            <Box
              className={styles.TrackCell}
              key={index}
              style={{
                background: isShared ? '#00E4CA' : '#0061FF',
                opacity: isActive ? 1 : fadeRemainderCells && 0.3,
              }}
              onClick={(e) => onCellClick(index, e)}
            />
          )
        })}
        {showToolTip && (
          <Tooltip style={tooltipStyle} atEnd={currentIndex === totalCells}>
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
            style={thumbStyle}
            ref={remainderRef}
          />
        )}
      </Box>
    </Box>
  )
}

export default Slider
