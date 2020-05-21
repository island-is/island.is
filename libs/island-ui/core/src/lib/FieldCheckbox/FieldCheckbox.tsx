import React from 'react'
import { FieldInputProps } from 'formik'
import { Checkbox, CheckboxProps } from '../Checkbox/Checkbox'

export interface FieldCheckboxProps extends CheckboxProps {
  field?: FieldInputProps<boolean>
}

export const FieldCheckbox = ({
  field: { onChange, value, ...field },
  ...props
}: FieldCheckboxProps) => {
  return (
    <Checkbox
      {...props}
      {...field}
      checked={value}
      onChange={(e) => {
        const event = {
          ...e,
          target: {
            ...e.target,
            name: field.name,
            value: e.target.checked,
          },
        }
        onChange(event)
      }}
    />
  )
}

export default FieldCheckbox
