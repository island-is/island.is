import { useLocale } from '@island.is/localization'
import { bankTransfer } from '../../messages'

type FormatMessage = ReturnType<typeof useLocale>['formatMessage']

/**
 * A BBAN is `bbbb-hh-nnnnnn`, where the leading four digits are the institution (first two) plus its
 * branch (last two) — indó is `2200`, Landsbankinn's branches are `01xx`. So the institution is the
 * leading *two* digits, and matching on all four would only catch a single branch of a bank.
 */
const BANK_CODE_LENGTH = 2

/**
 * Institutions the payment provider cannot process, as the leading two digits of a BBAN. Caught here
 * so the payer is told their bank is unsupported, rather than submitting and getting a generic
 * provider failure back. `22` is indó.
 */
export const UNSUPPORTED_BANK_CODES: readonly string[] = ['11', '22']

export const validateBankAccountNumber = (
  value: string,
  formatMessage: FormatMessage,
) => {
  // The form stores the masked value (0000-00-000000); accept only digits
  // and the mask separators, then require exactly 12 digits.
  const digits = value.replace(/-/g, '')
  if (!/^[\d-]+$/.test(value) || !/^\d{12}$/.test(digits)) {
    return formatMessage(bankTransfer.accountNumberInvalid)
  }

  // Well-formed but at a bank the provider cannot reach — a distinct message, since there is nothing
  // wrong with the number itself and telling the payer to check their typing would send them in
  // circles.
  if (UNSUPPORTED_BANK_CODES.includes(digits.slice(0, BANK_CODE_LENGTH))) {
    return formatMessage(bankTransfer.accountNumberBankNotSupported)
  }

  return true
}
