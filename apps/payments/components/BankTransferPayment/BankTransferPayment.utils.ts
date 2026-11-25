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

/** The parts in the order they are written and entered. */
export const BANK_ACCOUNT_PART_ORDER = Object.keys(
  BANK_ACCOUNT_PART_LENGTHS,
) as readonly BankAccountPart[]

const BANK_ACCOUNT_NUMBER_LENGTH = Object.values(
  BANK_ACCOUNT_PART_LENGTHS,
).reduce<number>((sum, length) => sum + length, 0)

/** What may sit between the digit groups of a pasted number, e.g. `0133-26-123456` or `0133 26 123456`. */
const PASTE_SEPARATORS_PATTERN = /^[\s\-\u2010-\u2015./]*$/

/** A whole account number fills every part: a group for each, or all 12 digits bare. */
const isWholeBankAccountNumber = (groups: string[]) =>
  groups.length === BANK_ACCOUNT_PART_ORDER.length ||
  (groups.length === 1 && groups[0].length === BANK_ACCOUNT_NUMBER_LENGTH)

/**
 * Splits a pasted account number across the parts, starting at the part it was pasted into. A whole
 * account number starts at the bank whichever input it was pasted into, so the payer can paste it
 * into any of them. Returns `null` when the default paste should apply instead: the text is not an
 * account number, does not fit, or is no more than the one input can hold anyway.
 */
export const parsePastedBankAccount = (
  text: string,
  startPart: BankAccountPart,
): Partial<Record<BankAccountPart, string>> | null => {
  const trimmed = text.trim()
  const groups = trimmed.match(/\d+/g)
  // Letters and the like are not an account number, however many digits they surround.
  if (!groups || !PASTE_SEPARATORS_PATTERN.test(trimmed.replace(/\d+/g, ''))) {
    return null
  }

  const firstPart = isWholeBankAccountNumber(groups) ? 'bank' : startPart
  const parts = BANK_ACCOUNT_PART_ORDER.slice(
    BANK_ACCOUNT_PART_ORDER.indexOf(firstPart),
  )
  const result: Partial<Record<BankAccountPart, string>> = {}

  if (groups.length > 1) {
    if (groups.length > parts.length) return null

    for (const [index, group] of groups.entries()) {
      const part = parts[index]
      if (group.length > BANK_ACCOUNT_PART_LENGTHS[part]) return null
      result[part] = padBankAccountPart(group, part)
    }

    return result
  }

  // Bare digits are split by length. A whole account number is assumed, so a short last part is
  // padded like the others rather than left for more typing.
  const digits = groups[0]
  const capacity = parts.reduce(
    (sum, part) => sum + BANK_ACCOUNT_PART_LENGTHS[part],
    0,
  )
  if (
    digits.length <= BANK_ACCOUNT_PART_LENGTHS[firstPart] ||
    digits.length > capacity
  ) {
    return null
  }

  let offset = 0
  for (const part of parts) {
    if (offset >= digits.length) break
    const length = BANK_ACCOUNT_PART_LENGTHS[part]
    result[part] = padBankAccountPart(
      digits.slice(offset, offset + length),
      part,
    )
    offset += length
  }

  return result
}

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

/**
 * The individual authorising a company's transfer must be a person: it is who authenticates with
 * their bank, so a company or a temporary kennitala cannot be accepted. `isPerson` takes bare digits
 * or the 6-4 masked form the input produces, and nothing else.
 */
export const validateActorNationalId = (
  value: string,
  formatMessage: FormatMessage,
) => isPerson(value) || formatMessage(bankTransfer.actorNationalIdInvalid)
