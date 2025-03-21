import { FieldBaseProps } from '@island.is/application/types'
import { FC, useCallback, useState } from 'react'
import { useLazyAreIndividualsValid } from '../../hooks/useLazyAreIndividualsValid'
import { SeminarIndividual } from '@island.is/api/schema'
import { getValueViaPath } from '@island.is/application/core'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { personal } from '../../lib/messages'
import { useFormContext } from 'react-hook-form'
import { RegisterNumber } from '../../shared/types'

export const PersonalValidation: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { setBeforeSubmitCallback, application } = props
  const [isPersonValid, setIsPersonValid] = useState(true)
  const { formatMessage, locale } = useLocale()
  const { getValues } = useFormContext()
  const [errorFromValidation, setErrorFromValidation] = useState<string>(
    formatMessage(personal.labels.personalValidationErrorTitle),
  )
  const courseID =
    getValueViaPath<string>(application.answers, 'initialQuery', '') ?? ''

  const registererNationalId =
    getValueViaPath<string>(
      application.externalData,
      'nationalRegistry.nationalId',
      '',
    ) ?? ''
  const getAreIndividualsValid = useLazyAreIndividualsValid()
  const getIsIndividualValidCallback = useCallback(
    async (individuals: Array<SeminarIndividual>) => {
      const { data } = await getAreIndividualsValid({
        input: { individuals: individuals },
        courseID,
        nationalIdOfRegisterer: registererNationalId,
      })
      return data
    },
    [getAreIndividualsValid],
  )

  setBeforeSubmitCallback?.(async () => {
    setIsPersonValid(true)
    const registerMany = getValues('applicant.registerManyQuestion')
    if (registerMany === RegisterNumber.many) {
      return [true, null]
    }
    const applicantNationalId = getValueViaPath<string>(
      application.externalData,
      'identity.data.nationalId',
      '',
    )
    if (applicantNationalId) {
      const response = await getIsIndividualValidCallback([
        { nationalId: applicantNationalId, email: '' },
      ])
      if (
        response?.areIndividualsValid?.length > 0 &&
        response?.areIndividualsValid[0].mayTakeCourse
      ) {
        return [true, null]
      }
      response?.areIndividualsValid[0]?.errorMessage &&
        response?.areIndividualsValid[0].errorMessageEn &&
        setErrorFromValidation(
          locale === 'is'
            ? response?.areIndividualsValid[0].errorMessage
            : response?.areIndividualsValid[0].errorMessageEn,
        )
      setIsPersonValid(false)
    }
    return [false, '']
  })

  return (
    !isPersonValid && (
      <Box marginTop={5}>
        <AlertMessage type="error" title="" message={errorFromValidation} />
      </Box>
    )
  )
}
