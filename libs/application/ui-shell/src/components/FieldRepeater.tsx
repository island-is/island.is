import React, { FC } from 'react'

import {
  Box,
  GridColumn,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  Application,
  formatText,
  FormValue,
  FieldTypes,
  RecordObject,
  FormItemTypes,
} from '@island.is/application/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

import ConditionHandler from './ConditionHandler'
import FormField from './FormField'
import { FieldDef, FieldRepeaterScreen, MultiFieldScreen } from '../types'
import FormMultiField from './FormMultiField'

interface Props {
  application: Application
  errors: RecordObject
  fieldRepeater: FieldRepeaterScreen
  answerQuestions(answers: FormValue): void
  goToScreen: (id: string) => void
  refetch: () => void
}

const FieldRepeater: FC<Props> = ({
  application,
  errors,
  fieldRepeater,
  answerQuestions,
  goToScreen,
  refetch,
}) => {
  return (
    <div>
      {fieldRepeater.children.map((field, index) => {
        return field.type === FormItemTypes.MULTI_FIELD ? (
          <FormMultiField
            answerQuestions={answerQuestions}
            errors={errors}
            multiField={field as MultiFieldScreen}
            application={application}
            goToScreen={goToScreen}
            refetch={refetch}
          />
        ) : (
          <FormField
            application={application}
            showFieldName
            field={field as FieldDef}
            key={field.id}
            errors={errors}
            goToScreen={goToScreen}
            refetch={refetch}
          />
        )
      })}
    </div>
  )
}

export default FieldRepeater
