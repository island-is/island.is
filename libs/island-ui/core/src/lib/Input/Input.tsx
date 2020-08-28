import React, { useState, useRef, forwardRef } from 'react'
import cn from 'classnames'
import * as styles from './Input.treat'
import { Box } from '../Box'
import Tooltip from '../Tooltip/Tooltip'

interface InputProps {
  autoFocus?: boolean
  name: string
  label?: string
  id?: string
  value?: string | number
  disabled?: boolean
  hasError?: boolean
  errorMessage?: string
  placeholder?: string
  tooltip?: string
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
      tooltip,
      ...inputProps
    } = props
    const [hasFocus, setHasFocus] = useState(false)
    const inputRef = useRef(null)
    const ariaError = hasError
      ? {
          'aria-invalid': true,
          'aria-describedby': id,
        }
      : {}

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
            {tooltip && (
              <Box marginLeft={1} display="inlineBlock">
                <Tooltip text={tooltip} />
              </Box>
            )}
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
            {...ariaError}
            {...inputProps}
          />
        </div>
        {hasError && errorMessage && (
          <div className={styles.errorMessage} id={id}>
            {errorMessage}
          </div>
        )}
      </div>
    )
  },
)

export default Input
