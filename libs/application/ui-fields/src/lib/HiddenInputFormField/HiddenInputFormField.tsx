import React, { FC, useEffect } from 'react'
import { Application, HiddenInputField } from '@island.is/application/types'
import { useFormContext } from 'react-hook-form'

interface HiddenInputFormFieldProps {
  application: Application
  field: HiddenInputField
}

export const HiddenInputFormField: FC<HiddenInputFormFieldProps> = ({
  application,
  field,
}) => {
  const { register, setValue } = useFormContext()

  useEffect(() => {
    let fieldValue = field.value
    console.log('test this shiiiit', fieldValue)

    // Check if value is a function and call it with application and field
    if (typeof field.value === 'function') {
      console.log('weird', typeof field.value)
      fieldValue = field.value(application, field)
    }
    console.log('fieldValue', fieldValue)
    console.log(typeof fieldValue)
    setValue(`${field.id}`, fieldValue)
  }, [application, field, setValue])

  return (
    <input
      type="hidden"
      {...register(`${field.id}`, { required: field.required })}
    />
  )
}
