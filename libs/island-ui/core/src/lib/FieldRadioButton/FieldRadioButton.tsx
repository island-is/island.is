import React from 'react'
import { FormikState, FieldInputProps } from 'formik'
import { get } from 'lodash'
import { RadioButton, RadioButtonProps } from '../RadioButton/RadioButton'

export interface FieldRadioButtonProps extends RadioButtonProps {
  field?: FieldInputProps<string>
  form?: FormikState<string | number>
}

export const FieldRadioButton = ({
  field: { onChange, value: fieldValue, ...field },
  form: { touched, errors },
  onChange: customOnChange,
  value,
  ...props
}: FieldRadioButtonProps) => {
  const nameArray = (field.name && field.name.split('.')) || []

  return (
    <RadioButton
      {...props}
      {...field}
      checked={value === fieldValue}
      onChange={(e) => {
        const event = {
          ...e,
          target: {
            ...e.target,
            name: field.name,
            value: value,
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

export default FieldRadioButton
