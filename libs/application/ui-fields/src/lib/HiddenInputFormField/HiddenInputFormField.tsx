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
  const { watchValue, defaultValue, id, valueModifier } = field
  const defaultVal =
    typeof defaultValue === 'function'
      ? defaultValue(application, field)
      : defaultValue
  const watchedValue = watchValue
    ? watch(watchValue, defaultVal ?? undefined)
    : undefined

  useEffect(() => {
    if (watchedValue) {
      const finalValue = valueModifier
        ? valueModifier(watchedValue)
        : watchedValue
      setValue(id, finalValue)
    } else if (defaultValue !== undefined) {
      setValue(id, defaultVal)
    }
  }, [
    application,
    defaultVal,
    id,
    setValue,
    watchedValue,
    valueModifier,
    defaultValue,
  ])

  // Initalize field with undefined if field.defaultValue is undefined,
  // otherwise if field is type other than string (e.g. boolean or number) then
  // it will be defaulted to empty string and fail in zod validation
  useEffect(() => {
    if (
      defaultValue === undefined &&
      (getValues(id) === undefined || getValues(id) === '')
    ) {
      setValue(id, undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <input type="hidden" {...register(field.id)} />
}
