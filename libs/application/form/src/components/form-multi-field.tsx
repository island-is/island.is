import React, { FC } from 'react'
import { Answers, MultiField } from '@island.is/application/schema'
import FormField from './form-field'

const FormMultiField: FC<{
  answers: Answers
  answerQuestion({ id: string, answer: any }): void
  multiField: MultiField
}> = ({ answers, answerQuestion, multiField }) => {
  return (
    <div>
      {multiField.children.map((field) => (
        <FormField
          showFieldName
          field={field}
          answers={answers}
          answerQuestion={answerQuestion}
          key={field.id}
        />
      ))}
    </div>
  )
}

export default FormMultiField
