import React from 'react'
import cn from 'classnames'

import * as styles from './Checkbox.treat'
import Icon from '../Icon/Icon'
import Tooltip from '../Tooltip/Tooltip'
import { Box } from '../Box'

export interface CheckboxProps {
  name?: string
  id?: string
  label?: string
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  tooltip?: string
  hasError?: boolean
  errorMessage?: string
  value?: string
  large?: boolean
}

export const Checkbox = ({
  label,
  name,
  id = name,
  checked,
  defaultChecked,
  disabled,
  onChange,
  tooltip,
  hasError,
  errorMessage,
  value,
  large,
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
      })}
    >
      <input
        className={styles.input}
        type="checkbox"
        name={name}
        disabled={disabled}
        defaultChecked={defaultChecked}
        id={id}
        onChange={onChange}
        value={value}
        {...ariaError}
      />
      <label
        className={cn(styles.label, {
          [styles.labelChecked]: checked,
          [styles.labelChecked]: defaultChecked,
          [styles.checkboxLabelDisabled]: disabled,
          [styles.largeLabel]: large,
        })}
        htmlFor={id}
      >
        <div
          className={cn(styles.checkbox, {
            [styles.checkboxChecked]: checked,
            [styles.checkboxChecked]: defaultChecked,
            [styles.checkboxError]: hasError,
            [styles.checkboxDisabled]: disabled,
          })}
        >
          <Icon
            type="check"
            width={styles.checkMarkWidth}
            color={
              checked || defaultChecked
                ? styles.checkMarkColor
                : styles.checkMarkColorUnchecked
            }
          />
        </div>
        {label}
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

export default Checkbox
