import { useRef, useState } from 'react'
import { useDebounce } from 'react-use'

import { Input, type InputProps } from '@island.is/island-ui/core'

const handleInputKeyDown = (ev: { key: string; target: unknown }) => {
  if (ev.key === 'Enter') {
    // Remove focus from input field after pressing enter
    ;(ev.target as { blur?: () => void })?.blur?.()
  }
}

interface DebouncedInputProps {
  value: string
  label?: string
  name: string
  placeholder?: string
  size?: InputProps['size']
  onChange: (newState: string) => void
  icon?: InputProps['icon']
  loading?: boolean
  backgroundColor?: InputProps['backgroundColor']
  debounceTimeInMs: number
}

export const DebouncedInput = ({
  value,
  label,
  name,
  placeholder,
  backgroundColor,
  size = 'sm',
  onChange,
  loading,
  icon,
  debounceTimeInMs,
}: DebouncedInputProps) => {
  const [state, setState] = useState(value)
  const initialRender = useRef(true)

  useDebounce(
    () => {
      if (initialRender.current) {
        initialRender.current = false
        return
      }
      onChange(state)
    },
    debounceTimeInMs,
    [state],
  )

  return (
    <Input
      size={size}
      label={label}
      name={name}
      icon={icon}
      loading={loading}
      placeholder={placeholder}
      backgroundColor={backgroundColor}
      onChange={(ev) => {
        setState(ev.target.value)
      }}
      onKeyDown={handleInputKeyDown}
      value={state}
    />
  )
}
