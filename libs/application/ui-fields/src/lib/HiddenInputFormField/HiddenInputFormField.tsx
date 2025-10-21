import React, { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  HiddenInputWithWatchedValueField,
  HiddenInputField,
  FieldBaseProps,
} from '@island.is/application/types'

type Field = HiddenInputWithWatchedValueField | HiddenInputField

interface HiddenInputFormFieldProps extends FieldBaseProps {
  field: Field
}

export const HiddenInputFormField: FC<HiddenInputFormFieldProps> = ({
  application,
  field,
}) => {
  const { register, setValue, getValues, watch } = useFormContext()
  const { watchValue, defaultValue: getDefaultValue, id, valueModifier } = field
  const defaultValue =
    typeof getDefaultValue === 'function'
      ? getDefaultValue(application, field)
      : getDefaultValue
  const watchedValue = watchValue
    ? watch(watchValue, defaultValue ?? undefined)
    : undefined

  useEffect(() => {
    if (watchedValue) {
      const finalValue = valueModifier
        ? valueModifier(watchedValue, application)
        : watchedValue
      setValue(id, finalValue)
    } else if (getDefaultValue !== undefined) {
      setValue(id, defaultValue)
    }
  }, [
    application,
    defaultValue,
    id,
    setValue,
    watchedValue,
    valueModifier,
    getDefaultValue,
  ])

  // Initalize field with undefined if getDefaultValue is undefined
  // and current value is empty string, otherwise if field has a type other
  // than string (e.g. boolean or number) then it will be defaulted to
  // empty string and fail in zod validation
  useEffect(() => {
    const oldValue = getValues(id)
    if (getDefaultValue === undefined && oldValue === '') {
      setValue(id, undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <input type="hidden" {...register(field.id)} />
}
