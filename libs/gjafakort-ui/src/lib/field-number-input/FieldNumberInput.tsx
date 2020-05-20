import React from 'react'
import { get } from 'lodash'

import { FormikState, FieldInputProps } from 'formik'
import NumberFormat, { NumberFormatProps } from 'react-number-format'
import { Input } from '../input/Input'

type valueType = 'floatValue' | 'formattedValue' | 'value'

interface FieldNumberInputProps {
  valueType?: valueType
  form?: FormikState<string | number>
  field?: FieldInputProps<string | number>
}

export const FieldNumberInput = ({
  field: { value = '', onChange, ...field },
  form: { touched, errors },
  innerRef,
  valueType = 'value',
  ...props
}: FieldNumberInputProps & NumberFormatProps) => {
  const nameArray = (field.name && field.name.split('.')) || []
  return (
    <NumberFormat
      customInput={Input}
      {...field}
      {...props}
      value={value}
      getInputRef={innerRef}
      type="tel"
      onValueChange={(values) => {
        onChange({
          target: {
            value: values[valueType] || '',
            name: field.name,
          },
        })
      }}
      hasError={!!(get(touched, nameArray) && get(errors, nameArray))}
      errorMessage={get(errors, nameArray)}
    />
  )
}

export default FieldNumberInput
