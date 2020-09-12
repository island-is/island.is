import React from 'react'
import { Checkbox, Stack } from '@island.is/island-ui/core'

export interface CategoryCheckBoxCategoryCheckBox  {  
  checkValue:boolean, 
  onChange:(event: React.ChangeEvent<HTMLInputElement>) => void
  label:string, 
  value:string
}

export const CategoryCheckBox = (props:CategoryCheckBoxCategoryCheckBox) => {
  return (
    <Stack space="gutter">
      <div className="category-checkbox">
      <Checkbox name={'check-category-'+props.value} label={props.label}
                  onChange={props.onChange}
                  checked={props.checkValue}
                  value={props.value}
        /> 
        </div>
    </Stack>
  )
}

export default CategoryCheckBox
