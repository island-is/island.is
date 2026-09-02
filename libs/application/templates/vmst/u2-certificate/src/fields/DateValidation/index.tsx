import { AlertMessage, Box } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { FC, useCallback, useState } from 'react'
import { getValueViaPath } from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { useLazyValidateU2 } from '../../hooks/useLazyValidateU2'

export const DateValidation: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { setBeforeSubmitCallback } = props
  const [validationError, setValidationError] = useState<string>()
  const { lang } = useLocale()
  const { getValues } = useFormContext()

  const getValidateU2 = useLazyValidateU2()
  const getValidateU2Callback = useCallback(
    async (dateWhenLeaving: string, destinationCountryId: string) => {
      const { data } = await getValidateU2({
        input: {
          dateWhenLeaving,
          destinationCountryId,
        },
      })
      return data
    },
    [getValidateU2],
  )

  setBeforeSubmitCallback?.(async () => {
    const answers = getValues()
    const departureDate =
      getValueViaPath<string>(answers, 'countryAndDate.departureDate') ?? ''
    const country =
      getValueViaPath<string>(answers, 'countryAndDate.country') ?? ''
    const response = await getValidateU2Callback(departureDate, country)
    if (response?.vmstApplicationsU2Validation?.isValid) {
      setValidationError('')
      return [true, null]
    }

    const errMsg =
      lang === 'is'
        ? response?.vmstApplicationsU2Validation?.reason || ''
        : response?.vmstApplicationsU2Validation?.reasonEN || ''
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
