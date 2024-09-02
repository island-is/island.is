import { getIndictmentVerdictAppealDeadline } from './indictmentCase'

describe('getIndictmentVerdictAppealDeadline', () => {
  it('should return undefined if no dates are provided', () => {
    const result = getIndictmentVerdictAppealDeadline([])
    expect(result).toBeUndefined()
  })

  it('should return undefined if any dates are undefined', () => {
    const result1 = getIndictmentVerdictAppealDeadline([
      undefined,
      new Date('2024-06-10T00:00:00Z'),
    ])
    const result2 = getIndictmentVerdictAppealDeadline([
      new Date('2024-06-10T00:00:00Z'),
      undefined,
    ])
    expect(result1).toBeUndefined()
    expect(result2).toBeUndefined()
  })

  it('should return the correct deadline', () => {
    const dates = [
      new Date('2024-06-01T00:00:00Z'),
      new Date('2024-06-01T00:00:00Z'),
      new Date('2024-06-01T00:00:00Z'),
    ]
    const result = getIndictmentVerdictAppealDeadline(dates)
    const expectedDeadline = new Date('2024-06-29T00:00:00Z')

    expect(result).toStrictEqual(expectedDeadline)
  })

  it('should handle a single valid date', () => {
    const dates = [new Date('2024-07-15T00:00:00Z')]
    const result = getIndictmentVerdictAppealDeadline(dates)
    const expectedDeadline = new Date('2024-08-12T00:00:00Z')

    expect(result).toStrictEqual(expectedDeadline)
  })
})
