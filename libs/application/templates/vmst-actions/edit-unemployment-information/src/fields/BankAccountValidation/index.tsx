import { FieldBaseProps } from '@island.is/application/types'
import { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { application as applicationMessages } from '../../lib/messages'
import { BankAccountInAnswers } from '../..'
import {
  GaldurDomainModelsSettingsBanksBankDTO,
  GaldurDomainModelsSettingsLedgersLedgerDTO,
} from '@island.is/clients/vmst-unemployment'
import { MessageDescriptor } from 'react-intl'

export const BankAccountValidation: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, setBeforeSubmitCallback }) => {
  const { getValues } = useFormContext()
  const { formatMessage } = useLocale()
  const [invalidError, setInvalidError] = useState<boolean>()
  const [errors, setErrors] = useState<Array<MessageDescriptor | string>>([])

  const { externalData } = application

  setBeforeSubmitCallback?.(async () => {
    setInvalidError(false)
    setErrors([])
    const bankOptions =
      getValueViaPath<Array<GaldurDomainModelsSettingsBanksBankDTO>>(
        externalData,
        'currentApplicationInformation.data.supportData.banks',
        [],
      ) || []

    const ledgerOptions =
      getValueViaPath<Array<GaldurDomainModelsSettingsLedgersLedgerDTO>>(
        externalData,
        'currentApplicationInformation.data.supportData.ledgers',
        [],
      ) || []

    const accountInformation: BankAccountInAnswers | undefined =
      getValues('bankAccount')
    const bankNumberValidity = /^\d{4}$/.test(
      accountInformation?.bankNumber || '',
    )
    const ledgerValidity = /^\d{2}$/.test(accountInformation?.ledger || '')
    const accountNumberValidity = /^\d{4,6}$/.test(
      accountInformation?.accountNumber || '',
    )

    if (!accountNumberValidity) {
      setErrors((prev) => [
        ...prev,
        applicationMessages.accountNumberValidationError,
      ])
    }

    if (!bankNumberValidity || !ledgerValidity || !accountNumberValidity) {
      setInvalidError(true)
      return [false, '']
    }

    const ledgerSupportData =
      ledgerOptions?.find((val) => val.number === accountInformation?.ledger) ||
      undefined
    const bankNumberSupportData =
      bankOptions?.find(
        (val) => val.bankNo === accountInformation?.bankNumber,
      ) || undefined

    if (!ledgerSupportData) {
      setErrors((prev) => [...prev, applicationMessages.ledgerValidationError])
    }
    if (!bankNumberSupportData) {
      setErrors((prev) => [...prev, applicationMessages.bankValidationError])
    }

    if (!ledgerSupportData || !bankNumberSupportData) {
      return [false, '']
    }

    return [true, null]
  })

  return (
    <Box>
      {invalidError && (
        <AlertMessage
          title={formatMessage(
            applicationMessages.bankAccountValidationErrorTitle,
          )}
          message={formatMessage(
            applicationMessages.bankAccountValidationErrorTitle,
          )}
          type="warning"
        />
      )}
      {errors &&
        errors.length > 0 &&
        errors.map((val, index) => (
          <Box key={index} marginBottom={2}>
            <AlertMessage
              title={formatMessage(
                applicationMessages.bankAccountValidationErrorTitle,
              )}
              message={formatMessage(val)}
              type="warning"
            />
          </Box>
        ))}
    </Box>
  )
}
