import React from 'react'
import cn from 'classnames'
import { Text } from '../Text/Text'
import { Icon } from '../Icon/Icon'
import { Tooltip } from '../Tooltip/Tooltip'
import { Box } from '../Box/Box'
import { InputBackgroundColor } from '../Input/types'
import * as styles from './Checkbox.css'

export interface CheckboxProps {
  name?: string
  id?: string
  label?: React.ReactNode
  checked?: boolean
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  tooltip?: React.ReactNode
  hasError?: boolean
  errorMessage?: string
  value?: string
  strong?: boolean
  filled?: boolean
  large?: boolean
  backgroundColor?: InputBackgroundColor
  labelVariant?: 'default' | 'small'
  /** subLabel can only be used if the 'large' prop set to true */
  subLabel?: string
}

interface AriaError {
  'aria-invalid': boolean
  'aria-describedby': string
}

export const Checkbox = ({
  label,
  subLabel,
  labelVariant = 'default',
  name,
  id = name,
  checked,
  disabled,
  onChange,
  tooltip,
  hasError,
  errorMessage,
  value,
  large,
  strong,
  backgroundColor,
  filled = false,
}: CheckboxProps) => {
  const errorId = `${id}-error`
  const ariaError = hasError
    ? {
        'aria-invalid': true,
        'aria-describedby': errorId,
      }
    : {}

  const background =
    backgroundColor && backgroundColor === 'blue' ? 'blue100' : undefined

  return (
    <Box
      className={cn(styles.container, large, {
        [styles.large]: large,
        [styles.filled]: filled,
      })}
      background={background}
    >
      <input
        className={styles.input}
        type="checkbox"
        name={name}
        disabled={disabled}
        id={id}
        onChange={onChange}
        value={value}
        checked={checked}
        {...(ariaError as AriaError)}
      />
      <label
        className={cn(styles.label, {
          [styles.checkboxLabelDisabled]: disabled,
          [styles.largeLabel]: large,
        })}
        htmlFor={id}
      >
        <div
          className={cn(styles.checkbox, {
            [styles.checkboxChecked]: checked,
            [styles.checkboxError]: hasError,
            [styles.checkboxDisabled]: disabled,
          })}
        >
          <Icon
            type="check"
            width={styles.checkMarkWidth}
            color={checked ? 'white' : 'transparent'}
          />
        </div>
        <span className={styles.labelText}>
          <Text
            as="span"
            variant={labelVariant}
            fontWeight={checked || strong ? 'semiBold' : 'light'}
          >
            {label}
          </Text>
          <div
            aria-hidden="true"
            className={styles.fixJumpingContentFromFontWeightToggle}
          >
            <Text as="span" variant={labelVariant} fontWeight="semiBold">
              {label}
            </Text>
          </div>
          {subLabel && large && (
            <Text
              as="span"
              marginTop="smallGutter"
              fontWeight="regular"
              variant="small"
            >
              {subLabel}
            </Text>
          )}
        </span>
        {tooltip && (
          <div
            className={cn(styles.tooltipContainer, {
              [styles.tooltipLargeContainer]: large,
            })}
          >
            <Tooltip text={tooltip} />
          </div>
        )}
        {hasError && errorMessage && (
          <div
            id={errorId}
            className={styles.errorMessage}
            aria-live="assertive"
          >
            {errorMessage}
          </div>
        )}
      </label>
    </Box>
  )
}
