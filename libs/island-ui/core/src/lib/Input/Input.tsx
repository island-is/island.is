import React, { useState, useRef, forwardRef } from 'react'
import cn from 'classnames'
import * as styles from './Input.treat'
import { Box } from '../Box'
import Tooltip from '../Tooltip/Tooltip'

type InputBackgroundColor = 'white' | 'blue'

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
  backgroundColor?: InputBackgroundColor
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function setRefs<T>(ref: React.Ref<T>, value: T) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(ref as any).current = value
  }
}

function useMergeRefs<ForwardRef, LocalRef extends ForwardRef>(
  forwardedRef: React.Ref<ForwardRef>,
  localRef: React.Ref<LocalRef>,
): (instance: LocalRef | null) => void {
  return React.useCallback(
    (value) => {
      setRefs(forwardedRef, value)
      setRefs(localRef, value)
    },
    [forwardedRef, localRef],
  )
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
      backgroundColor = 'white',
      ...inputProps
    } = props
    const [hasFocus, setHasFocus] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const ariaError = hasError
      ? {
          'aria-invalid': true,
          'aria-describedby': id,
        }
      : {}
    const mergedRefs = useMergeRefs(inputRef, ref || null)

    return (
      <div>
        <div
          className={cn(
            styles.container,
            styles.containerBackgrounds[backgroundColor],
            {
              [styles.hasError]: hasError,
              [styles.hasFocus]: hasFocus,
              [styles.containerDisabled]: disabled,
            },
          )}
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
            ref={mergedRefs}
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
