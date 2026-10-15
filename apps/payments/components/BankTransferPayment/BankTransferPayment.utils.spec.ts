import {
  UNSUPPORTED_BANK_CODES,
  padBankAccountPart,
  parsePastedBankAccount,
  toBankAccountNumber,
  validateActorNationalId,
  validateBank,
} from './BankTransferPayment.utils'

// The utils only call formatMessage on the invalid branch; return a marker so we can assert failures.
const formatMessage = ((descriptor: { id: string }) =>
  descriptor.id) as unknown as Parameters<typeof validateBank>[1]

describe('padBankAccountPart', () => {
  it.each([
    ['bank', '123', '0123'],
    ['bank', '1', '0001'],
    ['bank', '0515', '0515'],
    ['ledger', '2', '02'],
    ['ledger', '26', '26'],
    ['account', '1234', '001234'],
    ['account', '123456', '123456'],
  ] as const)('pads the %s part %s to %s', (part, value, expected) => {
    expect(padBankAccountPart(value, part)).toBe(expected)
  })

  it('leaves an empty part empty, so a required check still catches it', () => {
    expect(padBankAccountPart('', 'bank')).toBe('')
  })
})

describe('toBankAccountNumber', () => {
  it('pads each part to 4-2-6 and joins them into the 12-digit account number', () => {
    expect(
      toBankAccountNumber({ bank: '123', ledger: '2', account: '1234' }),
    ).toBe('012302001234')
  })

  it('keeps parts that are already full length', () => {
    expect(
      toBankAccountNumber({ bank: '0515', ledger: '26', account: '123456' }),
    ).toBe('051526123456')
  })
})

describe('parsePastedBankAccount', () => {
  it.each([
    [
      'a 12-digit number into bank',
      '013326123456',
      'bank',
      { bank: '0133', ledger: '26', account: '123456' },
    ],
    [
      'separated groups into bank',
      '0133-26-123456',
      'bank',
      { bank: '0133', ledger: '26', account: '123456' },
    ],
    [
      'short groups, padded',
      '133-26-1234',
      'bank',
      { bank: '0133', ledger: '26', account: '001234' },
    ],
    [
      'groups separated by spaces',
      '0133 26 123456',
      'bank',
      { bank: '0133', ledger: '26', account: '123456' },
    ],
    [
      'separated groups into ledger',
      '26-123456',
      'ledger',
      { ledger: '26', account: '123456' },
    ],
    [
      'bare digits into ledger',
      '26123456',
      'ledger',
      { ledger: '26', account: '123456' },
    ],
    [
      'surrounding whitespace',
      ' 013326123456\n',
      'bank',
      { bank: '0133', ledger: '26', account: '123456' },
    ],
    [
      'digits that stop partway through a part, padded',
      '01332612',
      'bank',
      { bank: '0133', ledger: '26', account: '000012' },
    ],
    [
      'a whole separated number into ledger, from the bank',
      '0133-26-123456',
      'ledger',
      { bank: '0133', ledger: '26', account: '123456' },
    ],
    [
      'a whole separated number into account, from the bank',
      '133-26-1234',
      'account',
      { bank: '0133', ledger: '26', account: '001234' },
    ],
    [
      'a whole 12-digit number into ledger, from the bank',
      '013326123456',
      'ledger',
      { bank: '0133', ledger: '26', account: '123456' },
    ],
    [
      'a whole 12-digit number into account, from the bank',
      '013326123456',
      'account',
      { bank: '0133', ledger: '26', account: '123456' },
    ],
  ] as const)('splits %s', (_, text, startPart, expected) => {
    expect(parsePastedBankAccount(text, startPart)).toEqual(expected)
  })

  it.each([
    ['a paste that fits the one input', '0133', 'bank'],
    ['a shorter paste', '13', 'bank'],
    ['too many digits', '0133261234567', 'bank'],
    ['too many digits for the remaining parts', '261234567', 'ledger'],
    ['more groups than remaining parts', '26-123456', 'account'],
    ['more groups than there are parts', '0133-26-123456-1', 'bank'],
    ['a group too long for its part', '01335-26-123456', 'bank'],
    ['letters', '0133-ab-123456', 'bank'],
    ['letters only', 'abc', 'bank'],
    ['an empty value', '', 'bank'],
    ['whitespace only', '  ', 'bank'],
  ] as const)('leaves %s to the default paste', (_, text, startPart) => {
    expect(parsePastedBankAccount(text, startPart)).toBeNull()
  })
})

describe('validateBank', () => {
  const NOT_SUPPORTED = 'payments:bankTransfer.accountNumberBankNotSupported'

  // A real indó bank number — the bank the check exists for. Kept as a literal rather than derived
  // from the constant, so a wrong constant can't make the test pass vacuously.
  it('rejects indó (2200)', () => {
    expect(validateBank('2200', formatMessage)).toBe(NOT_SUPPORTED)
  })

  it('rejects every branch of every unsupported institution', () => {
    // The institution is the leading two digits and the next two are its branch, so every branch
    // has to be caught — not just `xx00`.
    for (const code of UNSUPPORTED_BANK_CODES) {
      for (const branch of ['00', '01', '99']) {
        expect(validateBank(`${code}${branch}`, formatMessage)).toBe(
          NOT_SUPPORTED,
        )
      }
    }
  })

  it('checks the padded bank number, so a short value is read with leading zeros', () => {
    // `22` is bank 0022, not indó.
    expect(validateBank('22', formatMessage)).toBe(true)
    expect(validateBank('11', formatMessage)).toBe(true)
    expect(validateBank('515', formatMessage)).toBe(true)
  })

  it('accepts supported banks', () => {
    expect(validateBank('0111', formatMessage)).toBe(true)
    expect(validateBank('0133', formatMessage)).toBe(true)
  })
})

describe('validateActorNationalId', () => {
  const invalid = 'payments:bankTransfer.actorNationalIdInvalid'

  it('accepts a person as bare digits', () => {
    expect(validateActorNationalId('0101302129', formatMessage)).toBe(true)
  })

  it('accepts a person in the masked input value', () => {
    expect(validateActorNationalId('010130-2129', formatMessage)).toBe(true)
  })

  it.each([
    ['a company', '6010100890'],
    ['a temporary kennitala', '8123456789'],
    ['an impossible birth date', '3201302129'],
    ['too few digits', '010130212'],
    ['too many digits', '01013021290'],
    ['a misplaced separator', '0101-302129'],
    ['letters', '010130212a'],
    ['an empty value', ''],
  ])('rejects %s', (_, value) => {
    expect(validateActorNationalId(value, formatMessage)).toBe(invalid)
  })
})
