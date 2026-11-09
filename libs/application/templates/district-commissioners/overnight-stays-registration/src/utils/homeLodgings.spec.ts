import { createApplication } from '@island.is/application/testing'
import { dataSchema } from '../lib/dataSchema'
import {
  buildSubmissionPayload,
  getAdvertisementUrls,
  getDateRangeKey,
  getMonthlyAmountsFromVisits,
  getNegativePerVisitAmountKeys,
  getOvernightDates,
  getSelectedHomeLodging,
  hasActiveAdvertisement,
  parseAmount,
  splitVisitAmountByMonth,
} from './homeLodgings'

describe('homeLodgings', () => {
  it('only selects a lodging matching both the id and year', () => {
    const registration = {
      id: 'HG-00004822',
      year: 2026,
      hasBeenSubmitted: false,
      name: 'Example lodging',
      address: 'Example address',
      postalCode: '101',
      city: 'Reykjavík',
      propertyNumber: '0101',
      unitNumber: '01',
      guestCount: 2,
      roomCount: 1,
    }
    const externalData = {
      homeLodgings: {
        data: [registration],
      },
    }

    expect(
      getSelectedHomeLodging(
        { homeLodgingId: registration.id, year: '2026' },
        externalData,
      ),
    ).toEqual(registration)
    expect(
      getSelectedHomeLodging(
        { homeLodgingId: registration.id, year: '2025' },
        externalData,
      ),
    ).toBeUndefined()
    expect(
      getSelectedHomeLodging(
        { homeLodgingId: 'HG-00000000', year: '2026' },
        externalData,
      ),
    ).toBeUndefined()
  })

  it('parses whole-króna answers in every stored and formatted shape', () => {
    // Canonical shape: `decimalScale={0}` makes the inputs emit integer strings.
    expect(parseAmount('175000')).toBe(175000)
    expect(parseAmount(175000)).toBe(175000)
    // A dot is always thousand grouping, never a decimal separator.
    expect(parseAmount('10.500')).toBe(10500)
    expect(parseAmount('175.000')).toBe(175000)
    expect(parseAmount('175.000 kr.')).toBe(175000)
    expect(parseAmount('1.234.567')).toBe(1234567)
    expect(parseAmount('')).toBe(0)
    expect(parseAmount(undefined)).toBe(0)
  })

  it('round-trips converted monthly amounts through the amount inputs', () => {
    const visit = { from: '2026-08-01', to: '2026-08-03' }
    const monthlyAmounts = getMonthlyAmountsFromVisits({
      perVisitAmounts: { [getDateRangeKey(visit)]: '175000' },
      visitRanges: [visit],
    })

    // Pricing writes `String(amount)` back as the input answer, so what the
    // conversion produces has to survive being parsed again unchanged.
    expect(monthlyAmounts).toEqual({ month7: 175000 })
    expect(parseAmount(String(monthlyAmounts.month7))).toBe(175000)
  })

  it('identifies negative per-visit amounts before monthly conversion', () => {
    const negativeVisit = { from: '2026-07-01', to: '2026-07-02' }
    const positiveVisit = { from: '2026-07-10', to: '2026-07-11' }

    expect(
      getNegativePerVisitAmountKeys({
        perVisitAmounts: {
          [getDateRangeKey(negativeVisit)]: '-100',
          [getDateRangeKey(positiveVisit)]: '200',
        },
        visitRanges: [negativeVisit, positiveVisit],
      }),
    ).toEqual([getDateRangeKey(negativeVisit)])
  })

  it('supports persisted advertisement answers from before the repeater migration', () => {
    const answers = {
      noActiveAdvertisement: false,
      advertisementUrls: [' https://example.com/listing '],
    }

    expect(hasActiveAdvertisement(answers)).toBe(true)
    expect(getAdvertisementUrls(answers)).toEqual([
      'https://example.com/listing',
    ])
    expect(
      hasActiveAdvertisement({
        ...answers,
        noActiveAdvertisement: true,
      }),
    ).toBe(false)
    expect(dataSchema.partial().safeParse(answers).success).toBe(true)
  })

  it('accepts cleared advertisements when no active advertisement is selected', () => {
    expect(
      dataSchema.partial().safeParse({
        noActiveAdvertisement: ['true'],
        advertisements: '',
      }).success,
    ).toBe(true)
    expect(
      dataSchema.partial().safeParse({
        noActiveAdvertisement: ['true'],
        advertisements: [],
      }).success,
    ).toBe(true)
  })

  it('submits the active advertisement choice explicitly', () => {
    const activeAdvertisement = createApplication({
      answers: {
        noActiveAdvertisement: [],
        advertisements: [],
      },
    })
    const noActiveAdvertisement = createApplication({
      answers: {
        noActiveAdvertisement: ['true'],
        advertisements: [],
      },
    })

    expect(
      buildSubmissionPayload(activeAdvertisement).hasActiveAdvertisement,
    ).toBe(true)
    expect(
      buildSubmissionPayload(noActiveAdvertisement).hasActiveAdvertisement,
    ).toBe(false)
  })

  it('only validates amounts for the selected pricing method', () => {
    const staleAmounts = {
      '2024-01-30_2024-02-02': null,
      '2024-03-05_2024-03-08': null,
    }

    expect(
      dataSchema.partial().safeParse({
        pricing: {
          method: 'monthly',
          monthlyAmounts: { month0: '10.000' },
          perVisitAmounts: staleAmounts,
        },
      }).success,
    ).toBe(true)

    expect(
      dataSchema.partial().safeParse({
        pricing: {
          method: 'perVisit',
          monthlyAmounts: staleAmounts,
          perVisitAmounts: {
            '2024-01-30_2024-02-02': '10.000',
          },
        },
      }).success,
    ).toBe(true)

    expect(
      dataSchema.partial().safeParse({
        pricing: {
          method: 'perVisit',
          monthlyAmounts: {},
          perVisitAmounts: staleAmounts,
        },
      }).success,
    ).toBe(false)
  })

  it('requires every active income value while accepting zero income', () => {
    expect(
      dataSchema.partial().safeParse({
        pricing: {
          method: 'monthly',
          monthlyAmounts: { month0: '' },
          perVisitAmounts: {},
        },
      }).success,
    ).toBe(false)

    expect(
      dataSchema.partial().safeParse({
        pricing: {
          method: 'perVisit',
          monthlyAmounts: {},
          perVisitAmounts: {
            '2024-01-30_2024-02-02': '   ',
          },
        },
      }).success,
    ).toBe(false)

    expect(
      dataSchema.partial().safeParse({
        pricing: {
          method: 'monthly',
          monthlyAmounts: { month0: '0' },
          perVisitAmounts: {},
        },
      }).success,
    ).toBe(true)
  })

  it('does not count the last day of each visit as an overnight stay', () => {
    expect(
      getOvernightDates([
        '2026-08-01',
        '2026-08-02',
        '2026-08-10',
        '2026-08-11',
        '2026-08-12',
      ]),
    ).toEqual(['2026-08-01', '2026-08-10', '2026-08-11'])
  })

  it('maps per-visit amounts to separate ranges in the same month', () => {
    const firstVisit = { from: '2026-08-01', to: '2026-08-02' }
    const secondVisit = { from: '2026-08-10', to: '2026-08-11' }
    const application = createApplication({
      answers: {
        year: '2026',
        homeLodgingId: 'HG-00004822',
        overnightDates: [
          '2026-08-01',
          '2026-08-02',
          '2026-08-10',
          '2026-08-11',
        ],
        pricing: {
          method: 'perVisit',
          monthlyAmounts: {},
          perVisitAmounts: {
            [getDateRangeKey(firstVisit)]: '100.000 kr.',
            [getDateRangeKey(secondVisit)]: '150.000 kr.',
          },
        },
      },
    })

    expect(buildSubmissionPayload(application).nights).toEqual([
      {
        month: 8,
        dateRanges: [
          { ...firstVisit, amount: 100000 },
          { ...secondVisit, amount: 150000 },
        ],
        numberOfNights: 2,
        rentalIncome: 250000,
      },
    ])
  })

  it('reports no nights when the applicant declared no overnight stays', () => {
    // The calendar and pricing screens are only hidden by `condition`, so an
    // earlier edit can leave dates and amounts behind in the answers.
    const application = createApplication({
      answers: {
        year: '2026',
        homeLodgingId: 'HG-00004822',
        noOvernightStays: ['true'],
        overnightDates: ['2026-08-01', '2026-08-02'],
        pricing: {
          method: 'monthly',
          monthlyAmounts: { month7: '175000' },
          perVisitAmounts: {},
        },
      },
    })

    expect(buildSubmissionPayload(application).nights).toEqual([])
  })

  it('splits a cross-month visit amount proportionally by nights', () => {
    const visit = { from: '2026-07-30', to: '2026-08-02' }
    const application = createApplication({
      answers: {
        year: '2026',
        homeLodgingId: 'HG-00004822',
        overnightDates: [
          '2026-07-30',
          '2026-07-31',
          '2026-08-01',
          '2026-08-02',
        ],
        pricing: {
          method: 'perVisit',
          monthlyAmounts: {},
          perVisitAmounts: {
            [getDateRangeKey(visit)]: '175.000 kr.',
          },
        },
      },
    })

    expect(buildSubmissionPayload(application).nights).toEqual([
      {
        month: 7,
        dateRanges: [
          {
            from: '2026-07-30',
            to: '2026-07-31',
            amount: 116667,
          },
        ],
        numberOfNights: 2,
        rentalIncome: 116667,
      },
      {
        month: 8,
        dateRanges: [
          {
            from: '2026-08-01',
            to: '2026-08-02',
            amount: 58333,
          },
        ],
        numberOfNights: 1,
        rentalIncome: 58333,
      },
    ])
  })

  it('keeps the rounding remainder so monthly shares add back up to the visit amount', () => {
    const visit = { from: '2026-07-30', to: '2026-08-02' }

    expect([...splitVisitAmountByMonth(visit, 175000).entries()]).toEqual([
      [6, 116667],
      [7, 58333],
    ])
    expect(
      getMonthlyAmountsFromVisits({
        perVisitAmounts: { [getDateRangeKey(visit)]: '175.000 kr.' },
        visitRanges: [visit],
      }),
    ).toEqual({ month6: 116667, month7: 58333 })
  })

  it('folds per-visit amounts in the same month into a single monthly total', () => {
    const firstVisit = { from: '2026-08-01', to: '2026-08-02' }
    const secondVisit = { from: '2026-08-10', to: '2026-08-11' }

    expect(
      getMonthlyAmountsFromVisits({
        perVisitAmounts: {
          [getDateRangeKey(firstVisit)]: '100.000 kr.',
          [getDateRangeKey(secondVisit)]: '150.000 kr.',
        },
        visitRanges: [firstVisit, secondVisit],
      }),
    ).toEqual({ month7: 250000 })
  })
})
