import React, { useState, useRef, forwardRef } from 'react'
import cn from 'classnames'
import styles from './Input.module.scss'

interface InputProps {
  label: string
  hasError?: boolean
  errorMessage?: string
  placeholder?: string
  id?: string
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
}

function mergeRefs(refs) {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value)
      } else if (ref != null) {
        ref.current = value
      }
    })
  }
}

export const Input = forwardRef(
  (props: InputProps, ref?: React.Ref<HTMLInputElement>) => {
    const {
      label,
      hasError = false,
      errorMessage = '',
      id,
      onFocus,
      onBlur,
      placeholder,
    } = props
    const [hasFocus, setHasFocus] = useState(false)
    const inputRef = useRef(null)

    return (
      <div>
        <div
          className={cn(styles.container, {
            [styles.hasError]: hasError,
            [styles.hasFocus]: hasFocus,
          })}
          onClick={(e) => {
            e.preventDefault()
            if (inputRef.current) {
              inputRef.current.focus()
            }
          }}
        >
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
          <input
            className={styles.input}
            id={id}
            ref={mergeRefs([inputRef, ref])}
            placeholder={placeholder}
            onFocus={(e) => {
              setHasFocus(true)
              if (onFocus) {
                onFocus(e)
              }
            }}
            onBlur={(e) => {
              setHasFocus(false)
              if (onBlur) {
                onBlur(e)
              }
            }}
          />
        </div>
        {hasError && errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}
      </div>
    )
  },
)

export default Input
