import React, { useState } from 'react'
import { uniqueId } from 'lodash'
import cn from 'classnames'
import styles from './Input.module.scss'

interface InputProps {
  label: string,
  hasError?: boolean,
  errorMessage?: string
}

export const Input: React.FC<InputProps & React.HTMLProps<HTMLInputElement>> = ({
  label,
  hasError = false,
  errorMessage = '',
  ...inputProps
}) => {
  const [ id ] = useState(() => uniqueId('input-'))
  return (
    <div className={cn(styles.container, {
      [styles.hasError]: hasError
    })}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      <input
        className={styles.input}
        id={id}
        {...inputProps}
      />
      {hasError && errorMessage && (
        <span className={styles.errorMessage}>{errorMessage}</span>
      )}
    </div>
  )
}

export default Input
