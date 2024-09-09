import { getIndictmentVerdictAppealDeadlineStatus } from './indictmentCase'

describe('getIndictmentVerdictAppealDeadlineStatus', () => {
  it('should return [true, true] if no dates are provided', () => {
    const result = getIndictmentVerdictAppealDeadlineStatus([])
    expect(result).toEqual([true, true])
  })

  it('should return [false, false] if any dates are undefined', () => {
    const result1 = getIndictmentVerdictAppealDeadlineStatus([
      [true, undefined],
      [true, new Date('2024-06-10T00:00:00Z')],
    ])
    const result2 = getIndictmentVerdictAppealDeadlineStatus([
      [true, new Date('2024-06-10T00:00:00Z')],
      [true, undefined],
    ])
    expect(result1).toEqual([false, false])
    expect(result2).toEqual([false, false])
  })

  it('should return [true, false] if some deadline is not passed', () => {
    const result = getIndictmentVerdictAppealDeadlineStatus([
      [true, new Date('2024-06-01T00:00:00Z')],
      [true, new Date()],
      [true, new Date('2024-06-01T00:00:00Z')],
    ])
    expect(result).toStrictEqual([true, false])
  })

  it('should return [true, true] if all deadlines have passed', () => {
    const result = getIndictmentVerdictAppealDeadlineStatus([
      [true, new Date('2024-06-01T00:00:00Z')],
      [true, new Date('2024-06-01T00:00:00Z')],
      [true, new Date('2024-06-01T00:00:00Z')],
    ])
    expect(result).toStrictEqual([true, true])
  })
})
