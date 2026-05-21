import React, { FC, useCallback } from 'react'
import {
  getErrorViaPath,
  shouldShowFormItem,
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
          showFieldName
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

  const fieldProps: FieldBaseProps = {
    application,
    setBeforeSubmitCallback,
    setFieldLoadingState,
    setSubmitButtonDisabled,
    answerQuestions,
    autoFocus,
    error,
    errors,
    field: field as Field,
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
