import { Input } from '@island.is/island-ui/core'
import React, { useContext, useState, useCallback, ChangeEvent } from 'react'

import * as styles from './NumberInput.css'

interface Props {
  id: string
  maximumInputLength: number
  placeholder: string
  onUpdate(n: number): void
  label: string
  name: string
}

export default function NumberInput({
  maximumInputLength,
  onUpdate,
  placeholder,
  id,
  label,
  name,
}: Props) {
  const sanitizeNumber = (n: string) => n.replace(/[^\d]/g, '')
  const formatNumber = (n: string) => Number(n).toLocaleString('de-DE')

  const [text, setText] = useState<string>('')

  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = ev.currentTarget.value

      const formattedValue = formatNumber(sanitizeNumber(value))
      console.log(formattedValue)
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
