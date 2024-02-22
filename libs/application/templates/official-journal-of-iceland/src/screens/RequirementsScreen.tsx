import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { AnswerOption, InputFields, OJOIFieldBaseProps } from '../lib/types'
import { Checkbox } from '@island.is/island-ui/core'
import { requirements } from '../lib/messages'
import { Controller } from 'react-hook-form'
import { getErrorViaPath } from '@island.is/application/core'

export const RequirementsScreen = ({
  application,
  errors,
}: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()

  return (
    <FormScreen
      title={f(requirements.general.title)}
      intro={f(requirements.general.intro, {
        br: (
          <>
            <br />
            <br />
          </>
        ),
      })}
    >
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
              label={f(requirements.inputs.accept)}
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
      />{' '}
    </FormScreen>
  )
}
