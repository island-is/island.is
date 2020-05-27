import React, { ReactElement } from 'react'
import { useUID } from 'react-uid'
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
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  tooltip?: string
  hasError?: boolean
  errorMessage?: string
}

export const Checkbox = ({
  label,
  name,
  id = name,
  checked,
  disabled,
  onChange,
  tooltip,
  hasError,
  errorMessage,
}: CheckboxProps) => {
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
        type="checkbox"
        name={name}
        disabled={disabled}
        id={id}
        onChange={onChange}
        {...ariaError}
      />
      <label
        className={cn(styles.label, {
          [styles.labelChecked]: checked,
        })}
        htmlFor={id}
      >
        <div
          className={cn(styles.checkbox, {
            [styles.checkboxChecked]: checked,
            [styles.checkboxError]: hasError,
          })}
        >
          <Icon
            type="check"
            width={styles.checkMarkWidth}
            color={styles.checkMarkColor}
          />
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

export default Checkbox
