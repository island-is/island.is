import { useRef, useState } from 'react'
import { useDebounce } from 'react-use'

import { DatePicker } from '@island.is/island-ui/core'

interface DebouncedDatePickerProps {
  label: string
  name: string
  value: Date | null
  minDate?: Date | null
  maxDate?: Date | null
  handleChange: (_: Date | null) => void
  debounceTimeInMs: number
}

export const DebouncedDatePicker = ({
  label,
  name,
  maxDate,
  minDate,
  value,
  handleChange,
  debounceTimeInMs,
}: DebouncedDatePickerProps) => {
  const [state, setState] = useState(value)
  const initialRender = useRef(true)
  useDebounce(
    () => {
      if (initialRender.current) {
        initialRender.current = false
        return
      }
      handleChange(state)
    },
    debounceTimeInMs,
    [state],
  )

  return (
    <DatePicker
      name={name}
      label={label}
      placeholderText=""
      size="sm"
      handleChange={(date) => {
        setState(date)
      }}
      selected={state}
      maxDate={maxDate}
      minDate={minDate}
    />
  )
}
