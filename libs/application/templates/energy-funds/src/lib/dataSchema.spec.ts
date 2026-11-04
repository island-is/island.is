import { EnergyFundsSchema } from './dataSchema'
import { getPriceCap } from '../utils'

const vehicleDetailsSchema = EnergyFundsSchema.shape.vehicleDetails

describe('getPriceCap', () => {
  const beforeChange = new Date('2026-10-31T23:59:59Z')
  const afterChange = new Date('2026-11-01T00:00:00Z')

  it('keeps the 10M cap for every category before 1 November 2026', () => {
    expect(getPriceCap('M1', beforeChange)).toBe(10000000)
    expect(getPriceCap('N1', beforeChange)).toBe(10000000)
  })

  it('lowers the cap to 8M for passenger cars from 1 November 2026', () => {
    expect(getPriceCap('M1', afterChange)).toBe(8000000)
    expect(getPriceCap(' m1 ', afterChange)).toBe(8000000)
  })

  it('keeps the 10M cap for vans and unknown categories after the change', () => {
    expect(getPriceCap('N1', afterChange)).toBe(10000000)
    expect(getPriceCap(undefined, afterChange)).toBe(10000000)
    expect(getPriceCap(null, afterChange)).toBe(10000000)
  })
})

describe('vehicleDetails price validation', () => {
  afterEach(() => {
    jest.useRealTimers()
  })

  it('accepts a 9M passenger car before 1 November 2026', () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-10-31T12:00:00Z'))

    const result = vehicleDetailsSchema.safeParse({
      price: '9000000',
      vehicleRegistrationCode: 'M1',
    })

    expect(result.success).toBe(true)
  })

  it('rejects a 9M passenger car from 1 November 2026 on the price field', () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-11-01T12:00:00Z'))

    const result = vehicleDetailsSchema.safeParse({
      price: '9000000',
      vehicleRegistrationCode: 'M1',
    })

    expect(result.success).toBe(false)
    expect(!result.success && result.error.issues[0].path).toEqual(['price'])
  })

  it('accepts a 9M van from 1 November 2026', () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-11-01T12:00:00Z'))

    const result = vehicleDetailsSchema.safeParse({
      price: '9000000',
      vehicleRegistrationCode: 'N1',
    })

    expect(result.success).toBe(true)
  })

  it('rejects anything over 10M', () => {
    const result = vehicleDetailsSchema.safeParse({ price: '10000001' })

    expect(result.success).toBe(false)
  })
})
