import isEmpty from 'lodash/isEmpty'

/** Removes all non-digit characters from a string. */
export const digitsOnly = (value: string): string =>
  (value ?? '').replace(/\D/g, '')

// ——— Formatting ———

/**
 * Formats IBAN with spaces every 4 characters
 * @param value - IBAN string
 * @returns Formatted IBAN (e.g., "AB00 XXXX XXXX XXXX")
 */
export const friendlyFormatIBAN = (value: string | undefined): string => {
  return !isEmpty(value) && value
    ? value
        .toUpperCase()
        .replace(/[\s]+/g, '')
        .replace(/(.{4})(?!$)/g, '$1 ')
    : ''
}

/**
 * Formats SWIFT/BIC with spaces
 * @param value - SWIFT string
 * @returns Formatted SWIFT (e.g., "AAAA BB CC XXX")
 */
export const friendlyFormatSWIFT = (value: string | undefined): string => {
  return !isEmpty(value) && value
    ? value
        .toUpperCase()
        .replace(/[\s]+/g, '')
        .replace(/(.{4})(?!$)/g, '$1 ')
        .replace(/(.{4}[\s].{2})(?!$)/g, '$1 ')
    : ''
}

/**
 * Formats Icelandic bank account as string with dashes
 * @param bankInfo - Object with bankNumber, ledger, accountNumber
 * @returns Formatted string (e.g., "0513-16-123456")
 */
export const formatBankAccount = (bankInfo?: {
  bankNumber?: string
  ledger?: string
  accountNumber?: string
}): string => {
  return !isEmpty(bankInfo)
    ? `${bankInfo.bankNumber ?? ''}-${bankInfo.ledger ?? ''}-${
        bankInfo.accountNumber ?? ''
      }`
    : ''
}

/**
 * Concatenates Icelandic bank account parts into single string
 * @param bankInfo - Object with bank, ledger, accountNumber
 * @returns Concatenated string (e.g., "051316123456")
 */
export const getBankIsk = (bankInfo?: {
  bank?: string
  bankNumber?: string
  ledger?: string
  accountNumber?: string
}): string => {
  if (isEmpty(bankInfo)) return ''

  // 'bankNumber' is used in some components, 'bank' in others
  const bank = 'bankNumber' in bankInfo! ? bankInfo.bankNumber : bankInfo.bank

  return bank && bankInfo.ledger && bankInfo.accountNumber
    ? bank + bankInfo.ledger + bankInfo.accountNumber
    : ''
}

/**
 * Removes non-numeric characters from bank info string
 * @param bankInfo - Bank info string
 * @returns Cleaned string or original if length !== 12
 */
export const formatBankInfo = (bankInfo: string): string => {
  const formattedBankInfo = bankInfo.replace(/[^0-9]/g, '')
  if (formattedBankInfo && formattedBankInfo.length === 12) {
    return formattedBankInfo
  }
  return bankInfo
}

// ——— Validation ———

/**
 * Validates IBAN format
 * @param value - IBAN string (spaces will be removed)
 * @returns true if valid IBAN format
 */
export const validIBAN = (value: string | undefined): boolean => {
  const ibanRegex = new RegExp(
    /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,19}$/,
  )
  return value ? ibanRegex.test(value.replace(/\s/g, '')) : false
}

/**
 * Validates SWIFT/BIC format
 * @param value - SWIFT string (hyphens and spaces will be removed)
 * @returns true if valid SWIFT format
 */
export const validSWIFT = (value: string | undefined): boolean => {
  const swiftRegex = new RegExp(
    /^[A-Z]{4}[-]{0,1}[A-Z]{2}[-]{0,1}[A-Z0-9]{2}[-]{0,1}([A-Z0-9]?){3}$/,
  )
  return value ? swiftRegex.test(value.replace(/[\s-]/g, '')) : false
}
