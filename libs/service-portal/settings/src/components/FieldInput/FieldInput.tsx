import React from 'react'
import { FormikState, FieldInputProps } from 'formik'
import get from 'lodash/get'
import { Input } from '@island.is/island-ui/core'

interface FieldNumberInputProps {
  form: FormikState<string | number>
  field: FieldInputProps<string | number>
  disabled?: boolean
}

export const FieldInput = ({
  field,
  form: { touched, errors },
  disabled,
  ...props
}: FieldNumberInputProps) => {
  const nameArray = (field.name && field.name.split('.')) || []
  return (
    <Input
      {...field}
      {...props}
      disabled={disabled}
      hasError={!!(get(touched, nameArray) && get(errors, nameArray))}
      errorMessage={get(errors, nameArray)}
    />
  )
}
