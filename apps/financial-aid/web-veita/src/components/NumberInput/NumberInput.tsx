import { Input } from '@island.is/island-ui/core'
import React, { useState, useCallback, ChangeEvent, useEffect } from 'react'

interface Props {
  id: string
  maximumInputLength: number
  onUpdate(n: number): void
  name: string
  label?: string
  placeholder?: string
  value: string
}

export default function NumberInput({
  maximumInputLength,
  onUpdate,
  id,
  name,
  label,
  placeholder,
  value,
}: Props) {
  const sanitizeNumber = (n: string) => n.replace(/[^\d]/g, '')
  const formatNumber = (n: string) => Number(n).toLocaleString('de-DE')
  const [text, setText] = useState<string>(formatNumber(value))

  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = ev.currentTarget.value
      const formattedValue = formatNumber(sanitizeNumber(value))
      if (sanitizeNumber(value).length > maximumInputLength) {
        return
      }
      setText(formattedValue)
      onUpdate(Number(sanitizeNumber(value)))
    },
    [onUpdate],
  )

  return (
    <Input
      id={id}
      label={label}
      name={name}
      value={text}
      type="text"
      placeholder={placeholder}
      backgroundColor="blue"
      onChange={handleChange}
    />
  )
}
