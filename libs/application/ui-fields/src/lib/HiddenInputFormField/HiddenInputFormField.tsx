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
      const defaultValNow =
        typeof getDefaultValue === 'function' //adding defaultValue to dependency array causes infinite loop, so we need to call it here as well
          ? getDefaultValue(application, field)
          : getDefaultValue
      setValue(id, defaultValNow)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [application, id, setValue, watchedValue, valueModifier, getDefaultValue])

  // Initialize field with undefined when:
  // - getDefaultValue is undefined, and
  //   - the current value is an empty string, OR
  //   - the field has dontDefaultToEmptyString enabled and is undefined/null.
  // This prevents non-string types (e.g. boolean or number) from being defaulted
  // to an empty string by react-hook-form, which would otherwise cause validation
  // issues (with Zod).
  useEffect(() => {
    if (getDefaultValue !== undefined) return

    const oldValue = getValues(id)
    const isEmptyString = oldValue === ''
    const isNullOrUndefinedWithFlag =
      (oldValue === null || oldValue === undefined) &&
      field.dontDefaultToEmptyString

    if (isEmptyString || isNullOrUndefinedWithFlag) {
      setValue(id, undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <input type="hidden" {...register(field.id)} />
}
