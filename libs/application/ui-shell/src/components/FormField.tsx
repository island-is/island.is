import React, { Dispatch, FC, SetStateAction, useEffect } from 'react'
import { getErrorViaPath } from '@island.is/application/core'
import {
  Application,
  Field,
  FieldBaseProps,
  RecordObject,
  SetFieldLoadingState,
  SetBeforeSubmitCallback,
} from '@island.is/application/types'

import { useFields } from '../context/FieldContext'
import { FieldDef } from '../types'
import { useFormContext, useWatch } from 'react-hook-form'

const FormField: FC<{
  application: Application
  setBeforeSubmitCallback?: SetBeforeSubmitCallback
  setFieldLoadingState?: SetFieldLoadingState
  autoFocus?: boolean
  field: FieldDef
  showFieldName?: boolean
  errors: RecordObject
  goToScreen: (id: string) => void
  refetch: () => void
  setSubmitButtonDisabled: Dispatch<SetStateAction<boolean>>
}> = ({
  application,
  setBeforeSubmitCallback,
  setFieldLoadingState,
  autoFocus,
  errors,
  field,
  goToScreen,
  showFieldName,
  refetch,
  setSubmitButtonDisabled,
}) => {
  const [allFields] = useFields()

  const { getValues, control } = useFormContext()
  const watchField = useWatch({ control, name: field.id })

  useEffect(() => {
    setSubmitButtonDisabled(false)
    if (field.submitButtonDisabled === undefined) {
      return
    }
    if (field.submitButtonDisabled(getValues(field.id))) {
      setSubmitButtonDisabled(true)
    }
  }, [field, application, setSubmitButtonDisabled, getValues, watchField])

  if (!field.isNavigable) {
    return null
  }

  const error = getErrorViaPath(errors, field.id)

  const fieldProps: FieldBaseProps = {
    application,
    setBeforeSubmitCallback,
    setFieldLoadingState,
    autoFocus,
    error,
    errors,
    field: field as Field,
    goToScreen,
    showFieldName,
    refetch,
  }

  const Component = allFields[field.component]
  if (!Component) {
    return <p>We have not implemented this field yet {field.type}</p>
  }

  return <Component {...fieldProps} />
}

export default FormField
