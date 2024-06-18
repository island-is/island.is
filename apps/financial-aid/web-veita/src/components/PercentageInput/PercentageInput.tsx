import { Input } from '@island.is/island-ui/core'
import React, { useEffect, useRef } from 'react'

interface Props {
  id: string
  onUpdate(n: number): void
  name: string
  label?: string
  value?: string
  hasError?: boolean
  errorMessage?: string
}

export const PercentageInput = ({
  onUpdate,
  id,
  name,
  label,
  value,
  hasError = false,
  errorMessage,
}: Props) => {
  const liabilityPercentageRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const input = liabilityPercentageRef.current

    if (!input) {
      return
    }

    const handleCursor = (target: HTMLInputElement) => {
      const cursorPosition = target.selectionStart
      const lastPosition = target.value.length
      if (cursorPosition === lastPosition) {
        target.setSelectionRange(lastPosition - 1, lastPosition - 1)
      }
    }

    const handleClick = (e: MouseEvent) => {
      handleCursor(e.target as HTMLInputElement)
    }

    const handleKeyup = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Backspace') {
        handleCursor(e.target as HTMLInputElement)
      }
    }

    handleCursor(input)
    input.addEventListener('click', handleClick)
    input.addEventListener('keyup', handleKeyup)

    return () => {
      input.removeEventListener('click', handleClick)
      input.removeEventListener('keyup', handleKeyup)
    }
  }, [value])

  return (
    <Input
      ref={liabilityPercentageRef}
      id={id}
      label={label}
      name={name}
      value={`${value}%`}
      type="text"
      backgroundColor="blue"
      hasError={hasError}
      maxLength={4}
      onChange={(e) => {
        const number = isNaN(parseInt(e.target.value.slice(0, -1)))
          ? 0
          : parseInt(e.target.value.slice(0, -1))
        onUpdate(number)
      }}
      errorMessage={errorMessage}
    />
  )
}

export default PercentageInput
