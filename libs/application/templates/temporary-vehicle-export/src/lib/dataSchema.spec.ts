import { dataSchema } from './dataSchema'
import { getMileageDrivenAbroad, parseMileage } from '../utils/helpers'

const yesterday = () => {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  return date.toISOString().slice(0, 10)
}

const tomorrow = () => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().slice(0, 10)
}

describe('temporary vehicle export dataSchema', () => {
  const departure = dataSchema.shape.departure
  const arrival = dataSchema.shape.arrival

  it('accepts a departure at or above the latest registered mileage', () => {
    expect(
      departure.safeParse({
        date: yesterday(),
        mileage: '12000',
        latestMileage: '12000',
      }).success,
    ).toBe(true)
  })

  it('rejects a departure below the latest registered mileage', () => {
    const result = departure.safeParse({
      date: yesterday(),
      mileage: '11999',
      latestMileage: '12000',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toEqual(['mileage'])
  })

  it('rejects a departure date in the future', () => {
    expect(
      departure.safeParse({ date: tomorrow(), mileage: '100' }).success,
    ).toBe(false)
  })

  it('rejects zero or non-integer mileage', () => {
    expect(
      departure.safeParse({ date: yesterday(), mileage: '0' }).success,
    ).toBe(false)
    expect(
      departure.safeParse({ date: yesterday(), mileage: '10.5' }).success,
    ).toBe(false)
  })

  it('rejects an arrival before the departure date', () => {
    const result = arrival.safeParse({
      date: '2026-01-01',
      mileage: '15000',
      departureDate: '2026-01-10',
      departureMileage: '12000',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toEqual(['date'])
  })

  it('rejects an arrival mileage below the departure mileage', () => {
    const result = arrival.safeParse({
      date: yesterday(),
      mileage: '11000',
      departureDate: '2026-01-10',
      departureMileage: '12000',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toEqual(['mileage'])
  })

  it('accepts a valid arrival', () => {
    expect(
      arrival.safeParse({
        date: yesterday(),
        mileage: '14500',
        departureDate: '2026-01-10',
        departureMileage: '12000',
      }).success,
    ).toBe(true)
  })
})

describe('mileage helpers', () => {
  it('parses mileage answers', () => {
    expect(parseMileage('12000')).toBe(12000)
    expect(parseMileage('')).toBeUndefined()
    expect(parseMileage('-1')).toBeUndefined()
    expect(parseMileage('abc')).toBeUndefined()
  })

  it('calculates km driven abroad', () => {
    expect(
      getMileageDrivenAbroad({
        departure: { mileage: '12000' },
        arrival: { mileage: '14500' },
      }),
    ).toBe(2500)
    expect(
      getMileageDrivenAbroad({ departure: { mileage: '12000' } }),
    ).toBeUndefined()
  })
})
