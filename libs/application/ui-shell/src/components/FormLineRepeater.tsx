import React, { FC } from 'react'

import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Stack,
} from '@island.is/island-ui/core'
import {
  Application,
  formatText,
  FormValue,
  FieldTypes,
  RecordObject,
} from '@island.is/application/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

import ConditionHandler from './ConditionHandler'
import FormField from './FormField'
import { FieldDef, LineRepeaterScreen, MultiFieldScreen } from '../types'

const IGNORED_HALF_TYPES: FieldTypes[] = [FieldTypes.RADIO]

const FormLineRepeater: FC<{
  application: Application
  errors: RecordObject
  multiField: LineRepeaterScreen
  answerQuestions(answers: FormValue): void
  goToScreen: (id: string) => void
  refetch: () => void
  expandLineRepeater: () => void
}> = ({
  application,
  answerQuestions,
  errors,
  goToScreen,
  multiField,
  refetch,
  expandLineRepeater,
}) => {
  const { children } = multiField

  return (
    <>
      {children.map((field, index) => {
        return (
          <div key={index}>
            <div>Field</div>
            <FormField
              application={application}
              showFieldName
              field={field as FieldDef}
              key={field.id}
              errors={errors}
              goToScreen={goToScreen}
              refetch={refetch}
            />
          </div>
        )
      })}
      <Box paddingTop={2}>
        <Button onClick={expandLineRepeater}>Add Line</Button>
      </Box>
    </>
  )
}

export default FormLineRepeater
