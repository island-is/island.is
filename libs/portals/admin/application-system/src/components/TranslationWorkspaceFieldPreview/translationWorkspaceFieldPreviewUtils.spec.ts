import { parseBankAccountPreviewValue } from './translationWorkspaceFieldPreviewUtils'

describe('parseBankAccountPreviewValue', () => {
  it('parses hyphenated Icelandic bank account strings', () => {
    expect(parseBankAccountPreviewValue('0515-26-002365')).toEqual({
      bankNumber: '0515',
      ledger: '26',
      accountNumber: '002365',
    })
  })

  it('parses 12-digit strings', () => {
    expect(parseBankAccountPreviewValue('051526002365')).toEqual({
      bankNumber: '0515',
      ledger: '26',
      accountNumber: '002365',
    })
  })

  it('returns empty parts when the value is missing', () => {
    expect(parseBankAccountPreviewValue()).toEqual({
      bankNumber: '',
      ledger: '',
      accountNumber: '',
    })
    expect(parseBankAccountPreviewValue('')).toEqual({
      bankNumber: '',
      ledger: '',
      accountNumber: '',
    })
  })
})
