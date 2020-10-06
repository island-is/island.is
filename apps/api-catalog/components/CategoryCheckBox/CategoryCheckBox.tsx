import React from 'react'
import { Checkbox, Stack } from '@island.is/island-ui/core'

import * as styles from './categoryCheckBox.treat'
import cn from 'classnames'

export interface CategoryCheckBoxProps {
  checked: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  label: string
  name?: string
  value: string
  tooltip?: string
}

export const CategoryCheckBox = (props: CategoryCheckBoxProps) => {
  return (
    <Stack space="gutter">
      <div className={cn(styles.categoryCheckbox, 'category-checkbox')}>
        <Checkbox
          name={props.name}
          id={'check-category-' + props.value}
          label={props.label}
          onChange={props.onChange}
          checked={props.checked}
          value={props.value}
          tooltip={props?.tooltip}
        />
      </div>
    </Stack>
  )
}

export default CategoryCheckBox
