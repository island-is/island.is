import React, { forwardRef } from 'react'
import { IconDeprecated as Icon } from '@island.is/island-ui/core'
import { theme, Colors } from '@island.is/island-ui/theme'
import * as styles from './Select.treat'

export type Option = {
  label: string
  value: string
}

interface SelectProps {
  id?: string
  color?: Colors
  name?: string
  value: string
  options: Option[]
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export const Select = forwardRef(
  (
    { id, color = 'blue400', name, value, options, onChange }: SelectProps,
    ref?: React.Ref<HTMLSelectElement>,
  ) => {
    const selected = options.find((o) => o.value === value)
    const usedColor = theme.color[color]

    return (
      <div
        className={styles.container}
        style={{
          color: usedColor,
          borderBottom: `1px solid ${usedColor}`,
        }}
      >
        <label htmlFor={id} className={styles.label}>
          {selected !== undefined && selected.label}
          <div className={styles.icon}>
            <Icon type="cheveron" width={16} height={9} color={color} />
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
