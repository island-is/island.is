import React from 'react'
import { Checkbox } from '@island.is/island-ui/core'

export interface CategoryCheckBoxCategoryCheckBox  {  
  checkValue:boolean, 
  onChange:(event: React.ChangeEvent<HTMLInputElement>) => void
  label:string, 
  value:string
}

export const CategoryCheckBox = (props:CategoryCheckBoxCategoryCheckBox) => {
  return (
    <div>
      <Checkbox name="checkboxFree" label={props.label}
                  onChange={props.onChange}
                  checked={props.checkValue}
                  value={props.value}
        /> 
    </div>
  )
}

export default CategoryCheckBox
