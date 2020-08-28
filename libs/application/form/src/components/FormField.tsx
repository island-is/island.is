import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { FieldDef } from '../types'
import { getValueViaPath } from '../utils'
import { getComponentByName } from './componentLoader'
import { FormValue } from '@island.is/application/schema'

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
  const { register } = useFormContext()
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
    register,
  }

  const Component = getComponentByName(field.component)
  if (Component === null) {
    return <p>We have not implemented this field yet {field.type}</p>
  }

  return <Component {...fieldProps} />
}

export default FormField
