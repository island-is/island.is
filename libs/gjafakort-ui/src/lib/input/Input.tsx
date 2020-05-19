import React, { useState, useRef, forwardRef } from 'react'
import cn from 'classnames'
import * as styles from './Input.treat'

interface InputProps {
  label: string
  name: string
  id?: string
  value?: string | number
  disabled?: boolean
  hasError?: boolean
  errorMessage?: string
  placeholder?: string
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
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
      name,
      hasError = false,
      value,
      errorMessage = '',
      id = name,
      disabled,
      onFocus,
      onBlur,
      placeholder,
      ...inputProps
    } = props
    const [hasFocus, setHasFocus] = useState(false)
    const inputRef = useRef(null)

    return (
      <div>
        <div
          className={cn(styles.container, {
            [styles.hasError]: hasError,
            [styles.hasFocus]: hasFocus,
            [styles.containerDisabled]: disabled,
          })}
          onClick={(e) => {
            e.preventDefault()
            if (inputRef.current) {
              inputRef.current.focus()
            }
          }}
        >
          <label
            htmlFor={id}
            className={cn(styles.label, {
              [styles.labelDisabledEmptyInput]: disabled && !value,
            })}
          >
            {label}
          </label>
          <input
            className={styles.input}
            id={id}
            disabled={disabled}
            name={name}
            ref={mergeRefs([inputRef, ref])}
            placeholder={placeholder}
            value={value}
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
            {...inputProps}
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
