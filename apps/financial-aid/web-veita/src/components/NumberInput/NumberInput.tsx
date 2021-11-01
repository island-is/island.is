import React, { useContext, useState, useCallback, ChangeEvent } from 'react'

import * as styles from './NumberInput.css'

interface Props {
  maximumInputLength: number
  placeholder: string
  onUpdate(n: number): void
}

export default function NumberInput({
  maximumInputLength,
  onUpdate,
  placeholder,
}: Props) {
  const sanitizeNumber = (n: string) => n.replace(/[^\d]/g, '')
  const formatNumber = (n: string) => Number(n).toLocaleString('de-DE')

  const [text, setText] = useState<string>('')

  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
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
    <input
      value={text}
      onChange={handleChange}
      type="text"
      placeholder={placeholder}
      className={`${styles.inputStyle}`}
    />
  )
}
