import { Box, Checkbox } from '@island.is/island-ui/core'

import { FormIntro } from '../../components/FormIntro/FormIntro'
import { useFormatMessage } from '../../hooks'
import { prerequisites } from '../../lib/messages'
import { AnswerOption, InputFields, OJOIFieldBaseProps } from '../../lib/types'
import { Controller } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { getErrorViaPath } from '@island.is/application/core'

export const Prerequisites = ({ application, errors }: OJOIFieldBaseProps) => {
  const { f } = useFormatMessage(application)
  return (
    <Box display="flex" flexDirection="column" justifyContent="spaceBetween">
      <FormIntro
        title={f(prerequisites.general.formTitle)}
        intro={f(prerequisites.general.formIntro, {
          br: (
            <>
              <br />
              <br />
            </>
          ),
        })}
      />
      <Controller
        name={InputFields.prerequisites.approveExternalData}
        defaultValue={
          application.answers.prerequisites?.approveExternalData ??
          AnswerOption.NO
        }
        render={({ field: { onChange, value } }) => {
          return (
            <Checkbox
              id={InputFields.prerequisites.approveExternalData}
              name={InputFields.prerequisites.approveExternalData}
              label={f(prerequisites.checkbox.label)}
              checked={value === AnswerOption.YES}
              onChange={(e) => {
                onChange(e.target.checked ? AnswerOption.YES : AnswerOption.NO)
              }}
              backgroundColor="blue"
              hasError={
                getErrorViaPath(
                  errors,
                  InputFields.prerequisites.approveExternalData,
                )
                  ? true
                  : false
              }
              errorMessage={getErrorViaPath(
                errors,
                InputFields.prerequisites.approveExternalData,
              )}
              large
            />
          )
        }}
      />
    </Box>
  )
}

export default Prerequisites
