import { useEffect, useMemo, useRef } from 'react'
import { Input } from '@island.is/island-ui/core'

import { PlainText } from '@dmr.is/regulations-tools/types'
import debounce from 'lodash/debounce'

const setAutoHeight = (textarea: HTMLTextAreaElement | null) => {
  if (!textarea) {
    return
  }
  const { style } = textarea
  style.opacity = '0'
  style.height = 'auto'
  const newHeight = textarea.scrollHeight
  style.height = newHeight >= 8 ? `${newHeight}px` : ''
  style.opacity = ''
}

// ---------------------------------------------------------------------------

export type MagicTextareaProps = {
  label: string
  value?: PlainText
  defaultValue?: PlainText
  name?: string
  onFocus?: () => void
  onBlur?: (value: PlainText) => void
  onChange?: (value: PlainText) => void
  error?: string
  rows?: number
  required?: boolean
  readOnly?: boolean
  disabled?: boolean
}

export const MagicTextarea = (props: MagicTextareaProps) => {
  const {
    label,
    name,
    value,
    defaultValue,
    onFocus,
    onBlur,
    onChange,
    error,
    rows,
    required,
    readOnly,
    disabled,
  } = props

  const elmRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => setAutoHeight(elmRef.current), [])

  const setAutoHeightDebounced = useMemo(
    () => debounce(() => setAutoHeight(elmRef.current), 100),
    [],
  )

  return (
    <Input
      label={label}
      name={name || ''}
      defaultValue={defaultValue}
      value={value}
      onFocus={() => {
        onFocus && onFocus()
        setAutoHeight(elmRef.current)
      }}
      onBlur={onBlur && ((e) => onBlur(e.currentTarget.value))}
      onChange={(e) => {
        onChange && onChange(e.currentTarget.value)
        setAutoHeightDebounced()
      }}
      hasError={!!error}
      errorMessage={error}
      required={required}
      textarea
      rows={rows || 1}
      ref={elmRef}
      backgroundColor="blue"
      readOnly={readOnly}
      disabled={disabled}
    />
  )
}
