import cn from 'classnames'
import React, { forwardRef, useLayoutEffect, useRef, useState } from 'react'
import { VisuallyHidden } from 'reakit'
import { resolveResponsiveProp } from '../../utils/responsiveProp'
import { Box } from '../Box/Box'
import { UseBoxStylesProps } from '../Box/useBoxStyles'
import { Icon } from '../IconRC/Icon'
import { Tooltip } from '../Tooltip/Tooltip'
import { ErrorMessage } from './ErrorMessage'

import * as styles from './Input.css'
import {
  AriaError,
  InputBackgroundColor,
  InputComponentProps,
  InputProps,
  InputIcon,
  AsideProps,
} from './types'
import { useMergeRefs } from '../../hooks/useMergeRefs'

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
      max,
      min,
      hasError = Boolean(errorMessage),
      value,
      defaultValue,
      id = name,
      disabled,
      required,
      rightAlign,
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
      step,
      size = 'md',
      fixedFocusState,
      autoExpand,
      loading,
      buttons,
      ...inputProps
    } = props
    const [hasFocus, setHasFocus] = useState(false)

    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
    const mergedRefs = useMergeRefs(inputRef, ref || null)

    const hasLabel = Boolean(label)
    const showFocus = hasFocus || !!fixedFocusState

    const errorId = `${id}-error`
    const ariaError = hasError
      ? { 'aria-invalid': true, 'aria-describedby': errorId }
      : {}

    const InputComponent = textarea ? TextareaHOC : InputHOC
    const mapBlue = (color: InputBackgroundColor) =>
      color === 'blue' ? 'blue100' : color
    const containerBackground = Array.isArray(backgroundColor)
      ? backgroundColor.map(mapBlue)
      : mapBlue(backgroundColor as InputBackgroundColor)

    useLayoutEffect(() => {
      const input = inputRef.current

      if (autoExpand?.on && input) {
        const handler = () => {
          input.style.height = 'auto'
          // The +1 here prevents a scrollbar from appearing in the textarea
          input.style.height = `${input.scrollHeight + 1}px`
          input.style.maxHeight = autoExpand.maxHeight
            ? `${autoExpand.maxHeight}px`
            : `${window.innerHeight - 50}px`
        }

        handler()

        input.addEventListener('input', handler, false)

        return function cleanup() {
          input.removeEventListener('input', handler)
        }
      }
    }, [autoExpand?.maxHeight, autoExpand?.on, inputRef])

    return (
      <div>
        {/* If size is xs then the label is above the input box */}
        {size === 'xs' && label && (
          <label
            htmlFor={id}
            className={cn(
              styles.label({
                hasError,
                readOnly,
                disabled,
              }),
              styles.labelSizes[size],
            )}
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
          background={containerBackground as UseBoxStylesProps['background']}
          className={styles.container({
            disabled: Boolean(disabled),
            readOnly,
            hasError,
            hasFocus: showFocus,
          })}
          onClick={(e) => {
            e.preventDefault()
            if (inputRef.current) {
              inputRef.current.focus()
            }
          }}
        >
          <Box flexGrow={1} className={styles.containerSizes[size]}>
            {size !== 'xs' && label && (
              <label
                htmlFor={id}
                className={cn(
                  styles.label({
                    hasError,
                    readOnly,
                    disabled,
                  }),
                  styles.labelSizes[size],
                )}
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
                styles.input({ hasLabel, rightAlign, textarea, disabled }),
                resolveResponsiveProp(
                  backgroundColor,
                  styles.inputBackgroundXs,
                  styles.inputBackgroundSm,
                  styles.inputBackgroundMd,
                  styles.inputBackgroundLg,
                  styles.inputBackgroundXl,
                ),
                { [styles.inputSize[size]]: !textarea },
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
              step={step}
              max={max}
              min={min}
              {...(ariaError as AriaError)}
              {...inputProps}
              {...(required && { 'aria-required': true })}
            />
          </Box>

          <AsideIcons
            icon={icon}
            buttons={buttons}
            size={size}
            loading={!!loading}
            hasError={hasError}
            hasLabel={hasLabel}
          />
        </Box>
        {hasError && errorMessage && (
          <ErrorMessage id={errorId}>{errorMessage}</ErrorMessage>
        )}
      </div>
    )
  },
)

function AsideIcons({
  icon,
  buttons = [],
  size,
  loading,
  hasError,
  hasLabel,
}: AsideProps) {
  const displayedIcon: InputIcon | undefined = hasError
    ? { name: 'warning' }
    : icon

  const renderIcon = (item: InputIcon) => (
    <Icon
      icon={item.name}
      type={item.type}
      skipPlaceholderSize
      className={styles.icon({ size, hasLabel, hasError })}
      ariaHidden
    />
  )

  return (
    <div className={styles.aside}>
      {loading ? (
        <Box className={styles.spinner} flexShrink={0} borderRadius="full" />
      ) : displayedIcon ? (
        <div
          className={styles.iconWrapper({ size })}
          key={displayedIcon.name}
          aria-hidden
        >
          {renderIcon(displayedIcon)}
        </div>
      ) : null}

      {buttons.map((item) => {
        const { name, type, label, ...rest } = item
        return (
          <button
            className={styles.inputButton({ size, hasError })}
            key={name}
            {...rest}
          >
            <VisuallyHidden>{label}</VisuallyHidden>
            {renderIcon(item)}
          </button>
        )
      })}
    </div>
  )
}
