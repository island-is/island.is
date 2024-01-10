import { Box } from '@island.is/island-ui/core'

import { CheckboxController } from '@island.is/shared/form-fields'
import { FormIntro } from '../../components/FormIntro/FormIntro'
import { useFormatMessage } from '../../hooks'
import { prerequisites } from '../../lib/messages'
import { AnswerOption, InputFields, OJOIFieldBaseProps } from '../../lib/types'

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
      <CheckboxController
        large
        backgroundColor="blue"
        id={InputFields.prerequisites.approveExternalData}
        name={InputFields.prerequisites.approveExternalData}
        options={[
          {
            value: AnswerOption.YES,
            label: f(prerequisites.checkbox.label),
          },
        ]}
      />
    </Box>
  )
}

export default Prerequisites
