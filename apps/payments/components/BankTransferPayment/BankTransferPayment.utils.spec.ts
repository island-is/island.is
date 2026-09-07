import {
  UNSUPPORTED_BANK_CODES,
  validateBankAccountNumber,
} from './BankTransferPayment.utils'

// The util only calls formatMessage on the invalid branch; return a marker so we can assert failures.
const formatMessage = ((descriptor: { id: string }) =>
  descriptor.id) as unknown as Parameters<typeof validateBankAccountNumber>[1]

describe('validateBankAccountNumber', () => {
  it('accepts exactly 12 digits', () => {
    expect(validateBankAccountNumber('123456789012', formatMessage)).toBe(true)
  })

  it('accepts the masked input value', () => {
    expect(validateBankAccountNumber('1234-56-789012', formatMessage)).toBe(
      true,
    )
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

  it('rejects letters among the digits', () => {
    expect(validateBankAccountNumber('1234-56-78901a', formatMessage)).toBe(
      'payments:bankTransfer.accountNumberInvalid',
    )
  })

  it('rejects 12 digits with an extra letter', () => {
    expect(validateBankAccountNumber('1234-56-789012a', formatMessage)).toBe(
      'payments:bankTransfer.accountNumberInvalid',
    )
  })

  // 12 digits is not enough on its own — the separators have to sit where the mask puts them, so
  // the util is correct independently of whatever produced the value.
  it.each([
    ['separators between every digit', '1-2-3-4-5-6-7-8-9-0-1-2'],
    ['a trailing separator', '123456789012-'],
    ['a leading separator', '-123456789012'],
    ['a doubled separator', '1234--56-789012'],
    ['separators in the wrong places', '1234-567-89012'],
    ['only the first separator', '1234-56789012'],
  ])('rejects %s', (_case, value) => {
    expect(validateBankAccountNumber(value, formatMessage)).toBe(
      'payments:bankTransfer.accountNumberInvalid',
    )
  })

  describe('unsupported banks', () => {
    const NOT_SUPPORTED = 'payments:bankTransfer.accountNumberBankNotSupported'

    // A real indó account prefix — the bank the check exists for. Kept as a literal rather than
    // derived from the constant, so a wrong constant can't make the test pass vacuously.
    it('rejects an indó account number (2200)', () => {
      expect(validateBankAccountNumber('2200-26-110615', formatMessage)).toBe(
        NOT_SUPPORTED,
      )
    })

    it('rejects every branch of every unsupported institution, masked or not', () => {
      // The institution is the leading two digits and the next two are its branch, so every branch
      // has to be caught — not just `xx00`.
      for (const code of UNSUPPORTED_BANK_CODES) {
        for (const branch of ['00', '01', '99']) {
          expect(
            validateBankAccountNumber(
              `${code}${branch}26110615`,
              formatMessage,
            ),
          ).toBe(NOT_SUPPORTED)
          expect(
            validateBankAccountNumber(
              `${code}${branch}-26-110615`,
              formatMessage,
            ),
          ).toBe(NOT_SUPPORTED)
        }
      }
    })

    it('reports a malformed number as malformed even at an unsupported bank', () => {
      // Format is checked first, so the payer fixes the number before being told about the bank.
      for (const code of UNSUPPORTED_BANK_CODES) {
        expect(validateBankAccountNumber(`${code}002611`, formatMessage)).toBe(
          'payments:bankTransfer.accountNumberInvalid',
        )
      }
    })

    it('only inspects the institution digits', () => {
      // False-positive guard: a supported institution whose branch, ledger or account segments
      // contain the blocked digits must pass.
      expect(validateBankAccountNumber('0111-22-110022', formatMessage)).toBe(
        true,
      )
      expect(validateBankAccountNumber('0133-00-110022', formatMessage)).toBe(
        true,
      )
    })
  })
})
