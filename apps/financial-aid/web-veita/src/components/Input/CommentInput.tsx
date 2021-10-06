import React, { useState, useCallback, ChangeEvent } from 'react'
import { Input } from '@island.is/island-ui/core'

import * as styles from './Input.treat'

interface Props {
  label?: string
  placeholder: string
  onUpdate(n: string): void
}

export default function CommentInput({ onUpdate, placeholder, label }: Props) {
  const [text, setText] = useState<string>('')

  const handleChange = useCallback(
    (ev: any) => {
      const value = ev.currentTarget.value
      setText(value)
      onUpdate(value)
    },
    [onUpdate],
  )

  return (
    // <Input
    //   // value={text}
    //   // onChange={(event) => {
    //   //   onUpdate(event.currentTarget.value)
    //   // }}
    //   // type="text"
    //   // placeholder={placeholder}
    //   // backgroundColor="blue"
    //   backgroundColor="blue"
    //   label={label}
    //   name="comment"
    //   value={text}
    //   placeholder={placeholder}
    //   onChange={(event) => {
    //     setText(event.currentTarget.value)
    //   }}
    // />
    <input
      value={text}
      onChange={handleChange}
      type="text"
      placeholder={placeholder}
      className={`${styles.inputStyle}`}
    />
  )
}
