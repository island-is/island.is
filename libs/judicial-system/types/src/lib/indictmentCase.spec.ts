import { getIndictmentVerdictAppealDeadlineStatus } from './indictmentCase'

describe('getIndictmentVerdictAppealDeadlineStatus', () => {
  it('should return [true, true] if no dates are provided', () => {
    const result = getIndictmentVerdictAppealDeadlineStatus([])
    expect(result).toEqual({
      isVerdictViewedByAllRequiredDefendants: true,
      hasVerdictAppealDeadlineExpiredForAll: true,
    })
  })

  it('should return [false, false] if any dates are undefined', () => {
    const result1 = getIndictmentVerdictAppealDeadlineStatus([
      { canAppealVerdict: true, serviceDate: undefined },
      { canAppealVerdict: true, serviceDate: new Date('2024-06-10T00:00:00Z') },
    ])
    const result2 = getIndictmentVerdictAppealDeadlineStatus([
      { canAppealVerdict: true, serviceDate: new Date('2024-06-10T00:00:00Z') },
      { canAppealVerdict: true, serviceDate: undefined },
    ])
    expect(result1).toEqual({
      isVerdictViewedByAllRequiredDefendants: false,
      hasVerdictAppealDeadlineExpiredForAll: false,
    })
    expect(result2).toEqual({
      isVerdictViewedByAllRequiredDefendants: false,
      hasVerdictAppealDeadlineExpiredForAll: false,
    })
  })

  it('should return [true, false] if some deadline is not passed', () => {
    const result = getIndictmentVerdictAppealDeadlineStatus([
      { canAppealVerdict: true, serviceDate: new Date('2024-06-01T00:00:00Z') },
      { canAppealVerdict: true, serviceDate: new Date() },
      { canAppealVerdict: true, serviceDate: new Date('2024-06-01T00:00:00Z') },
    ])
    expect(result).toStrictEqual({
      isVerdictViewedByAllRequiredDefendants: true,
      hasVerdictAppealDeadlineExpiredForAll: false,
    })
  })

  it('should return [true, true] if all deadlines have passed', () => {
    const result = getIndictmentVerdictAppealDeadlineStatus([
      { canAppealVerdict: true, serviceDate: new Date('2024-06-01T00:00:00Z') },
      { canAppealVerdict: true, serviceDate: new Date('2024-06-01T00:00:00Z') },
      { canAppealVerdict: true, serviceDate: new Date('2024-06-01T00:00:00Z') },
    ])
    expect(result).toStrictEqual({
      isVerdictViewedByAllRequiredDefendants: true,
      hasVerdictAppealDeadlineExpiredForAll: true,
    })
  })
})
