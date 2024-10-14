import React, { useRef } from 'react'

interface UseDragOptions {
  onDragStart?: () => void
  onDragEnd?: (delta: number) => void
  onDragMove?: (delta: number) => void
}

interface PointerInfo {
  id: number
  startX: number
}

export const useDrag = ({
  onDragStart,
  onDragEnd,
  onDragMove,
}: UseDragOptions) => {
  const pointerInfo = useRef<PointerInfo | null>(null)

  const handleDragStart = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0) {
      return
    }
    event.preventDefault()

    pointerInfo.current = { id: event.pointerId, startX: event.clientX }

    event.currentTarget.setPointerCapture(event.pointerId)
    event.currentTarget.addEventListener('pointermove', handleDragMove)
    event.currentTarget.addEventListener('pointerup', handleDragEnd)
    event.currentTarget.addEventListener('pointercancel', handleDragEnd)

    if (onDragStart) {
      onDragStart()
    }
  }

  const handleDragMove = (event: PointerEvent) => {
    if (
      pointerInfo.current === null ||
      pointerInfo.current?.id !== event.pointerId
    ) {
      return
    }
    event.preventDefault()

    const deltaX = event.clientX - pointerInfo.current.startX

    if (onDragMove) {
      onDragMove(deltaX)
    }
  }

  const handleDragEnd = (event: PointerEvent) => {
    if (
      event.button !== 0 ||
      pointerInfo.current === null ||
      pointerInfo.current?.id !== event.pointerId
    ) {
      return
    }
    event.preventDefault()

    const deltaX = event.clientX - pointerInfo.current.startX
    pointerInfo.current = null

    if (event.currentTarget && event.currentTarget instanceof HTMLElement) {
      event.currentTarget.removeEventListener('pointermove', handleDragMove)
      event.currentTarget.removeEventListener('pointerup', handleDragEnd)
      event.currentTarget.removeEventListener('pointercancel', handleDragEnd)
    }

    if (onDragEnd) {
      onDragEnd(deltaX)
    }
  }

  return {
    onPointerDown: handleDragStart,
  }
}
