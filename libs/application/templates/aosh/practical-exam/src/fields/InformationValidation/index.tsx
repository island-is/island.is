import { FieldBaseProps } from '@island.is/application/types'
import { FC, useCallback, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useLazyAreExamineesEligible } from '../../hooks/useLazyAreExamineesEligible'
import { SelfOrOthers, TrueOrFalse } from '../../utils/enums'
import { InformationType } from '../../lib/dataSchema'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'

export const InformationValidation: FC<
  React.PropsWithChildren<FieldBaseProps>
> = (props) => {
  const { setBeforeSubmitCallback, application } = props
  const [validationError, setValidationError] = useState<string>()
  const { lang } = useLocale()
  const { getValues, setValue } = useFormContext()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const getAreExamineesEligible = useLazyAreExamineesEligible()
  const getAreExamineesEligibleCallback = useCallback(
    async (nationalIds: Array<string>) => {
      const { data } = await getAreExamineesEligible({
        input: { nationalIds: nationalIds, xCorrelationID: application.id },
      })
      return data
    },
    [application.id, getAreExamineesEligible],
  )

  setBeforeSubmitCallback?.(async () => {
    const infoSelf: InformationType = getValues('information')
    if (infoSelf.selfOrOthers === SelfOrOthers.others) return [true, null]
    const response = await getAreExamineesEligibleCallback([
      infoSelf.nationalId,
    ])

    if (response.getExamineeEligibility[0].isEligible) {
      const { nationalId, name, email, phone, licenseNumber, countryOfIssue } =
        infoSelf

      const valuePayload = [
        {
          nationalId: {
            nationalId: nationalId,
            name: name,
          },
          email: email,
          phone: phone,
          countryIssuer: countryOfIssue,
          licenseNumber: licenseNumber,
          disabled: TrueOrFalse.false,
        },
      ]
      setValidationError('')
      setValue('examinees', valuePayload)
      await updateApplication({
        variables: {
          input: {
            id: application.id,
            answers: {
              examinees: valuePayload,
            },
          },
          locale: lang,
        },
      })
      return [true, null]
    }

    const errMsg =
      lang === 'is'
        ? response.getExamineeEligibility[0].errorMsg || ''
        : response.getExamineeEligibility[0].errorMsgEn || ''
    setValidationError(errMsg)
    return [false, '']
  })

  if (validationError) {
    return (
      <Box marginTop={4}>
        <AlertMessage type="warning" message={validationError} />
      </Box>
    )
  }
  return null
}
