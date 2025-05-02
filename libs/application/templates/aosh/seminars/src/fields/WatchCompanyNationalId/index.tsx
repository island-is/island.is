import { FieldBaseProps } from '@island.is/application/types'
import { FC, useCallback, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useLazyIsCompanyValid } from '../../hooks/useLazyIsCompanyValid'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { paymentArrangement } from '../../lib/messages'
import { isCompanyType } from '../../utils'
import { IndividualOrCompany, PaymentOptions } from '../../shared/types'

export const WatchCompanyNationalId: FC<
  React.PropsWithChildren<FieldBaseProps>
> = (props) => {
  const { setBeforeSubmitCallback, application } = props
  const { getValues, setValue } = useFormContext()
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

  useEffect(() => {
    // To trigger the validation
    if (isCompanyType(application.externalData)) {
      setValue(
        'paymentArrangement.individualOrCompany',
        IndividualOrCompany.company,
      )
    }
  }, [setValue, application.externalData])

  setBeforeSubmitCallback?.(async () => {
    setIsCompanyValid(true)
    const paymentOptions = getValues('paymentArrangement.paymentOptions')
    if (paymentOptions === PaymentOptions.cashOnDelivery) {
      return [true, null]
    }
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

  return (
    !isCompanyValid && (
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
  )
}
