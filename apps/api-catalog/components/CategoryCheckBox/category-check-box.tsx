import React from 'react'
import { Checkbox, Stack } from '@island.is/island-ui/core'

import * as styles from './category-check-box.treat'
import cn from 'classnames'

export interface CategoryCheckBoxCategoryCheckBox  {
  checked:boolean,
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  label:string,
  value:string,
  tooltip?:string
}

export const CategoryCheckBox = (props:CategoryCheckBoxCategoryCheckBox) => {
  return (
    <Stack space="gutter">
      <div className={cn(styles.categoryCheckbox, "category-checkbox")}>

      <Checkbox name={'check-category-'+props.value} label={props.label}
                  onChange={props.onChange}
                  checked={props.checkValue}
                  value={props.value}
                  tooltip={props?.tooltip}
        />
        </div>
    </Stack>
  )
}

export default CategoryCheckBox
