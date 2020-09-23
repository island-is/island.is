import React, { FC } from 'react'
import { FieldComponentProps, FieldDef } from '../types'
import { getValueViaPath } from '../utils'
import { getComponentByName } from './componentLoader'
import { FormValue } from '@island.is/application/template'

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
  if (!field.isNavigable) {
    return null
  }

  const error = getValueViaPath(errors, field.id, undefined)
  const fieldProps = {
    applicationId,
    autoFocus,
    error,
    field,
    formValue,
    showFieldName,
  }

  const Component = getComponentByName(field.component) as FC<
    FieldComponentProps
  > | null
  if (Component === null) {
    return <p>We have not implemented this field yet {field.type}</p>
  }

  return <Component {...fieldProps} />
}

export default FormField
