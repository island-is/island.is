import React, { FC } from 'react'
import { getErrorViaPath } from '@island.is/application/core'
import {
  Application,
  Field,
  FieldBaseProps,
  RecordObject,
  SetFieldLoadingState,
  SetBeforeSubmitCallback,
  SetSubmitButtonDisabled,
} from '@island.is/application/types'

import { useFields } from '../context/FieldContext'
import { FieldDef } from '../types'

const FormField: FC<
  React.PropsWithChildren<{
    application: Application
    setBeforeSubmitCallback?: SetBeforeSubmitCallback
    setFieldLoadingState?: SetFieldLoadingState
    setSubmitButtonDisabled?: SetSubmitButtonDisabled
    autoFocus?: boolean
    field: FieldDef
    showFieldName?: boolean
    errors: RecordObject
    goToScreen: (id: string) => void
    refetch: () => void
  }>
> = ({
  application,
  setBeforeSubmitCallback,
  setFieldLoadingState,
  setSubmitButtonDisabled,
  autoFocus,
  errors,
  field,
  goToScreen,
  showFieldName,
  refetch,
}) => {
  const [allFields] = useFields()

  if (!field.isNavigable) {
    return null
  }

  const error = getErrorViaPath(errors, field.id)

  const fieldProps: FieldBaseProps = {
    application,
    setBeforeSubmitCallback,
    setFieldLoadingState,
    setSubmitButtonDisabled,
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
