import { formatBankInfo } from './bankInfo'

describe('formatBankInfo', () => {
  it('returns the same value if bank info is already formatted', () => {
    expect(formatBankInfo('0000-11-222222')).toBe('0000-11-222222')
  })

  it('formats a 12-character bank info string', () => {
    expect(formatBankInfo('000011222222')).toBe('0000-11-222222')
  })

  it('returns the same value if bank info is too long', () => {
    expect(formatBankInfo('0000112222222')).toBe('0000112222222')
  })

  it('returns the same value if bank info is in an unexpected format', () => {
    expect(formatBankInfo('000#test011222$$222')).toBe('000#test011222$$222')
  })
})
