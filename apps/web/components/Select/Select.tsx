import React, { forwardRef } from 'react'
import { Icon } from '@island.is/island-ui/core'
import * as styles from './Select.treat'

export type Option = {
  label: string
  value: string
}

interface SelectProps {
  id?: string
  name?: string
  value: string
  options: Option[]
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export const Select = forwardRef(
  (
    { id, name, value, options, onChange }: SelectProps,
    ref?: React.Ref<HTMLSelectElement>,
  ) => {
    const selected = options.find((o) => o.value === value)

    return (
      <div className={styles.container}>
        <label htmlFor={id} className={styles.label}>
          {selected !== undefined && selected.label}
          <div className={styles.icon}>
            <Icon type="cheveron" width={16} height={9} />
          </div>
          <select
            ref={ref}
            id={id}
            className={styles.select}
            name={name}
            value={value}
            onChange={onChange}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    )
  },
)

export default Select
