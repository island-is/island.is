import React from 'react'
import { FieldInputProps, FormikState } from 'formik'
import { ValueType } from 'react-select'
import get from 'lodash/get'
import { Select, SelectProps, Option } from '../Select/Select'

export interface FieldSelectProps extends SelectProps {
  form: FormikState<string | number>
  field: FieldInputProps<ValueType<Option>>
}

export const FieldSelect = ({
  field: { onChange, value, ...field },
  form: { touched, errors },
  ...props
}: FieldSelectProps) => {
  const nameArray = (field.name && field.name.split('.')) || []
  return (
    <Select
      {...props}
      {...field}
      value={value}
      onChange={(option, { name }) => {
        onChange({ target: { value: option, name } })
      }}
      hasError={!!(get(touched, nameArray) && get(errors, nameArray))}
      errorMessage={get(errors, nameArray)}
    />
  )
}

export default FieldSelect
