import { useLocale } from '@island.is/localization'
import { bankTransfer } from '../../messages'

type FormatMessage = ReturnType<typeof useLocale>['formatMessage']

export const validateBankAccountNumber = (
  value: string,
  formatMessage: FormatMessage,
) => {
  // The form stores the masked value (0000-00-000000); validate the digits.
  if (!/^\d{12}$/.test(value.replace(/\D/g, ''))) {
    return formatMessage(bankTransfer.accountNumberInvalid)
  }
  return true
}
