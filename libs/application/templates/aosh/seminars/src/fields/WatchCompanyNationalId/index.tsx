import { FieldBaseProps } from '@island.is/application/types'
import { FC, useCallback, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useLazyIsCompanyValid } from '../../hooks/useLazyIsCompanyValid'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { paymentArrangement } from '../../lib/messages'

export const WatchCompanyNationalId: FC<
  React.PropsWithChildren<FieldBaseProps>
> = (props) => {
  const { setBeforeSubmitCallback } = props
  const { getValues } = useFormContext()
  const { formatMessage } = useLocale()
  const [isCompanyValid, setIsCompanyValid] = useState<boolean>(true)
  const getIsValidCompany = useLazyIsCompanyValid()
  const getIsCompanyValidCallback = useCallback(
    async (nationalId: string) => {
      const { data } = await getIsValidCompany({
        nationalId,
      })
      return data
    },
    [getIsValidCompany],
  )

  setBeforeSubmitCallback?.(async () => {
    setIsCompanyValid(true)
    const companyNationalId = getValues(
      'paymentArrangement.companyInfo.nationalId',
    )
    if (companyNationalId) {
      const response = await getIsCompanyValidCallback(companyNationalId)
      if (response?.seminarsVerIsCompanyValid?.mayPayWithAnAccount) {
        return [true, null]
      }
      setIsCompanyValid(false)
    }

    return [false, '']
  })

  return isCompanyValid ? null : (
    <Box marginTop={5}>
      <AlertMessage
        type="error"
        title=""
        message={formatMessage(
          paymentArrangement.labels.contactOrganizationAlert,
        )}
      />
    </Box>
  )
}
