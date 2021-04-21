import React, { FC } from 'react'
import { FieldDef } from '../types'
import {
  Application,
  Field,
  FieldBaseProps,
  getErrorViaPath,
  RecordObject,
  SetBeforeSubmitCallback,
} from '@island.is/application/core'
import { useFields } from './FieldContext'

const FormField: FC<{
  application: Application
  setBeforeSubmitCallback?: SetBeforeSubmitCallback
  autoFocus?: boolean
  field: FieldDef
  showFieldName?: boolean
  errors: RecordObject
  goToScreen: (id: string) => void
  refetch: () => void
}> = ({
  application,
  setBeforeSubmitCallback,
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
