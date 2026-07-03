import { validateBankAccountNumber } from './BankTransferPayment.utils'

// The util only calls formatMessage on the invalid branch; return a marker so we can assert failures.
const formatMessage = ((descriptor: { id: string }) =>
  descriptor.id) as unknown as Parameters<typeof validateBankAccountNumber>[1]

describe('validateBankAccountNumber', () => {
  it('accepts exactly 12 digits', () => {
    expect(validateBankAccountNumber('123456789012', formatMessage)).toBe(true)
  })

  it('rejects fewer than 12 digits', () => {
    expect(validateBankAccountNumber('12345', formatMessage)).toBe(
      'payments:bankTransfer.accountNumberInvalid',
    )
  })

  it('rejects more than 12 digits', () => {
    expect(validateBankAccountNumber('1234567890123', formatMessage)).toBe(
      'payments:bankTransfer.accountNumberInvalid',
    )
  })

  it('rejects non-digit characters', () => {
    expect(validateBankAccountNumber('1234-56-7890', formatMessage)).toBe(
      'payments:bankTransfer.accountNumberInvalid',
    )
  })
})
