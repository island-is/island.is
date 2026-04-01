import React, { FC } from 'react'
import {
  getErrorViaPath,
  resolveFieldClearOnChange,
  resolveFieldId,
} from '@island.is/application/core'
import {
  Application,
  Field,
  FieldBaseProps,
  RecordObject,
  SetFieldLoadingState,
  SetBeforeSubmitCallback,
  SetSubmitButtonDisabled,
  FormValue,
} from '@island.is/application/types'
import { BffUser } from '@island.is/shared/types'

import { useFields } from '../context/FieldContext'
import { FieldDef } from '../types'

const FormField: FC<
  React.PropsWithChildren<{
    application: Application
    setBeforeSubmitCallback?: SetBeforeSubmitCallback
    setFieldLoadingState?: SetFieldLoadingState
    setSubmitButtonDisabled?: SetSubmitButtonDisabled
    answerQuestions?: (answers: FormValue) => void
    autoFocus?: boolean
    field: FieldDef
    showFieldName?: boolean
    errors: RecordObject
    goToScreen: (id: string) => void
    refetch: () => void
    user?: BffUser
  }>
> = ({
  application,
  setBeforeSubmitCallback,
  setFieldLoadingState,
  setSubmitButtonDisabled,
  answerQuestions,
  autoFocus,
  errors,
  field,
  goToScreen,
  showFieldName,
  refetch,
  user,
}) => {
  const [allFields] = useFields()

  if (!field.isNavigable) {
    return null
  }

  const f = field as Field
  const resolvedId = resolveFieldId(f, application, user)
  const resolvedClearOnChange = resolveFieldClearOnChange(f, application, user)
  const needsResolvedId = typeof f.id === 'function'
  const needsResolvedClearOnChange = typeof f.clearOnChange === 'function'
  const fieldForRender =
    needsResolvedId || needsResolvedClearOnChange
      ? {
          ...f,
          id: resolvedId,
          clearOnChange: resolvedClearOnChange,
        }
      : f

  const error = getErrorViaPath(errors, resolvedId)

  const fieldProps: FieldBaseProps = {
    application,
    setBeforeSubmitCallback,
    setFieldLoadingState,
    setSubmitButtonDisabled,
    answerQuestions,
    autoFocus,
    error,
    errors,
    field: fieldForRender as Field,
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
