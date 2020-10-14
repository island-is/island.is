import React, { FC } from 'react'
import FormField from './FormField'
import { MultiFieldScreen } from '../types'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { Application, formatText, FormValue } from '@island.is/application/core'
import ConditionHandler from './ConditionHandler'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

const FormMultiField: FC<{
  application: Application
  errors: object
  multiField: MultiFieldScreen
  answerQuestions(answers: FormValue): void
}> = ({ application, answerQuestions, errors, multiField }) => {
  const { description, children } = multiField
  const { formatMessage } = useLocale()
  return (
    <GridRow>
      <ConditionHandler
        answerQuestions={answerQuestions}
        formValue={application.answers}
        screen={multiField}
      />
      {description && (
        <GridColumn span={['1/1', '1/1', '1/1']}>
          <FieldDescription
            description={formatText(description, application, formatMessage)}
          />
        </GridColumn>
      )}
      {children.map((field, index) => {
        const isHalfColumn = field.width && field.width === 'half'
        const span = isHalfColumn ? '1/2' : '1/1'
        return (
          <GridColumn key={field.id} span={['1/1', '1/1', span]}>
            <Box paddingTop={1}>
              <FormField
                application={application}
                showFieldName
                field={field}
                key={field.id}
                autoFocus={index === 0}
                errors={errors}
              />
            </Box>
          </GridColumn>
        )
      })}
    </GridRow>
  )
}

export default FormMultiField
