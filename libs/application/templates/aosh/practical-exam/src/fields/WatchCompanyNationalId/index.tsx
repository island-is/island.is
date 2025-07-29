import { FieldBaseProps } from '@island.is/application/types'
import { FC, useCallback, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useLazyIsCompanyValid } from '../../hooks/useLazyIsCompanyValid'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { paymentArrangement } from '../../lib/messages'
import { IndividualOrCompany, PaymentOptions } from '../../utils/enums'
import { isCompany } from '../../utils'

export const WatchCompanyNationalId: FC<
  React.PropsWithChildren<FieldBaseProps>
> = (props) => {
  const { setBeforeSubmitCallback, application } = props
  const { getValues, setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const [isCompanyValid, setIsCompanyValid] = useState<boolean>(true)
  const [isCompanyCallValid, setIsCompanyCallValid] = useState<boolean>(true)
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
    if (isCompany(application.answers)) {
      setValue(
        'paymentArrangement.individualOrCompany',
        IndividualOrCompany.company,
      )
    }
  }, [setValue, application.answers])

  setBeforeSubmitCallback?.(async () => {
    setIsCompanyValid(true)
    setIsCompanyCallValid(true)
    const paymentOptions = getValues('paymentArrangement.paymentOptions')
    if (paymentOptions !== PaymentOptions.putIntoAccount) {
      return [true, null]
    }
    const companyNationalId = getValues(
      'paymentArrangement.companyInfo.nationalId',
    )

    if (companyNationalId) {
      try {
        const response = await getIsCompanyValidCallback(companyNationalId)

        if (response?.practicalExamIsCompanyValid.mayPayReceiveInvoice) {
          return [true, null]
        }
      } catch (error) {
        setIsCompanyCallValid(false)
        return [false, '']
      }
    }

    return [false, '']
  })

  return (
    <>
      {!isCompanyValid && (
        <Box marginTop={5}>
          <AlertMessage
            type="warning"
            title=""
            message={formatMessage(
              paymentArrangement.labels.contactOrganizationAlert,
            )}
          />
        </Box>
      )}
      {!isCompanyCallValid && (
        <Box marginTop={5}>
          <AlertMessage
            type="error"
            title=""
            message={formatMessage(paymentArrangement.labels.webServiceFailure)}
          />
        </Box>
      )}
    </>
  )
}
