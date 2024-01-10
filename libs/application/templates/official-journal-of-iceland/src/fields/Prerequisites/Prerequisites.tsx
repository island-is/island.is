import { Box, Checkbox } from '@island.is/island-ui/core'

import { FormIntro } from '../../components/FormIntro/FormIntro'
import { useFormatMessage } from '../../hooks'
import { prerequisites } from '../../lib/messages'
import { AnswerOption, InputFields, OJOIFieldBaseProps } from '../../lib/types'
import { Controller } from 'react-hook-form'

export const Prerequisites = ({ application }: OJOIFieldBaseProps) => {
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
          application.answers.approveExternalData ?? AnswerOption.NO
        }
        render={({ field: { onChange, value } }) => {
          return (
            <Checkbox
              backgroundColor="blue"
              large
              onChange={(e) => {
                onChange(e.target.checked ? AnswerOption.YES : AnswerOption.NO)
              }}
              checked={value === AnswerOption.YES}
              label={f(prerequisites.checkbox.label)}
              name={InputFields.prerequisites.approveExternalData}
              id={InputFields.prerequisites.approveExternalData}
            />
          )
        }}
      />
    </Box>
  )
}

export default Prerequisites
