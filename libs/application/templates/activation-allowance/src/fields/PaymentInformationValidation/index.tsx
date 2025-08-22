import { FieldBaseProps } from '@island.is/application/types'
import { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { PaymentInformationAnswer } from '../../lib/dataSchema'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import { GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsActivationGrantSupportData } from '@island.is/clients/vmst-unemployment'
import { useLocale } from '@island.is/localization'
import { paymentErrors } from '../../lib/messages/paymentErrors'
import { MessageDescriptor } from 'react-intl'

export const PaymentInformationValidation: FC<
  React.PropsWithChildren<FieldBaseProps>
> = (props) => {
  const { setBeforeSubmitCallback } = props
  const { getValues } = useFormContext()
  const [errors, setErrors] = useState<Array<MessageDescriptor>>([])
  const [invalidError, setInvalidError] = useState<boolean>()
  const { formatMessage } = useLocale()

  setBeforeSubmitCallback?.(async () => {
    setInvalidError(false)
    setErrors([])

    const paymentInfo: PaymentInformationAnswer =
      getValues('paymentInformation')
    const supportInfo =
      getValueViaPath<GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsActivationGrantSupportData>(
        props.application.externalData,
        'activityGrantApplication.data.activationGrant.supportData',
      )
    const bankNumberValidity = /^\d{4}$/.test(paymentInfo?.bankNumber || '')
    const ledger = /^\d{2}$/.test(paymentInfo?.ledger || '')
    const accountNumber = /^\d{4,6}$/.test(paymentInfo?.accountNumber || '')

    // Set the errors
    if (!bankNumberValidity || !ledger || !accountNumber) {
      setInvalidError(true)
      return [false, '']
    }

    const ledgerSupportData =
      supportInfo?.ledgers?.find((val) => val.number === paymentInfo.ledger) ||
      undefined
    const bankNumberSupportData =
      supportInfo?.banks?.find(
        (val) => val.bankNo === paymentInfo.bankNumber,
      ) || undefined

    if (ledgerSupportData && bankNumberSupportData) {
      return [true, null]
    }

    if (!ledgerSupportData) {
      setErrors((prev) => [...prev, paymentErrors.invalidLedger])
    }
    if (!bankNumberSupportData) {
      setErrors((prev) => [...prev, paymentErrors.invalidBankNumber])
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
