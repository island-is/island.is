import React, { FC } from 'react'
import { Icon } from '@island.is/island-ui/core'
import * as styles from './Select.treat'

export type Option = {
  label: string
  value: string
}

interface SelectProps {
  name?: string
  value: string
  options: Option[]
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  // Setting reselect to true has the effect of no value being checked/selected
  // on the select element, enabling getting a change event when selecting the
  // same (or only) option again from the select dropdown
  reselect?: boolean
}

export const Select: FC<SelectProps> = ({
  name,
  value,
  options,
  onChange,
  reselect = false,
}) => {
  const selected = options.find((o) => o.value === value)

  return (
    <div className={styles.container}>
      <label className={styles.label}>
        {selected != null && selected.label}
        <div className={styles.icon}>
          <Icon type="cheveron" width={16} height={9} />
        </div>
        <select
          className={styles.select}
          name={name}
          value={reselect ? '' : value}
          onChange={onChange}
        >
          {reselect && <option disabled hidden value="" />}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

export default Select
