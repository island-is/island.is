import React from 'react'
import cn from 'classnames'

import * as styles from './RadioButton.treat'
import Icon from '../Icon/Icon'
import Tooltip from '../Tooltip/Tooltip'
import { Box } from '../Box'

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
}: RadioButtonProps) => {
  const ariaError = hasError
    ? {
        'aria-invalid': true,
        'aria-describedby': id,
      }
    : {}
  return (
    <div className={styles.container}>
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
          <Box marginLeft={2} display="inlineBlock">
            <Tooltip text={tooltip} />
          </Box>
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
