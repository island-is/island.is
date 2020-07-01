import React, { FC } from 'react'
import { Answers, Field, FieldTypes } from '@island.is/application/schema'
import CheckboxFormField from '../fields/CheckboxFormField'
import IntroductionFormField from '../fields/IntroductionFormField'
import TextFormField from '../fields/TextFormField'
import RadioFormField from '../fields/RadioFormField'

const FormField: FC<{
  answers: Answers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answerQuestion: (a: any) => void
  field: Field
  showFieldName?: boolean
}> = ({ field, answerQuestion, answers, showFieldName }) => {
  switch (field.type) {
    case FieldTypes.CHECKBOX:
      return (
        <CheckboxFormField
          answerQuestion={answerQuestion}
          answers={answers}
          field={field}
          showFieldName={showFieldName}
        />
      )
    case FieldTypes.INTRO:
      return (
        <IntroductionFormField field={field} showFieldName={showFieldName} />
      )
    case FieldTypes.RADIO:
      return (
        <RadioFormField
          field={field}
          answers={answers}
          answerQuestion={answerQuestion}
          showFieldName={showFieldName}
        />
      )
    case FieldTypes.TEXT:
      return (
        <TextFormField
          field={field}
          answers={answers}
          answerQuestion={answerQuestion}
          showFieldName={showFieldName}
        />
      )
    default:
      return <p>We have not implemented this field yet {field.type}</p>
  }
}

export default FormField
