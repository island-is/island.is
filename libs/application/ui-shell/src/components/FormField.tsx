import React, { FC } from 'react'
import { FieldDef } from '../types'
import {
  Field,
  FieldBaseProps,
  FormValue,
  getValueViaPath,
} from '@island.is/application/core'
import { useFields } from './FieldContext'

const FormField: FC<{
  applicationId: string
  autoFocus?: boolean
  field: FieldDef
  formValue: FormValue
  showFieldName?: boolean
  errors: object
}> = ({
  applicationId,
  autoFocus,
  errors,
  field,
  formValue,
  showFieldName,
}) => {
  const [allFields] = useFields()
  if (!field.isNavigable) {
    return null
  }

  const error = getValueViaPath(errors, field.id, undefined) as
    | string
    | undefined
  const fieldProps: FieldBaseProps = {
    applicationId,
    autoFocus,
    error,
    field: field as Field,
    formValue,
    showFieldName,
  }
  const Component = allFields[field.component]
  if (!Component) {
    return <p>We have not implemented this field yet {field.type}</p>
  }

  return <Component {...fieldProps} />
}

export default FormField
