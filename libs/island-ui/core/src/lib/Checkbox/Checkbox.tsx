import React from 'react'
import cn from 'classnames'
import { Text } from '../Text/Text'
import { Icon } from '../Icon/Icon'
import { Tooltip } from '../Tooltip/Tooltip'
import * as styles from './Checkbox.treat'

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
  filled?: boolean
  large?: boolean
  /** subLabel can only be used if the 'large' prop set to true */
  subLabel?: string
}

export const Checkbox = ({
  label,
  subLabel,
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
  filled = false,
}: CheckboxProps) => {
  const ariaError = hasError
    ? {
        'aria-invalid': true,
        'aria-describedby': id,
      }
    : {}
  return (
    <div
      className={cn(styles.container, large, {
        [styles.large]: large,
        [styles.filled]: filled,
      })}
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
        {...ariaError}
      />
      <label
        className={cn(styles.label, {
          [styles.labelChecked]: checked,
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
          {label}
          {subLabel && large && (
            <Text
              as="span"
              marginTop="smallGutter"
              fontWeight="medium"
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
          <div className={styles.errorMessage} id={id}>
            {errorMessage}
          </div>
        )}
      </label>
    </div>
  )
}
