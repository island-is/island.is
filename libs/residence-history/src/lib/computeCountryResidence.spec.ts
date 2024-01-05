import { computeCountryResidence } from './computeCountryResidence'
import { DAY } from './constants'

jest.useFakeTimers()

const d = new Date().getTime()

// helper to return a date object with subtracted days from "today"
const makeDate = (addDays: number): Date => new Date(d + addDays * DAY)

describe('computeCountryResidence()', () => {
  it('should work with a single entry older than a year', async () => {
    const report = computeCountryResidence([
      {
        address: {},
        country: 'IS',
        dateOfChange: makeDate(-500),
      },
    ])

    expect(report).toMatchObject({
      IS: 365,
    })
  })

  it('should work with a single entry less than a year, but more than 185 days', async () => {
    const report = computeCountryResidence([
      {
        address: {},
        country: 'IS',
        dateOfChange: makeDate(-200),
      },
    ])

    expect(report).toMatchObject({
      IS: 200,
    })
  })

  it('should work with a single entry more than a year, where residence was abroad', async () => {
    const report = computeCountryResidence([
      {
        address: {},
        country: 'US',
        dateOfChange: makeDate(-500),
      },
    ])

    expect(report).toMatchObject({
      US: 365,
    })
  })

  it('should work with mixed residences', async () => {
    const report = computeCountryResidence([
      {
        address: {},
        country: 'IS',
        dateOfChange: makeDate(-2),
      },
      {
        address: {},
        country: 'US',
        dateOfChange: makeDate(-4),
      },
      {
        address: {},
        country: 'IS',
        dateOfChange: makeDate(-6),
      },
    ])

    expect(report).toMatchObject({
      IS: 4,
      US: 2,
    })
  })

  it('should work with ancient residences, even though most recent is abroad', async () => {
    const report = computeCountryResidence([
      {
        address: {},
        country: 'IS',
        dateOfChange: makeDate(-1500),
      },
      {
        address: {},
        country: 'US',
        dateOfChange: makeDate(-100),
      },
    ])

    expect(report).toMatchObject({
      IS: 265,
      US: 100,
    })
  })

  it('should work with dates even when they are returned out of order', async () => {
    const report = computeCountryResidence([
      {
        address: {},
        country: 'IS',
        dateOfChange: makeDate(-1500),
      },
      {
        address: {},
        country: 'US',
        dateOfChange: makeDate(-20),
      },
      {
        address: {},
        country: 'US',
        dateOfChange: makeDate(-100),
      },
      {
        address: {},
        country: 'IS',
        dateOfChange: makeDate(-300),
      },
    ])

    expect(report).toMatchObject({
      IS: 265,
      US: 100,
    })
  })
})
