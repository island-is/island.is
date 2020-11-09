import React, { useState, useRef, forwardRef } from 'react'
import cn from 'classnames'
import * as styles from './Input.treat'
import { Box } from '../Box/Box'
import { Tooltip } from '../Tooltip/Tooltip'
import { Icon } from '../IconRC/Icon'
import { Icon as IconType, Type } from '../IconRC/iconMap'

export type InputBackgroundColor = 'white' | 'blue'

interface InputComponentProps {
  name: string
  value?: string | number
  defaultValue?: string | number
  id?: string
  className?: string
  disabled?: boolean
  required?: boolean
  placeholder?: string
  autoFocus?: boolean
  size?: keyof typeof styles.inputSize
  onFocus?: (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  onBlur?: (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  onClick?: (
    event: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement, MouseEvent>,
  ) => void
  onKeyDown?: (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  rows?: number
  type?: 'text' | 'number' | 'email' | 'tel'
  icon?: IconType
  iconType?: Type
  /**
   * While true hover state will not show and focus state will be allways on
   */
  fixedFocusState?: boolean
}

export interface InputProps extends InputComponentProps {
  label?: string
  hasError?: boolean
  errorMessage?: string
  tooltip?: string
  backgroundColor?: InputBackgroundColor
  textarea?: boolean
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

const InputHOC = forwardRef(
  (
    props: Omit<InputComponentProps, 'size'>,
    ref: React.Ref<HTMLInputElement>,
  ) => <input ref={ref} {...props} />,
)
const TextareaHOC = forwardRef(
  (props: InputComponentProps, ref: React.Ref<HTMLTextAreaElement>) => (
    <textarea ref={ref} {...props} />
  ),
)

export const Input = forwardRef(
  (
    props: InputProps,
    ref?: React.Ref<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const {
      name,
      label,
      errorMessage = '',
      hasError = Boolean(errorMessage),
      value,
      defaultValue,
      id = name,
      disabled,
      required,
      placeholder,
      tooltip,
      backgroundColor = 'white',
      onFocus,
      onBlur,
      onClick,
      onKeyDown,
      textarea,
      type,
      icon,
      iconType = 'filled',
      size = 'md',
      fixedFocusState,
      ...inputProps
    } = props
    const [hasFocus, setHasFocus] = useState(false)
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
    const ariaError = hasError
      ? {
          'aria-invalid': true,
          'aria-describedby': id,
        }
      : {}
    const mergedRefs = useMergeRefs(inputRef, ref || null)

    const InputComponent = textarea ? TextareaHOC : InputHOC

    return (
      <div>
        <Box
          display="flex"
          alignItems="center"
          className={cn(
            styles.container,
            styles.containerBackgrounds[backgroundColor],
            styles.containerSizes[size],
            {
              [styles.hasError]: hasError,
              [styles.hasFocus]: hasFocus,
              [styles.containerDisabled]: disabled,
              [styles.fixedFocusState]: fixedFocusState,
            },
          )}
          onClick={(e) => {
            e.preventDefault()
            if (inputRef.current) {
              inputRef.current.focus()
            }
          }}
        >
          <Box flexGrow={1}>
            <label
              htmlFor={id}
              className={cn(styles.label, styles.labelSizes[size], {
                [styles.labelDisabledEmptyInput]: disabled && !value,
              })}
            >
              {label}
              {required && <span className={styles.isRequiredStar}> *</span>}
              {tooltip && (
                <Box marginLeft={1} display="inlineBlock">
                  <Tooltip text={tooltip} />
                </Box>
              )}
            </label>
            <InputComponent
              className={cn(
                styles.input,
                styles.inputBackground[backgroundColor],
                styles.inputSize[size],
                {
                  [styles.textarea]: textarea,
                },
              )}
              id={id}
              disabled={disabled}
              name={name}
              ref={mergedRefs}
              placeholder={placeholder}
              value={value}
              defaultValue={defaultValue}
              onFocus={(e) => {
                setHasFocus(true)
                if (onFocus) {
                  onFocus(e)
                }
              }}
              onClick={(e) => {
                if (onClick) {
                  onClick(e)
                }
              }}
              onKeyDown={(e) => {
                if (onKeyDown) {
                  onKeyDown(e)
                }
              }}
              onBlur={(e) => {
                setHasFocus(false)
                if (onBlur) {
                  onBlur(e)
                }
              }}
              type={type}
              {...ariaError}
              {...inputProps}
            />
          </Box>
          {hasError && !icon && (
            <Icon
              icon="warning"
              skipPlaceholderSize
              className={cn(styles.icon, styles.iconError)}
            />
          )}
          {icon && (
            <Icon
              icon={icon}
              type={iconType}
              skipPlaceholderSize
              className={cn(styles.icon, {
                [styles.iconError]: hasError,
              })}
            />
          )}
        </Box>
        {hasError && errorMessage && (
          <div className={styles.errorMessage} id={id}>
            {errorMessage}
          </div>
        )}
      </div>
    )
  },
)
