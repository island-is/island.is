import { useLocale } from '@island.is/localization'
import { bankTransfer } from '../../messages'

type FormatMessage = ReturnType<typeof useLocale>['formatMessage']

export const validateBankAccountNumber = (
  value: string,
  formatMessage: FormatMessage,
) => {
  if (!/^\d{12}$/.test(value)) {
    return formatMessage(bankTransfer.accountNumberInvalid)
  }
  return true
}
