import React, { FC } from 'react'
import FormField from './FormField'
import { MultiFieldScreen } from '../types'
import { Box } from '@island.is/island-ui/core'
import { FormValue } from '@island.is/application/template'
import ConditionHandler from './ConditionHandler'

const FormMultiField: FC<{
  applicationId: string
  errors: object
  formValue: FormValue
  multiField: MultiFieldScreen
  answerQuestions(Answers): void
}> = ({ applicationId, answerQuestions, errors, formValue, multiField }) => {
  return (
    <Box display="flex" flexWrap="wrap">
      <ConditionHandler
        answerQuestions={answerQuestions}
        formValue={formValue}
        screen={multiField}
      />
      {multiField.children.map((field, index) => (
        <Box
          key={field.id}
          id={`${field.id}-${field.width}`}
          paddingTop={2}
          style={{
            // TODO improve this
            width: field.width === 'half' ? '45%' : '100%',
            alignContent: 'space-between',
            justifyContent: 'space-between',
          }}
        >
          <FormField
            applicationId={applicationId}
            showFieldName
            field={field}
            key={field.id}
            autoFocus={index === 0}
            errors={errors}
            formValue={formValue}
          />
        </Box>
      ))}
    </Box>
  )
}

export default FormMultiField
