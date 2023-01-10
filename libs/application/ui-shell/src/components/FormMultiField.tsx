import React, { FC } from 'react'

import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { formatText } from '@island.is/application/core'
import {
  Application,
  FormValue,
  FieldTypes,
  RecordObject,
  SetBeforeSubmitCallback,
  SetFieldLoadingState,
} from '@island.is/application/types'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

import ConditionHandler from './ConditionHandler'
import FormField from './FormField'
import { FieldDef, MultiFieldScreen } from '../types'

const IGNORE_CUSTOM_WIDTH_TYPES: FieldTypes[] = [FieldTypes.RADIO]

const mapWidthToSpan = (width?: string) => {
  if (width === 'quarter') {
    return '1/4'
  }
  if (width === 'half') {
    return '1/2'
  }
  if (width === 'third') {
    return '3/4'
  }
  return '1/1'
}

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
        <GridColumn>
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
      {/*
        Todo:
        The following "section" is for accessibility scoping of controls. Due to CSS configuration I am unable to make this work
        with having the controls nested in the section so I am just interleaving the elements with section "separators" but would be great
        if someone could jump in and fix this.
      */}
      <Box component="section" width="full" aria-labelledby={multiField.id} />
      {children.map((field, index) => {
        const span = !IGNORE_CUSTOM_WIDTH_TYPES.includes(field.type)
          ? mapWidthToSpan(field.width)
          : '1/1'

        return (
          <GridColumn
            key={field.id || index}
            span={field?.colSpan ? field?.colSpan : ['1/1', '1/1', span]}
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
