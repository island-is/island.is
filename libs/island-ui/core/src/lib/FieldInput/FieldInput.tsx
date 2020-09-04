import React from 'react'
import { FormikState, FieldInputProps } from 'formik'
import get from 'lodash/get'
import { Input } from '../Input/Input'

interface FieldNumberInputProps {
  form: FormikState<string | number>
  field: FieldInputProps<string | number>
}

export const FieldInput = ({
  field,
  form: { touched, errors },
  ...props
}: FieldNumberInputProps) => {
  const nameArray = (field.name && field.name.split('.')) || []
  return (
    <Input
      {...field}
      {...props}
      hasError={!!(get(touched, nameArray) && get(errors, nameArray))}
      errorMessage={get(errors, nameArray)}
    />
  )
}

export default FieldInput
