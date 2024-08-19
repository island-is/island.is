import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { InputFields, OJOIFieldBaseProps } from '../lib/types'
import { Checkbox } from '@island.is/island-ui/core'
import { requirements } from '../lib/messages'
import { Controller } from 'react-hook-form'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import {
  AnswerOption,
  DEFAULT_COMMITTEE_SIGNATURE_MEMBER_COUNT,
  DEFAULT_REGULAR_SIGNATURE_COUNT,
  DEFAULT_REGULAR_SIGNATURE_MEMBER_COUNT,
} from '../lib/constants'
import { useEffect } from 'react'
import { useApplication } from '../hooks/useUpdateApplication'
import { getRegularSignature, getCommitteeSignature } from '../lib/utils'

export const RequirementsScreen = ({
  application,
  errors,
}: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()

  const { updateApplication } = useApplication({
    applicationId: application.id,
  })

  useEffect(() => {
    const regularSignature = !!getValueViaPath(
      application.answers,
      InputFields.signature.regular,
    )
    const committeeSignature = !!getValueViaPath(
      application.answers,
      InputFields.signature.committee,
    )

    if (!regularSignature && !committeeSignature) {
      updateApplication({
        ...application.answers,
        signatures: {
          regular: getRegularSignature(
            DEFAULT_REGULAR_SIGNATURE_COUNT,
            DEFAULT_REGULAR_SIGNATURE_MEMBER_COUNT,
          ),
          committee: getCommitteeSignature(
            DEFAULT_COMMITTEE_SIGNATURE_MEMBER_COUNT,
          ),
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      />
    </FormScreen>
  )
}
