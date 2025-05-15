import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { InputFields, OJOIFieldBaseProps } from '../lib/types'
import {
  AlertMessage,
  Checkbox,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { error, requirements } from '../lib/messages'
import { Controller, useFormContext } from 'react-hook-form'
import { getErrorViaPath, YesOrNoEnum } from '@island.is/application/core'
import { OJOI_INPUT_HEIGHT } from '../lib/constants'
import { useApplication } from '../hooks/useUpdateApplication'
import { useEffect } from 'react'

export const RequirementsScreen = ({
  application,
  errors,
  setSubmitButtonDisabled,
}: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const { setValue } = useFormContext()
  const {
    updateApplication,
    applicationLoading,
    applicationError,
    updateLoading,
  } = useApplication({
    applicationId: application.id,
  })

  /**
   * Set default values for the application
   */
  useEffect(() => {
    const currentAnswers = structuredClone(application.answers)

    setValue(InputFields.misc.signatureType, currentAnswers.misc?.signatureType)

    updateApplication(currentAnswers)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (applicationLoading || updateLoading) {
    return (
      <SkeletonLoader
        repeat={3}
        height={OJOI_INPUT_HEIGHT}
        space={2}
        borderRadius="standard"
      />
    )
  }

  if (applicationError) {
    setSubmitButtonDisabled && setSubmitButtonDisabled(true)

    return (
      <AlertMessage
        type="error"
        title={f(error.fetchApplicationFailedTitle)}
        message={f(error.fetchApplicationFailedMessage)}
      />
    )
  }

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
          YesOrNoEnum.NO
        }
        render={({ field: { onChange, value } }) => {
          return (
            <Checkbox
              id={InputFields.requirements.approveExternalData}
              name={InputFields.requirements.approveExternalData}
              label={f(requirements.inputs.accept)}
              checked={value === YesOrNoEnum.YES}
              onChange={(e) => {
                onChange(e.target.checked ? YesOrNoEnum.YES : YesOrNoEnum.NO)
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
