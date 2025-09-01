import { Defendant } from '../modules/repository'
import { formatDefendant } from './caseFilesRecordPdf'

describe('FormatDefendant', () => {
  test('with national id', () => {
    const result = formatDefendant({
      name: 'John Doe',
      address: '123 Main Street',
      nationalId: '1234567890',
    } as Defendant)

    expect(result).toBe('John Doe, kt. 123456-7890, 123 Main Street')
  })

  test('with date of birth', () => {
    const result = formatDefendant({
      name: 'John Doe',
      address: '123 Main Street',
      noNationalId: true,
      nationalId: '01.10.1999',
    } as Defendant)

    expect(result).toBe('John Doe, fd. 01.10.1999, 123 Main Street')
  })

  test('without nationa id and date of birth', () => {
    const result = formatDefendant({
      name: 'John Doe',
      address: '123 Main Street',
      noNationalId: true,
    } as Defendant)

    expect(result).toBe('John Doe, 123 Main Street')
  })
})
