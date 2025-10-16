import { FieldBaseProps } from '@island.is/application/types'
import { FC, useCallback, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  CurrentSituationInAnswers,
  EmploymentStatus,
  VacationInAnswers,
} from '../../shared'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { getValueViaPath, YES } from '@island.is/application/core'
import { GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsUnpaidVacationDTO } from '@island.is/clients/vmst-unemployment'
import { useLocale } from '@island.is/localization'
import { vacationErrors } from '../../lib/messages'
import { MessageDescriptor } from 'react-intl'
import { useLazyIsVacationValid } from '../../hooks/useLazyVacationIsValid'

export const VacationValidation: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { setBeforeSubmitCallback } = props
  const { getValues } = useFormContext()
  const [errors, setErrors] = useState<Array<MessageDescriptor | string>>([])
  const { formatMessage, locale } = useLocale()
  const [getIsValidVacationInformation] = useLazyIsVacationValid()

  const getIsVacationValidCallback = useCallback(
    async (input: {
      hasUnpaidVacationTime: boolean
      unpaidVacations?: Array<GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsUnpaidVacationDTO>
      resignationEnds?: Date
    }) => {
      const { data } = await getIsValidVacationInformation({
        variables: { input },
      })
      return data
    },
    [getIsValidVacationInformation],
  )

  setBeforeSubmitCallback?.(async () => {
    setErrors([])

    const vacationInfo: VacationInAnswers = getValues('vacation')

    const hasUnpaidVacationTime = vacationInfo?.doYouHaveVacationDays === YES

    const unpaidVacations =
      vacationInfo?.vacationDays?.map((vacation) => ({
        unpaidVacationStart: vacation.startDate
          ? new Date(vacation.startDate)
          : undefined,
        unpaidVacationEnd: vacation.endDate
          ? new Date(vacation.endDate)
          : undefined,
        unpaidVacationDays: parseInt(vacation.amount || ''),
      })) || []

    const currentSitutation = getValueViaPath<CurrentSituationInAnswers>(
      props.application.answers,
      'currentSituation',
    )
    const hasPredictedEndDate =
      currentSitutation?.status === EmploymentStatus.EMPLOYED
    const predictedEndDate =
      hasPredictedEndDate &&
      currentSitutation?.currentSituationRepeater &&
      currentSitutation?.currentSituationRepeater?.length > 0
        ? currentSitutation?.currentSituationRepeater[0]?.predictedEndDate
        : undefined

    try {
      const response = await getIsVacationValidCallback({
        hasUnpaidVacationTime: hasUnpaidVacationTime,
        unpaidVacations: unpaidVacations.filter((x) => !!x.unpaidVacationDays),
        resignationEnds: predictedEndDate
          ? new Date(predictedEndDate)
          : new Date(),
      })

      if (
        response?.vmstApplicationsVacationValidationUnemploymentApplication
          .isValid
      )
        return [true, null]

      const userMessageIS =
        response?.vmstApplicationsVacationValidationUnemploymentApplication
          .userMessageIS || ''

      const userMessageEn =
        response?.vmstApplicationsVacationValidationUnemploymentApplication
          .userMessageEN || ''

      const userMessageBasedOnLocale =
        locale === 'en' ? userMessageEn : userMessageIS

      setErrors((prev) => [...prev, userMessageBasedOnLocale])
    } catch (e) {
      setErrors((prev) => [...prev, vacationErrors.invalidVacation])
    }

    return [false, '']
  })

  return (
    <Box>
      {errors &&
        errors.length > 0 &&
        errors.map((val, index) => (
          <Box key={index} marginBottom={2}>
            <AlertMessage
              title={formatMessage(vacationErrors.invalidValue)}
              message={formatMessage(val)}
              type="warning"
            />
          </Box>
        ))}
    </Box>
  )
}
