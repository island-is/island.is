import React from 'react'
import cn from 'classnames'

import { Tooltip } from '../Tooltip/Tooltip'
import * as styles from './RadioButton.treat'

export interface RadioButtonProps {
  name?: string
  id?: string
  label?: string
  value?: string | number
  checked?: boolean
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  tooltip?: string
  hasError?: boolean
  errorMessage?: string
  large?: boolean
}

export const RadioButton = ({
  label,
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
}: RadioButtonProps) => {
  const ariaError = hasError
    ? {
        'aria-invalid': true,
        'aria-describedby': id,
      }
    : {}
  return (
    <div className={cn(styles.container, { [styles.large]: large })}>
      <input
        className={styles.input}
        type="radio"
        name={name}
        disabled={disabled}
        id={id}
        onChange={onChange}
        value={value}
        {...ariaError}
      />
      <label
        className={cn(styles.label, {
          [styles.labelChecked]: checked,
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

export default RadioButton
