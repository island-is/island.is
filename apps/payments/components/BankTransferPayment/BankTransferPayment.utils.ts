import { isPerson } from 'kennitala'

import { useLocale } from '@island.is/localization'
import { bankTransfer } from '../../messages'

type FormatMessage = ReturnType<typeof useLocale>['formatMessage']

/**
 * A BBAN is `bbbb-hh-nnnnnn`, where the leading four digits are the institution (first two) plus its
 * branch (last two) — indó is `2200`.
 */
const BANK_CODE_LENGTH = 2

/**
 * Institutions the payment provider cannot process, as the leading two digits of a BBAN. Caught here
 * so the payer is told their bank is unsupported, rather than submitting and getting a generic
 * provider failure back. `22` is indó.
 */
export const UNSUPPORTED_BANK_CODES: readonly string[] = ['11', '22']

/** Bare digits, or the 4-2-6 masked form the input produces. Nothing in between. */
const BBAN_PATTERN = /^\d{12}$/
const MASKED_BBAN_PATTERN = /^\d{4}-\d{2}-\d{6}$/

export const validateBankAccountNumber = (
  value: string,
  formatMessage: FormatMessage,
) => {
  // Only the two canonical shapes are a number: repeated, misplaced or trailing separators are
  // malformed, even though the input mask makes them hard to type.
  if (!BBAN_PATTERN.test(value) && !MASKED_BBAN_PATTERN.test(value)) {
    return formatMessage(bankTransfer.accountNumberInvalid)
  }

  const digits = value.replace(/-/g, '')

  // Well-formed but at a bank the provider cannot reach — a distinct message, since there is nothing
  // wrong with the number itself and telling the payer to check their typing would send them in
  // circles.
  if (UNSUPPORTED_BANK_CODES.includes(digits.slice(0, BANK_CODE_LENGTH))) {
    return formatMessage(bankTransfer.accountNumberBankNotSupported)
  }

  return true
}

/** Bare digits, or the 6-4 masked form the input produces. */
const NATIONAL_ID_PATTERN = /^\d{10}$/
const MASKED_NATIONAL_ID_PATTERN = /^\d{6}-\d{4}$/

/**
 * The individual authorising a company's transfer must be a person: it is who authenticates with
 * their bank, so a company or a temporary kennitala cannot be accepted.
 */
export const validateActorNationalId = (
  value: string,
  formatMessage: FormatMessage,
) => {
  if (
    !NATIONAL_ID_PATTERN.test(value) &&
    !MASKED_NATIONAL_ID_PATTERN.test(value)
  ) {
    return formatMessage(bankTransfer.actorNationalIdInvalid)
  }

  if (!isPerson(value.replace(/-/g, ''))) {
    return formatMessage(bankTransfer.actorNationalIdInvalid)
  }

  return true
}
