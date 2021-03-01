import React, { FC } from 'react'

import { Box, Button } from '@island.is/island-ui/core'
import {
  Application,
  FormValue,
  RecordObject,
  FormItemTypes,
} from '@island.is/application/core'
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
  expandFieldRepeater: () => void
}

const FieldRepeater: FC<Props> = ({
  application,
  errors,
  fieldRepeater,
  answerQuestions,
  goToScreen,
  refetch,
  expandFieldRepeater,
}) => {
  return (
    <div>
      {fieldRepeater.children.map((field) => {
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
      <Box marginTop={2}>
        <Button variant="utility" onClick={expandFieldRepeater}>
          Expand
        </Button>
      </Box>
    </div>
  )
}

export default FieldRepeater
