import { useRef, useState } from 'react'
import { useDebounce } from 'react-use'

import { DatePicker } from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'

const CURRENT_YEAR = new Date().getFullYear()
const MIN_YEAR = 1900

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
  const { activeLocale } = useI18n()
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
      minYear={minDate ? minDate.getFullYear() : MIN_YEAR}
      maxYear={maxDate ? maxDate.getFullYear() : CURRENT_YEAR}
      locale={activeLocale}
    />
  )
}
