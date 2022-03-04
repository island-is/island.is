import React, { useRef } from 'react'

interface UseDragOptions {
  onDragStart?: () => void
  onDragEnd?: (delta: number) => void
  onDragMove?: (delta: number) => void
}

const isMouseEvent = <T extends HTMLElement>(
  event: React.MouseEvent<T, MouseEvent> | React.TouchEvent<T>,
): event is React.MouseEvent<T, MouseEvent> => {
  return event.nativeEvent instanceof MouseEvent
}

export const useDrag = ({
  onDragStart,
  onDragEnd,
  onDragMove,
}: UseDragOptions) => {
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
    event:
      | React.MouseEvent<HTMLElement, MouseEvent>
      | React.TouchEvent<HTMLElement>,
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
