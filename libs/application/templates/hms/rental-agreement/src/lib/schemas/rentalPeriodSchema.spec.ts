import { rentalPeriodSchema } from './rentalPeriodSchema'

const startDateTooFarIssue = (year: number, month: number, day: number) => {
  const startDate = new Date(year, month, day).toISOString()
  const result = rentalPeriodSchema.safeParse({ startDate })
  return result.success
    ? undefined
    : result.error.issues.find(
        (issue) =>
          issue.path.join('.') === 'startDate' &&
          issue.code === 'custom' &&
          issue.params?.id ===
            'ra.application:dataSchema.errorStartDateMoreThanOneMonthInFuture',
      )
}

describe('rentalPeriodSchema startDate', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2026, 9, 6, 13, 0))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('accepts a start date exactly one month ahead', () => {
    expect(startDateTooFarIssue(2026, 10, 6)).toBeUndefined()
  })

  it('rejects a start date more than one month ahead', () => {
    expect(startDateTooFarIssue(2026, 10, 7)).toBeDefined()
    expect(startDateTooFarIssue(2027, 0, 1)).toBeDefined()
  })

  it('accepts past start dates', () => {
    expect(startDateTooFarIssue(2025, 0, 1)).toBeUndefined()
  })
})
