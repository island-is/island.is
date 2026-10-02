import { isPerson } from 'kennitala'

import { useLocale } from '@island.is/localization'
import { bankTransfer } from '../../messages'

type FormatMessage = ReturnType<typeof useLocale>['formatMessage']

/**
 * A BBAN is `bbbb-hh-nnnnnn`: the bank (the institution in the first two digits plus its branch in
 * the last two — indó is `2200`), the ledger (höfuðbók) and the account number. Each is entered in
 * its own input, and a shorter value is short for one with leading zeros.
 */
export const BANK_ACCOUNT_PART_LENGTHS = {
  bank: 4,
  ledger: 2,
  account: 6,
} as const

export type BankAccountPart = keyof typeof BANK_ACCOUNT_PART_LENGTHS

const BANK_CODE_LENGTH = 2

/**
 * Institutions the payment provider cannot process, as the leading two digits of a BBAN. Caught here
 * so the payer is told their bank is unsupported, rather than submitting and getting a generic
 * provider failure back. `22` is indó.
 */
export const UNSUPPORTED_BANK_CODES: readonly string[] = ['11', '22']

/** Pads a part with leading zeros to its full length, so `123` → `0123`. An empty part stays empty. */
export const padBankAccountPart = (value: string, part: BankAccountPart) =>
  value ? value.padStart(BANK_ACCOUNT_PART_LENGTHS[part], '0') : value

/** The 12-digit BBAN the service expects, e.g. `123`, `2`, `1234` → `012302001234`. */
export const toBankAccountNumber = (parts: Record<BankAccountPart, string>) =>
  padBankAccountPart(parts.bank, 'bank') +
  padBankAccountPart(parts.ledger, 'ledger') +
  padBankAccountPart(parts.account, 'account')

/**
 * A bank the provider cannot reach gets a distinct message, since there is nothing wrong with the
 * number itself and telling the payer to check their typing would send them in circles.
 */
export const validateBank = (value: string, formatMessage: FormatMessage) => {
  const institution = padBankAccountPart(value, 'bank').slice(
    0,
    BANK_CODE_LENGTH,
  )

  if (UNSUPPORTED_BANK_CODES.includes(institution)) {
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
