import { FieldBaseProps } from '@island.is/application/types'
import { FC, useCallback, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { PayoutInAnswers } from '../../shared'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import { GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsUnemployementApplicationSupportData } from '@island.is/clients/vmst-unemployment'
import { useLocale } from '@island.is/localization'
import { paymentErrors } from '../../lib/messages'
import { MessageDescriptor } from 'react-intl'
import { useLazyIsBankInfoValid } from '../../hooks/useLazyIsBankInfoValid'

export const PaymentInformationValidation: FC<
  React.PropsWithChildren<FieldBaseProps>
> = (props) => {
  const { setBeforeSubmitCallback } = props
  const { getValues } = useFormContext()
  const [errors, setErrors] = useState<Array<MessageDescriptor | string>>([])
  const [invalidError, setInvalidError] = useState<boolean>()
  const { formatMessage, locale } = useLocale()
  const [getIsValidBankInformation] = useLazyIsBankInfoValid()

  const getIsCompanyValidCallback = useCallback(
    async (input: {
      bankNumber: string
      ledger: string
      accountNumber: string
      pensionFund?: { id: string; percentage: number }
      doNotPayToUnion: boolean
      union?: { id: string }
      privatePensionFunds?: Array<{ id: string; percentage: number }>
    }) => {
      const { data } = await getIsValidBankInformation({
        variables: { input },
      })
      return data
    },
    [getIsValidBankInformation],
  )

  setBeforeSubmitCallback?.(async () => {
    setInvalidError(false)
    setErrors([])

    const paymentInfo: PayoutInAnswers | undefined = getValues('payout')
    const supportInfo =
      getValueViaPath<GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsUnemployementApplicationSupportData>(
        props.application.externalData,
        'unemploymentApplication.data.supportData',
      )
    const bankNumberValidity = /^\d{4}$/.test(
      paymentInfo?.bankAccount.bankNumber || '',
    )
    const ledger = /^\d{2}$/.test(paymentInfo?.bankAccount.ledger || '')
    const accountNumber = /^\d{4,6}$/.test(
      paymentInfo?.bankAccount.accountNumber || '',
    )

    // Set the errors
    if (!bankNumberValidity || !ledger || !accountNumber) {
      setInvalidError(true)
      return [false, '']
    }

    const ledgerSupportData =
      supportInfo?.ledgers?.find(
        (val) => val.number === paymentInfo?.bankAccount.ledger,
      ) || undefined
    const bankNumberSupportData =
      supportInfo?.banks?.find(
        (val) => val.bankNo === paymentInfo?.bankAccount.bankNumber,
      ) || undefined

    if (!ledgerSupportData) {
      setErrors((prev) => [...prev, paymentErrors.invalidLedger])
    }
    if (!bankNumberSupportData) {
      setErrors((prev) => [...prev, paymentErrors.invalidBankNumber])
    }

    if (!ledgerSupportData || !bankNumberSupportData) {
      return [false, '']
    }

    try {
      const response = await getIsCompanyValidCallback({
        bankNumber: bankNumberSupportData.id || '',
        ledger: ledgerSupportData.id || '',
        accountNumber:
          paymentInfo?.bankAccount.accountNumber?.padStart(6, '0') || '',
        pensionFund: { id: paymentInfo?.pensionFund || '', percentage: 0 },
        privatePensionFunds: paymentInfo?.privatePensionFund
          ? [
              {
                id: paymentInfo.privatePensionFund,
                percentage:
                  Number(paymentInfo?.privatePensionFundPercentage) || 0,
              },
            ]
          : [],
        doNotPayToUnion: !paymentInfo?.union,
        union: paymentInfo?.union ? { id: paymentInfo.union || '' } : undefined,
      })

      if (
        response?.vmstApplicationsAccountNumberValidationUnemploymentApplication
          .isValid
      )
        return [true, null]

      const userMessageIS =
        response?.vmstApplicationsAccountNumberValidationUnemploymentApplication
          .userMessageIS || ''

      const userMessageEn =
        response?.vmstApplicationsAccountNumberValidationUnemploymentApplication
          .userMessageEN || ''

      const userMessageBasedOnLocale =
        locale === 'en' ? userMessageEn : userMessageIS
      setErrors((prev) => [...prev, userMessageBasedOnLocale])
    } catch (e) {
      setErrors((prev) => [...prev, paymentErrors.invalidAccountNumber])
    }

    return [false, '']
  })

  return (
    <Box>
      {invalidError && (
        <AlertMessage
          title={formatMessage(paymentErrors.invalidValue)}
          message={formatMessage(paymentErrors.paymentInfoValueErrorsMessage)}
          type="warning"
        />
      )}
      {errors &&
        errors.length > 0 &&
        errors.map((val, index) => (
          <Box key={index} marginBottom={2}>
            <AlertMessage
              title={formatMessage(paymentErrors.invalidValue)}
              message={formatMessage(val)}
              type="warning"
            />
          </Box>
        ))}
    </Box>
  )
}
