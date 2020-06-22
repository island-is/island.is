import React from 'react'
import { FormikState, FieldInputProps } from 'formik'
import get from 'lodash/get'
import { Checkbox, CheckboxProps } from '../Checkbox/Checkbox'

export interface FieldCheckboxProps extends CheckboxProps {
  field?: FieldInputProps<boolean>
  form?: FormikState<string | number>
}

export const FieldCheckbox = ({
  field: { onChange, value, ...field },
  form: { touched, errors },
  onChange: customOnChange,
  ...props
}: FieldCheckboxProps) => {
  const nameArray = (field.name && field.name.split('.')) || []
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
        if (customOnChange) {
          customOnChange(e)
        }
      }}
      hasError={!!(get(touched, nameArray) && get(errors, nameArray))}
      errorMessage={get(errors, nameArray)}
    />
  )
}

export default FieldCheckbox
