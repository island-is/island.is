import React, { FC } from 'react'

import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import {
  Application,
  formatText,
  FormValue,
  FieldTypes,
  RecordObject,
  SetBeforeSubmitCallback,
  SetFieldLoadingState,
} from '@island.is/application/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

import ConditionHandler from './ConditionHandler'
import FormField from './FormField'
import { FieldDef, MultiFieldScreen } from '../types'

const IGNORED_HALF_TYPES: FieldTypes[] = [FieldTypes.RADIO]

const FormMultiField: FC<{
  application: Application
  errors: RecordObject
  multiField: MultiFieldScreen
  answerQuestions(answers: FormValue): void
  goToScreen: (id: string) => void
  refetch: () => void
  setBeforeSubmitCallback?: SetBeforeSubmitCallback
  setFieldLoadingState?: SetFieldLoadingState
}> = ({
  application,
  answerQuestions,
  errors,
  goToScreen,
  multiField,
  refetch,
  setBeforeSubmitCallback,
  setFieldLoadingState,
}) => {
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

      {/* Todo:
          We need a better approach for overall field spacing and control of spacing.
          For now I'm setting this based on the Parental Leave comps:
          https://www.figma.com/file/xXSz5E9SRRs6Me0vtpgimH/F%C3%A6%C3%B0ingarorlof-Ums%C3%B3kn?node-id=465%3A0

          FieldDescription already has a mb of 1 so set it to 3(+1) else 4.
      */}
      <Box width="full" marginTop={description ? 3 : 4} />

      {children.map((field, index) => {
        const isHalfColumn =
          !IGNORED_HALF_TYPES.includes(field.type) && field?.width === 'half'
        const span = isHalfColumn ? '1/2' : '1/1'

        return (
          <GridColumn
            key={field.id || index}
            span={['1/1', '1/1', span]}
            paddingBottom={index === children.length - 1 ? 0 : space}
          >
            <Box>
              <FormField
                application={application}
                showFieldName
                field={field as FieldDef}
                key={field.id}
                errors={errors}
                goToScreen={goToScreen}
                refetch={refetch}
                setBeforeSubmitCallback={setBeforeSubmitCallback}
                setFieldLoadingState={setFieldLoadingState}
              />
            </Box>
          </GridColumn>
        )
      })}
    </GridRow>
  )
}

export default FormMultiField
