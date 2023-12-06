import { getMonthNumber } from './social-insurance-administration-utils'

describe('Old age pesion utils', () => {
  it('should return 3 for March', () => {
    expect(getMonthNumber('March')).toBe(3)
  })
})
