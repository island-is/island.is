import { Box, Checkbox } from '@island.is/island-ui/core'

import { FormIntro } from '../../components/FormIntro/FormIntro'
import { useFormatMessage } from '../../hooks'
import { requirements } from '../../lib/messages'
import { AnswerOption, InputFields, OJOIFieldBaseProps } from '../../lib/types'
import { Controller } from 'react-hook-form'
import { getErrorViaPath } from '@island.is/application/core'

export const Requirements = ({ application, errors }: OJOIFieldBaseProps) => {
  const { f } = useFormatMessage(application)
  return (
    <Box display="flex" flexDirection="column" justifyContent="spaceBetween">
      <FormIntro
        title={f(requirements.general.formTitle)}
        intro={f(requirements.general.formIntro, {
          br: (
            <>
              <br />
              <br />
            </>
          ),
        })}
      />
      <Controller
        name={InputFields.requirements.approveExternalData}
        defaultValue={
          application.answers.requirements?.approveExternalData ??
          AnswerOption.NO
        }
        render={({ field: { onChange, value } }) => {
          return (
            <Checkbox
              id={InputFields.requirements.approveExternalData}
              name={InputFields.requirements.approveExternalData}
              label={f(requirements.checkbox.label)}
              checked={value === AnswerOption.YES}
              onChange={(e) => {
                onChange(e.target.checked ? AnswerOption.YES : AnswerOption.NO)
              }}
              backgroundColor="blue"
              hasError={
                getErrorViaPath(
                  errors,
                  InputFields.requirements.approveExternalData,
                )
                  ? true
                  : false
              }
              errorMessage={getErrorViaPath(
                errors,
                InputFields.requirements.approveExternalData,
              )}
              large
            />
          )
        }}
      />
    </Box>
  )
}

export default Requirements
