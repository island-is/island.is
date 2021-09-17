import React, { useEffect, useMemo, useRef } from 'react'
import { Input } from '@island.is/island-ui/core'

import { PlainText } from '@hugsmidjan/regulations-editor/types'
import debounce from 'lodash/debounce'

const setAutoHeight = (textarea: HTMLTextAreaElement | null) => {
  if (!textarea) {
    return
  }
  const { style } = textarea
  style.opacity = '0'
  style.height = 'auto'
  style.height = textarea.scrollHeight + 'px'
  style.opacity = ''
}

// ---------------------------------------------------------------------------

export type MagicTextareaProps = {
  label: string
  value?: PlainText
  defaultValue?: PlainText
  name?: string
  onBlur?: (value: PlainText) => void
  onChange?: (value: PlainText) => void
  errorMessage?: string
  hasError?: boolean
  rows?: number
  required?: boolean
}

export const MagicTextarea = (props: MagicTextareaProps) => {
  const {
    label,
    name,
    value,
    defaultValue,
    onBlur,
    onChange,
    errorMessage,
    hasError,
    rows,
    required,
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
      onFocus={() => setAutoHeight(elmRef.current)}
      onBlur={onBlur && ((e) => onBlur(e.currentTarget.value))}
      onChange={(e) => {
        onChange && onChange(e.currentTarget.value)
        setAutoHeightDebounced()
      }}
      errorMessage={errorMessage}
      hasError={hasError}
      required={required}
      textarea
      rows={rows || 1}
      ref={elmRef}
    />
  )
}
