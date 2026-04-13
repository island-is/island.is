import React, { FC, useCallback } from 'react'
import {
  getErrorViaPath,
  shouldShowFormItem,
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

  const error = getErrorViaPath(errors, field.id)

  const renderField = useCallback(
    (childField: Field) => {
      const isVisible = shouldShowFormItem(
        childField,
        application.answers,
        application.externalData,
        null,
      )
      if (!isVisible) return null

      const childDef: FieldDef = {
        ...childField,
        isNavigable: true,
        sectionIndex: field.sectionIndex ?? -1,
        subSectionIndex: field.subSectionIndex ?? -1,
      }

      return (
        <FormField
          key={childField.id}
          application={application}
          field={childDef}
          errors={errors}
          goToScreen={goToScreen}
          refetch={refetch}
          setBeforeSubmitCallback={setBeforeSubmitCallback}
          setFieldLoadingState={setFieldLoadingState}
          setSubmitButtonDisabled={setSubmitButtonDisabled}
          answerQuestions={answerQuestions}
        />
      )
    },
    [
      application,
      errors,
      field.sectionIndex,
      field.subSectionIndex,
      goToScreen,
      refetch,
      setBeforeSubmitCallback,
      setFieldLoadingState,
      setSubmitButtonDisabled,
      answerQuestions,
    ],
  )

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
    renderField,
  }

  const Component = allFields[field.component]
  if (!Component) {
    return <p>We have not implemented this field yet {field.type}</p>
  }

  return <Component {...fieldProps} />
}

export default FormField
