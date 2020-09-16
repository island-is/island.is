import React from 'react'
import { FormikState, FieldInputProps } from 'formik'
import get from 'lodash/get'
import { Input } from '../Input/Input'
import useDeprecatedComponent from '../private/useDeprecatedComponent'

interface FieldNumberInputProps {
  form: FormikState<string | number>
  field: FieldInputProps<string | number>
}

export const FieldInput = ({
  field,
  form: { touched, errors },
  ...props
}: FieldNumberInputProps) => {
  useDeprecatedComponent('FieldInput')
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
