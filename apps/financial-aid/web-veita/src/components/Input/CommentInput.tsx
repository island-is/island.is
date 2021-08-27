import React, { useContext, useState, useCallback, ChangeEvent } from 'react'

import * as styles from './Input.treat'

interface Props {
  placeholder: string
  onUpdate(n: string): void
}

export default function CommentInput({ onUpdate, placeholder }: Props) {
  const [text, setText] = useState<string>('')

  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const value = ev.currentTarget.value
      setText(value)
      onUpdate(value)
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
