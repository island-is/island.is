import React, { useState, useRef, forwardRef } from 'react'
import cn from 'classnames'

import * as styles from './Input.css'
import { Box } from '../Box/Box'
import { Tooltip } from '../Tooltip/Tooltip'
import { Icon } from '../IconRC/Icon'
import { resolveResponsiveProp } from '../../utils/responsiveProp'
import { UseBoxStylesProps } from '../Box/useBoxStyles'
import {
  InputBackgroundColor,
  InputComponentProps,
  InputProps,
  AriaError,
} from './types'

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
      maxLength,
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
      readOnly,
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
    const errorId = `${id}-error`
    const ariaError = hasError
      ? {
          'aria-invalid': true,
          'aria-describedby': errorId,
        }
      : {}
    const mergedRefs = useMergeRefs(inputRef, ref || null)

    const InputComponent = textarea ? TextareaHOC : InputHOC
    const mapBlue = (color: InputBackgroundColor) =>
      color === 'blue' ? 'blue100' : color
    const containerBackground = Array.isArray(backgroundColor)
      ? backgroundColor.map(mapBlue)
      : mapBlue(backgroundColor as InputBackgroundColor)

    return (
      <div>
        {/* If size is xs then the label is above the input box */}
        {size === 'xs' && (
          <label
            htmlFor={id}
            className={cn(styles.label, styles.labelSizes[size], {
              [styles.labelDisabledEmptyInput]:
                disabled && !value && !defaultValue,
            })}
          >
            {label}
            {required && (
              <span aria-hidden="true" className={styles.isRequiredStar}>
                {' '}
                *
              </span>
            )}
            {tooltip && (
              <Box marginLeft={1} display="inlineBlock">
                <Tooltip text={tooltip} />
              </Box>
            )}
          </label>
        )}
        <Box
          display="flex"
          alignItems="center"
          background={containerBackground as UseBoxStylesProps['background']}
          className={cn(styles.container, styles.containerSizes[size], {
            [styles.hasError]: hasError,
            [styles.hasFocus]: hasFocus,
            [styles.fixedFocusState]: fixedFocusState,
            [styles.noLabel]: !label,
          })}
          onClick={(e) => {
            e.preventDefault()
            if (inputRef.current) {
              inputRef.current.focus()
            }
          }}
        >
          <Box flexGrow={1}>
            {size !== 'xs' && (
              <label
                htmlFor={id}
                className={cn(styles.label, styles.labelSizes[size], {
                  [styles.labelDisabledEmptyInput]:
                    disabled && !value && !defaultValue,
                })}
              >
                {label}
                {required && (
                  <span aria-hidden="true" className={styles.isRequiredStar}>
                    {' '}
                    *
                  </span>
                )}
                {tooltip && (
                  <Box marginLeft={1} display="inlineBlock">
                    <Tooltip text={tooltip} />
                  </Box>
                )}
              </label>
            )}
            <InputComponent
              className={cn(
                styles.input,
                resolveResponsiveProp(
                  backgroundColor,
                  styles.inputBackgroundXs,
                  styles.inputBackgroundSm,
                  styles.inputBackgroundMd,
                  styles.inputBackgroundLg,
                  styles.inputBackgroundXl,
                ),
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
              maxLength={maxLength}
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
              readOnly={readOnly}
              type={type}
              {...(ariaError as AriaError)}
              {...inputProps}
              {...(required && { 'aria-required': true })}
            />
          </Box>
          {hasError && !icon && (
            <Icon
              icon="warning"
              skipPlaceholderSize
              className={cn(styles.icon, styles.iconError)}
              ariaHidden
            />
          )}
          {icon && (
            <Icon
              icon={icon}
              type={iconType}
              skipPlaceholderSize
              className={cn(styles.icon, {
                [styles.iconError]: hasError,
                [styles.iconExtraSmall]: size === 'xs',
              })}
              ariaHidden
            />
          )}
        </Box>
        {hasError && errorMessage && (
          <div
            id={errorId}
            className={styles.errorMessage}
            aria-live="assertive"
            data-testid="inputErrorMessage"
          >
            {errorMessage}
          </div>
        )}
      </div>
    )
  },
)
