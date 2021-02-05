import React, { FC } from 'react'
import { FieldDef } from '../types'
import {
  Application,
  Field,
  FieldBaseProps,
  getValueViaPath,
  RecordObject,
  ExternalData,
} from '@island.is/application/core'
import { useFields } from './FieldContext'

const FormField: FC<{
  application: Application
  autoFocus?: boolean
  field: FieldDef
  showFieldName?: boolean
  errors: RecordObject
  goToScreen: (id: string) => void
  refetch: () => void
  addExternalData: (data: ExternalData) => void
}> = ({
  application,
  autoFocus,
  errors,
  field,
  goToScreen,
  showFieldName,
  refetch,
  addExternalData,
}) => {
  const [allFields] = useFields()

  if (!field.isNavigable) {
    return null
  }

  const error = getValueViaPath(errors, field.id, undefined) as
    | string
    | undefined

  const fieldProps: FieldBaseProps = {
    application,
    autoFocus,
    error,
    field: field as Field,
    goToScreen,
    showFieldName,
    refetch,
    addExternalData,
  }

  const Component = allFields[field.component]

  if (!Component) {
    return <p>We have not implemented this field yet {field.type}</p>
  }

  return <Component {...fieldProps} />
}

export default FormField
