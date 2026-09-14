import {
  isValidPoliceCaseNumber,
  POLICE_CASE_NUMBER,
  POLICE_CASE_NUMBER_REGEX,
} from './consts'

describe('POLICE_CASE_NUMBER', () => {
  it('should mask three digits, four digits and six digits', () => {
    expect(POLICE_CASE_NUMBER.split('-').map((part) => part.length)).toEqual([
      3, 4, 6,
    ])
  })
})

describe('POLICE_CASE_NUMBER_REGEX', () => {
  it.each([
    '007-2024-042535',
    '007-2024-123456',
    '007-2024-1',
    '000-0000-000000',
  ])('should accept %s', (policeCaseNumber) => {
    expect(POLICE_CASE_NUMBER_REGEX.test(policeCaseNumber)).toBe(true)
  })

  it.each([
    ['a number with a too long last part', '007-2024-1234567'],
    ['a number with an empty last part', '007-2024-'],
    ['a number with a too short prefix', '07-2024-123456'],
    ['a number with a too long prefix', '0007-2024-123456'],
    ['a number with a too short year', '007-224-123456'],
    ['a number with the wrong separator', '007-2023=233'],
    ['a number without separators', '0072024123456'],
    ['a number with letters', '007-2024-12345a'],
    ['a number with whitespace', ' 007-2024-123456 '],
    ['an empty number', ''],
  ])('should reject %s', (_, policeCaseNumber) => {
    expect(POLICE_CASE_NUMBER_REGEX.test(policeCaseNumber)).toBe(false)
  })
})

describe('isValidPoliceCaseNumber', () => {
  it('should be true for a valid number', () => {
    expect(isValidPoliceCaseNumber('007-2024-042535')).toBe(true)
  })

  it.each([
    ['a too long number', '007-2024-1234567'],
    ['an empty number', ''],
    ['an undefined number', undefined],
    ['a null number', null],
  ])('should be false for %s', (_, policeCaseNumber) => {
    expect(isValidPoliceCaseNumber(policeCaseNumber)).toBe(false)
  })
})
