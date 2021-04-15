import React from 'react'
import cn from 'classnames'
import { Text } from '../Text/Text'
import { Tooltip } from '../Tooltip/Tooltip'
import * as styles from './RadioButton.treat'

export interface RadioButtonProps {
  name?: string
  id?: string
  label?: React.ReactNode
  value?: string | number
  checked?: boolean
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  tooltip?: React.ReactNode
  hasError?: boolean
  errorMessage?: string
  filled?: boolean
  large?: boolean
  /** subLabel can only be used if the 'large' prop set to true */
  subLabel?: string
}

export const RadioButton = ({
  label,
  subLabel,
  name,
  id = name,
  value,
  checked,
  disabled,
  onChange,
  tooltip,
  hasError,
  errorMessage,
  large,
  filled = false,
}: RadioButtonProps) => {
  const ariaError = hasError
    ? {
        'aria-invalid': true,
        'aria-describedby': id,
      }
    : {}
  return (
    <div
      className={cn(styles.container, {
        [styles.large]: large,
        [styles.filled]: filled,
      })}
    >
      <input
        className={styles.input}
        type="radio"
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
          [styles.radioButtonLabelDisabled]: disabled,
          [styles.largeLabel]: large,
        })}
        htmlFor={id}
      >
        <div
          className={cn(styles.radioButton, {
            [styles.radioButtonChecked]: checked,
            [styles.radioButtonError]: hasError,
            [styles.radioButtonDisabled]: disabled,
          })}
        >
          <div className={styles.checkMark} />
        </div>
        <span className={styles.labelText}>
          <Text as="span" fontWeight={checked ? 'semiBold' : 'light'}>
            {label}
          </Text>
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
          <div className={styles.errorMessage} id={id}>
            {errorMessage}
          </div>
        )}
      </label>
    </div>
  )
}
