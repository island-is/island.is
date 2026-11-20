import { dataSchema } from './dataSchema'
import { m } from './messages'
import {
  getDepartureDate,
  getDepartureMileage,
  getMileageDrivenAbroad,
  parseMileage,
  toDate,
  usesLatestMileage,
} from '../utils/helpers'

const yesterday = () => {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  return date.toISOString().slice(0, 10)
}

const daysFromToday = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

const tomorrow = () => daysFromToday(1)

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

  it('accepts the latest registered mileage without a new mileage', () => {
    expect(
      departure.safeParse({
        date: yesterday(),
        useLatestMileage: 'yes',
        latestMileage: '12000',
      }).success,
    ).toBe(true)
  })

  it('requires a mileage when the latest registered mileage is not used', () => {
    const result = departure.safeParse({
      date: yesterday(),
      useLatestMileage: 'no',
      latestMileage: '12000',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toEqual(['mileage'])
  })

  it('does not ask for a departure date when the latest reading is used', () => {
    expect(
      departure.safeParse({
        useLatestMileage: 'yes',
        latestMileage: '12000',
        latestMileageReadDate: '2026-05-19T00:00:00.000Z',
      }).success,
    ).toBe(true)
  })

  it('requires a departure date when a new mileage is registered', () => {
    const result = departure.safeParse({
      useLatestMileage: 'no',
      mileage: '12500',
      latestMileage: '12000',
      latestMileageReadDate: '2026-05-19T00:00:00.000Z',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toEqual(['date'])
  })

  it('requires a departure date when the latest reading has no date', () => {
    const result = departure.safeParse({
      useLatestMileage: 'yes',
      latestMileage: '12000',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toEqual(['date'])
  })

  it('rejects using the latest mileage when the vehicle has none', () => {
    expect(
      departure.safeParse({ date: yesterday(), useLatestMileage: 'yes' })
        .success,
    ).toBe(false)
  })

  it('ignores a saved manual date when the latest reading and its date are used', () => {
    expect(
      departure.safeParse({
        date: daysFromToday(-10),
        useLatestMileage: 'yes',
        latestMileage: '12000',
        latestMileageReadDate: '2026-01-05T00:00:00.000Z',
      }).success,
    ).toBe(true)
  })

  it('ignores a saved choice of the latest reading when the vehicle has none', () => {
    const answers = {
      departure: { useLatestMileage: 'yes', latestMileage: '' },
    }
    expect(usesLatestMileage(answers)).toBe(false)
    expect(
      departure.safeParse({
        ...answers.departure,
        date: yesterday(),
        mileage: '12000',
      }).success,
    ).toBe(true)
  })

  it('rejects a departure date in the future', () => {
    const result = departure.safeParse({ date: tomorrow(), mileage: '100' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toEqual(['date'])
  })

  it('accepts a departure date up to three days back', () => {
    expect(
      departure.safeParse({ date: daysFromToday(-3), mileage: '100' }).success,
    ).toBe(true)
  })

  it('rejects a departure date more than three days back', () => {
    const result = departure.safeParse({
      date: daysFromToday(-4),
      mileage: '100',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toEqual(['date'])
  })

  it('accepts up to five proof of travel documents', () => {
    const files = (count: number) =>
      Array.from({ length: count }, (_, i) => ({
        name: `skjal-${i}.pdf`,
        key: `key-${i}`,
      }))
    const proofOfTravel = dataSchema.shape.proofOfTravel

    expect(proofOfTravel.safeParse(files(5)).success).toBe(true)
    expect(proofOfTravel.safeParse(files(6)).success).toBe(false)
  })

  it('rejects an arrival date more than three days back', () => {
    const arrivalAt = (days: number) =>
      arrival.safeParse({
        date: daysFromToday(days),
        mileage: '14500',
        departureDate: '2026-01-10',
        departureMileage: '12000',
      })
    expect(arrivalAt(-3).success).toBe(true)
    const result = arrivalAt(-4)
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toEqual(['date'])
  })

  it('rejects an arrival date in the future', () => {
    expect(
      arrival.safeParse({
        date: tomorrow(),
        mileage: '14500',
        departureDate: '2026-01-10',
        departureMileage: '12000',
      }).success,
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
    // Both dates are within the three-day limit, so only the order fails
    const result = arrival.safeParse({
      date: daysFromToday(-2),
      mileage: '15000',
      departureDate: daysFromToday(-1),
      departureMileage: '12000',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues).toHaveLength(1)
    expect(result.error?.issues[0]).toMatchObject({
      path: ['date'],
      params: m.errors.arrivalBeforeDeparture,
    })
  })

  it('accepts a same-day arrival when the departure is a later timestamp that day', () => {
    // A reused reading date is a timestamp. In a timezone ahead of UTC a
    // midnight UTC reading falls later in the day than a date-only arrival,
    // which this local noon timestamp reproduces in any timezone.
    const day = daysFromToday(-1)
    const result = arrival.safeParse({
      date: day,
      mileage: '15000',
      departureDate: `${day}T12:00:00`,
      departureMileage: '12000',
    })
    expect(result.error?.issues).toBeUndefined()
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
  it('reads date-only answers as local calendar dates', () => {
    const date = toDate('2026-11-20')
    expect([date?.getFullYear(), date?.getMonth(), date?.getDate()]).toEqual([
      2026, 10, 20,
    ])
  })

  it('parses mileage answers', () => {
    expect(parseMileage('12000')).toBe(12000)
    expect(parseMileage('')).toBeUndefined()
    expect(parseMileage('-1')).toBeUndefined()
    expect(parseMileage('abc')).toBeUndefined()
  })

  it('uses the latest registered mileage as departure mileage when chosen', () => {
    const departure = { mileage: '13000', latestMileage: '12000' }
    expect(getDepartureMileage({ departure })).toBe(13000)
    expect(
      getDepartureMileage({
        departure: { ...departure, useLatestMileage: 'yes' },
      }),
    ).toBe(12000)
  })

  it('uses the reading date as departure date with the latest reading', () => {
    const departure = {
      date: '2026-11-10',
      latestMileage: '12000',
      latestMileageReadDate: '2026-05-19T00:00:00.000Z',
    }
    expect(getDepartureDate({ departure })).toBe('2026-11-10')
    expect(
      getDepartureDate({
        departure: { ...departure, useLatestMileage: 'yes' },
      }),
    ).toBe('2026-05-19T00:00:00.000Z')
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
