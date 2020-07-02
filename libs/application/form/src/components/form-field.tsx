import React, { FC } from 'react'
import {
  Answers,
  CheckboxField,
  Field,
  FieldTypes,
  IntroductionField,
  RadioField,
  TextField,
} from '@island.is/application/schema'
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
  if (field.type === FieldTypes.CHECKBOX) {
    return (
      <CheckboxFormField
        answerQuestion={answerQuestion}
        answers={answers}
        field={field as CheckboxField}
        showFieldName={showFieldName}
      />
    )
  } else if (field.type === FieldTypes.INTRO) {
    return (
      <IntroductionFormField
        field={field as IntroductionField}
        showFieldName={showFieldName}
      />
    )
  } else if (field.type === FieldTypes.RADIO) {
    return (
      <RadioFormField
        field={field as RadioField}
        answers={answers}
        answerQuestion={answerQuestion}
        showFieldName={showFieldName}
      />
    )
  } else if (field.type === FieldTypes.TEXT) {
    return (
      <TextFormField
        field={field as TextField}
        answers={answers}
        answerQuestion={answerQuestion}
        showFieldName={showFieldName}
      />
    )
  } else {
    return <p>We have not implemented this field yet {field.type}</p>
  }
}

export default FormField
