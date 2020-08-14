import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { FieldDef } from '../types'
import { getValueViaPath } from '../utils'
import { getComponentByName } from './componentLoader'

const FormField: FC<{
  autoFocus?: boolean
  field: FieldDef
  showFieldName?: boolean
  errors: object
}> = ({ autoFocus, errors, field, showFieldName }) => {
  const { register } = useFormContext()
  if (!field.isNavigable) {
    return null
  }

  const error = getValueViaPath(errors, field.id, undefined)
  const fieldProps = {
    autoFocus,
    error,
    field,
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
