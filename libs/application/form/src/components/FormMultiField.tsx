import React, { FC } from 'react'
import FormField from './FormField'
import { MultiFieldScreen } from '../types'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { FormValue } from '@island.is/application/template'
import ConditionHandler from './ConditionHandler'
import { theme } from '@island.is/island-ui/theme'

const FormMultiField: FC<{
  applicationId: string
  errors: object
  formValue: FormValue
  multiField: MultiFieldScreen
  answerQuestions(Answers): void
}> = ({ applicationId, answerQuestions, errors, formValue, multiField }) => {
  return (
    <GridRow>
      <ConditionHandler
        answerQuestions={answerQuestions}
        formValue={formValue}
        screen={multiField}
      />
      {multiField.children.map((field, index) => {
        const isHalfColumn = field.width && field.width === 'half'
        const span = isHalfColumn ? '1/2' : '1/1'
        return (
          <GridColumn key={field.id} span={['1/1', '1/1', span]}>
            <FormField
              applicationId={applicationId}
              showFieldName
              field={field}
              key={field.id}
              autoFocus={index === 0}
              errors={errors}
              formValue={formValue}
            />
          </GridColumn>
        )
      })}
    </GridRow>
  )
}

export default FormMultiField
