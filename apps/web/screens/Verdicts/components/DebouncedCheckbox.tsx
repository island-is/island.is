import { useRef, useState } from 'react'
import { useDebounce } from 'react-use'

import { Checkbox } from '@island.is/island-ui/core'

interface DebouncedCheckboxProps {
  label: string
  value: string
  checked: boolean
  onChange: (state: boolean) => void
  debounceTimeInMs: number
}

export const DebouncedCheckbox = ({
  label,
  value,
  checked,
  onChange,
  debounceTimeInMs,
}: DebouncedCheckboxProps) => {
  const [state, setState] = useState(checked)
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
    <Checkbox
      id={value}
      key={value}
      name={value}
      label={label}
      checked={state}
      onChange={(event) => {
        setState(Boolean(event.target.checked))
      }}
    />
  )
}
