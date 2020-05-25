import React from 'react'
import { FieldInputProps } from 'formik'
import { ValueType } from 'react-select'
import { Select, SelectProps, Option } from '../Select/Select'

export interface FieldSelectProps extends SelectProps {
  field?: FieldInputProps<ValueType<Option>>
}

export const FieldSelect = ({
  field: { onChange, value, ...field },
  ...props
}: FieldSelectProps) => {
  return (
    <Select
      {...props}
      {...field}
      value={value}
      onChange={(option, { name }) => {
        onChange({ target: { value: option, name } })
      }}
    />
  )
}

export default FieldSelect
