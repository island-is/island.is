import { getMockKilometerFee } from '../mocks/mileageFee.mock'
import { MileageFeeDifferenceOutcome } from '../models/v3/mileageFee.model'
import { mapMileageFee } from './mileageFeeMapper'

describe('mapMileageFee', () => {
  let fee: ReturnType<typeof getMockKilometerFee>

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-06-15'))
    fee = getMockKilometerFee('AB123', 2026)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('lists years from the first registration year to the current year, newest first', () => {
    const result = mapMileageFee(fee, 2026, 'https://dl.test')
    expect(result.years).toEqual([2026, 2025, 2024])
  })

  it('maps one period per month and leaves the unsettled last period without confirmed values', () => {
    const result = mapMileageFee(fee, 2026, 'https://dl.test')
    expect(result.periods).toHaveLength(6)
    const last = result.periods[result.periods.length - 1]
    expect(last.confirmedFee).toBeUndefined()
    expect(last.difference).toBeUndefined()
    expect(last.differenceOutcome).toBeUndefined()
  })

  it('maps difference outcomes to the GraphQL enum', () => {
    const result = mapMileageFee(fee, 2026, 'https://dl.test')
    expect(result.periods.slice(0, 3).map((p) => p.differenceOutcome)).toEqual([
      MileageFeeDifferenceOutcome.ADDED_TO_NEXT_INVOICE,
      MileageFeeDifferenceOutcome.REFUNDED,
      MileageFeeDifferenceOutcome.REVERSED,
    ])
  })

  it('passes through the totals from the client fee', () => {
    const result = mapMileageFee(fee, 2026, 'https://dl.test')
    expect(result.estimatedFeeTotal).toBe(fee.provisionalPaymentTotal)
    expect(result.confirmedFeeTotal).toBe(fee.settlementPaymentTotal)
  })

  it('builds the download service excel url', () => {
    const result = mapMileageFee(fee, 2026, 'https://dl.test')
    expect(result.downloadServiceUrl).toBe(
      'https://dl.test/download/v1/vehicles/mileage-fee/AB123/2026/excel',
    )
  })

  it('starts the first registration year at its first month', () => {
    const periods = getMockKilometerFee('AB123', 2024).periods
    expect(periods).toHaveLength(10)
    expect(periods[0].month).toBe(3)
    expect(periods.every((p) => p.settlementPayment !== null)).toBe(true)
  })
})
