import { MileageFeeDifferenceOutcome } from '../models/v3/enums'
import { mapMileageFee } from './mileageFeeMapper'

const fee = {
  permno: 'AB123',
  firstRegistration: { year: 2024, month: 3 },
  periods: [
    {
      year: 2026,
      month: 1,
      provisionalPayment: 4000,
      settlementPayment: 4600,
      difference: 600,
      differenceOutcome: 'Billed' as const,
      description: null,
    },
    {
      year: 2026,
      month: 2,
      provisionalPayment: 4000,
      settlementPayment: 3500,
      difference: -500,
      differenceOutcome: 'Refunded' as const,
      description: null,
    },
    {
      year: 2026,
      month: 3,
      provisionalPayment: 4000,
      settlementPayment: 4050,
      difference: 50,
      differenceOutcome: 'Reversed' as const,
      description: null,
    },
    {
      year: 2026,
      month: 4,
      provisionalPayment: 4000,
      settlementPayment: null,
      difference: null,
      differenceOutcome: null,
      description: null,
    },
  ],
  provisionalPaymentTotal: 16000,
  settlementPaymentTotal: 12150,
  reversalThreshold: 200,
}

describe('mapMileageFee', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-06-15'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('lists years from the first registration year to the current year, newest first', () => {
    const result = mapMileageFee(fee, 2026, 'https://dl.test')
    expect(result.years).toEqual([2026, 2025, 2024])
  })

  it('starts the years at 2024 for a vehicle first registered before 2024', () => {
    const result = mapMileageFee(
      { ...fee, firstRegistration: { year: 2015, month: 6 } },
      2026,
      'https://dl.test',
    )
    expect(result.years).toEqual([2026, 2025, 2024])
  })

  it('maps one period per month and leaves the unsettled last period without confirmed values', () => {
    const result = mapMileageFee(fee, 2026, 'https://dl.test')
    expect(result.periods).toHaveLength(4)
    const last = result.periods[result.periods.length - 1]
    expect(last.confirmedFee).toBeUndefined()
    expect(last.difference).toBeUndefined()
    expect(last.differenceOutcome).toBeUndefined()
  })

  it('maps difference outcomes to the GraphQL enum', () => {
    const result = mapMileageFee(fee, 2026, 'https://dl.test')
    expect(result.periods.slice(0, 3).map((p) => p.differenceOutcome)).toEqual([
      MileageFeeDifferenceOutcome.BILLED,
      MileageFeeDifferenceOutcome.REFUNDED,
      MileageFeeDifferenceOutcome.REVERSED,
    ])
  })

  it('passes through the totals from the client fee', () => {
    const result = mapMileageFee(fee, 2026, 'https://dl.test')
    expect(result.estimatedFeeTotal).toBe(16000)
    expect(result.confirmedFeeTotal).toBe(12150)
  })

  it('builds the download service excel url', () => {
    const result = mapMileageFee(fee, 2026, 'https://dl.test')
    expect(result.downloadServiceUrl).toBe(
      'https://dl.test/download/v1/vehicles/mileage-fee/AB123/2026/excel',
    )
  })
})
