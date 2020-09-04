import React, { CSSProperties, FC, useRef, useState } from 'react'
import useComponentSize from '@rehooks/component-size'

import * as styles from './Slider.treat'
import { Box } from '@island.is/island-ui/core'

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

// const TrackGrid = styled.div<{ cells: number }>`
//   display: grid;
//   grid-template-columns: repeat(${({ cells = 12 }) => cells}, 1fr);
//   grid-template-rows: 40px;
//   grid-gap: 2px;
//   position: relative;
//   margin: 64px 10px;
// `

// const TrackCell = styled.div<{ isShared: boolean; isActive: boolean }>`
//   background: ${({ isShared }) => (isShared ? '#00E4CA' : '#0061FF')};
//   opacity: ${({ isActive }) => (isActive ? 1 : 0.3)};
// `

const useLatest = <T extends any>(value: T) => {
  const ref = useRef<T>()
  ref.current = value
  return ref
}

interface UseDragOptions {
  onDragStart?: () => void
  onDragEnd?: () => void
  onDragMove?: (delta: number) => void
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

  const handleDragEnd = () => {
    document.removeEventListener('mouseup', handleDragEnd)
    document.removeEventListener('touchend', handleDragEnd)
    document.removeEventListener('mousemove', handleDragMove)
    document.removeEventListener('touchmove', handleDragMove)

    if (onDragEnd) {
      onDragEnd()
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
}

const Slider = ({
  totalCells,
  sharedCells,
  currentIndex,
  onChange,
}: TrackProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const ref = useRef(null)
  const size = useComponentSize(ref)
  const dragX = useRef<number>()
  const indexRef = useLatest(currentIndex)
  const sizePerCell = size.width / totalCells
  const x = sizePerCell * currentIndex

  const tooltipStyle = { transform: `translateX(${x}px)` }
  const thumbStyle = {
    transform: `translateX(${dragX.current == null ? x : dragX.current}px)`,
    transition: isDragging ? 'none' : '',
  }

  const thumbRef = React.useRef<HTMLDivElement>(null)

  const dragBind = useDrag({
    onDragMove(deltaX) {
      const currentX = x + deltaX
      dragX.current = Math.max(1 * sizePerCell, Math.min(size.width, currentX))
      const index = Math.round(dragX.current / sizePerCell)

      if (onChange && index !== indexRef.current) {
        onChange(index)
      }

      if (thumbRef.current && dragX.current != null) {
        thumbRef.current.style.transform = `translateX(${dragX.current}px)`
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
          onChange(currentIndex - 1)
        }
        break
      case 'ArrowRight':
        if (currentIndex < totalCells) {
          onChange(currentIndex + 1)
        }
        break
    }
  }

  return (
    <Box
      className={styles.TrackGrid}
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
              opacity: isActive ? 1 : 0.3,
            }}
            onClick={() => onChange && onChange(index + 1)}
          />
        )
      })}
      <Tooltip style={tooltipStyle} atEnd={currentIndex === totalCells}>
        {formatTooltip(currentIndex)}
      </Tooltip>
      <Box
        className={styles.Thumb}
        data-test="slider-thumb"
        style={thumbStyle}
        ref={thumbRef}
        {...dragBind}
        onKeyDown={onKeyDown}
        tabIndex={0}
      />
    </Box>
  )
}

export default Slider
