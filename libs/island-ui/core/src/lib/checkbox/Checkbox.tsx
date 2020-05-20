import React from 'react'
import { useUID } from 'react-uid'
import cn from 'classnames'

import * as styles from './Checkbox.treat'
import Icon from '../icon/Icon'

export interface CheckboxProps {
  name?: string
  label?: string
  checked?: boolean
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const Checkbox = ({
  label,
  name,
  checked,
  disabled,
  onChange,
}: CheckboxProps) => {
  const id = useUID()
  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type="checkbox"
        name={name}
        disabled={disabled}
        id={id}
        onChange={onChange}
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
          })}
        >
          <Icon
            type="check"
            width={styles.checkMarkWidth}
            color={styles.checkMarkColor}
          />
        </div>
        {label}
      </label>
    </div>
  )
}

export default Checkbox
