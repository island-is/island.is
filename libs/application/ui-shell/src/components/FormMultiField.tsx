import React, { FC } from 'react'

import { Box, GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import {
  Application,
  formatText,
  FormValue,
  FieldTypes,
} from '@island.is/application/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

import ConditionHandler from './ConditionHandler'
import FormField from './FormField'
import { FieldDef, MultiFieldScreen } from '../types'

const IGNORED_HALF_TYPES: FieldTypes[] = [FieldTypes.RADIO]

const FormMultiField: FC<{
  application: Application
  errors: object
  multiField: MultiFieldScreen
  answerQuestions(answers: FormValue): void
  goToScreen: (id: string) => void
}> = ({ application, answerQuestions, errors, goToScreen, multiField }) => {
  const { description, children, space = 0 } = multiField
  const { formatMessage } = useLocale()
  return (
    <GridRow>
      <ConditionHandler
        answerQuestions={answerQuestions}
        externalData={application.externalData}
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
      <Box width="full" marginTop={4}>
        <Stack space={space}>
          {children.map((field) => {
            const isHalfColumn =
              !IGNORED_HALF_TYPES.includes(field.type) &&
              field?.width === 'half'
            const span = isHalfColumn ? '1/2' : '1/1'

            return (
              <GridColumn key={field.id} span={['1/1', '1/1', span]}>
                <Box paddingTop={1}>
                  <FormField
                    application={application}
                    showFieldName
                    field={field as FieldDef}
                    key={field.id}
                    errors={errors}
                    goToScreen={goToScreen}
                  />
                </Box>
              </GridColumn>
            )
          })}
        </Stack>
      </Box>
    </GridRow>
  )
}

export default FormMultiField
