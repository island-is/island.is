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
  const { register, setValue, watch } = useFormContext()
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
        ? valueModifier(watchedValue, application)
        : watchedValue
      setValue(id, finalValue)
    } else {
      setValue(id, defaultVal)
    }
  }, [application, defaultVal, id, setValue, watchedValue, valueModifier])

  return <input type="hidden" {...register(field.id)} />
}
