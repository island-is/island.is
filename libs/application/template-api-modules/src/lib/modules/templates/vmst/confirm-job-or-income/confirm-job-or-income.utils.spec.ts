/* eslint-disable local-rules/disallow-kennitalas */
import { ExternalData, FormValue } from '@island.is/application/types'
import { IncomeType } from './confirm-job-or-income.types'
import { buildCreateIncomesRequest } from './confirm-job-or-income.utils'

describe('buildCreateIncomesRequest', () => {
  it('maps the selected part-time rows and omits UI-only fields', () => {
    const answers: FormValue = {
      typeOfIncome: [IncomeType.PART_TIME],
      registerPartTime: [
        {
          jobEnd: '2026-09-09',
          company: {
            name: '65° ARTIC ehf.',
            nationalId: '500510-1370',
          },
          disabled: 'false',
          jobStart: '2026-09-02',
          isUnsaved: false,
          validationId: 'f539a3ed-00c1-400f-a7ae-c9c3dee234a0',
          workPercentage: '22',
          estimatedIncome: '11221',
        },
      ],
    }

    expect(buildCreateIncomesRequest(answers, {})).toEqual({
      irregularJobs: undefined,
      partTimeJobs: [
        {
          employerSSN: '5005101370',
          periodFrom: new Date('2026-09-02'),
          periodTo: new Date('2026-09-09'),
          ratio: 22,
          estimatedIncome: 11221,
        },
      ],
      contractorJobs: undefined,
      capitalIncomePayments: undefined,
      trPayments: undefined,
      pensionPayments: undefined,
    })
  })

  it('builds one aggregate request for all selected income types', () => {
    const answers: FormValue = {
      typeOfIncome: [
        IncomeType.CASUAL_WORK,
        IncomeType.CONTRACT_WORK,
        IncomeType.CAPITAL_INCOME,
        IncomeType.SOCIAL_INSURANCE,
        IncomeType.PENSION,
      ],
      registerCasualWork: [
        {
          company: { nationalId: '010130-2399' },
          dateFrom: '2026-09-01',
          dateTo: '2026-09-02',
          estimatedIncome: '1000',
          workshiftPeriod: 'day-shift',
        },
        { isRemoved: true },
      ],
      registerContractWork: [
        { contractJobStart: '2026-09-03', workEnds: '2026-09-04' },
      ],
      registerCapitalIncome: [
        {
          paymentType: 'rent',
          amountPerMonth: '2000',
          paymentFrequency: 'oneTime',
          dateFrom: '2026-09-05',
          dateTo: '2026-09-06',
        },
      ],
      registerSocialInsurance: [
        {
          socialPaymentType: 'rehabilitation',
          amountPerMonth: '3000',
          paymentFrequency: 'monthly',
          dateFrom: '2026-09-07',
        },
      ],
      registerPension: [
        {
          pensionType: 'pension',
          pensionFund: 'fund-id',
          amountPerMonth: '4000',
          paymentFrequency: 'monthly',
          dateFrom: '2026-09-08',
        },
      ],
    }

    expect(buildCreateIncomesRequest(answers, {})).toEqual({
      irregularJobs: [
        {
          employerSSN: '0101302399',
          periodFrom: new Date('2026-09-01'),
          periodTo: new Date('2026-09-02'),
          estimatedIncome: 1000,
          workShiftPeriodIds: ['day-shift'],
        },
      ],
      partTimeJobs: undefined,
      contractorJobs: [
        {
          periodFrom: new Date('2026-09-03'),
          periodTo: new Date('2026-09-04'),
        },
      ],
      capitalIncomePayments: [
        {
          incomeTypeId: 'rent',
          estimatedIncome: 2000,
          periodFrom: new Date('2026-09-05'),
          periodTo: new Date('2026-09-06'),
        },
      ],
      trPayments: [
        {
          incomeTypeId: 'rehabilitation',
          estimatedIncome: 3000,
          periodFrom: new Date('2026-09-07'),
          periodTo: null,
        },
      ],
      pensionPayments: [
        {
          incomeTypeId: 'pension',
          pensionFundId: 'fund-id',
          estimatedIncome: 4000,
          periodFrom: new Date('2026-09-08'),
          periodTo: null,
        },
      ],
    })
  })

  it('creates new jobs, omits retained jobs, and deletes removed jobs', () => {
    const retainedId = 'retained-job-id'
    const removedId = 'removed-job-id'
    const answers: FormValue = {
      typeOfIncome: [IncomeType.PART_TIME],
      registerPartTime: [
        {
          validationId: retainedId,
          company: { nationalId: '5005101370' },
          jobStart: '2026-09-01',
          workPercentage: '20',
          estimatedIncome: '10000',
        },
        {
          validationId: 'new-row-validation-id',
          company: { nationalId: '500510-1370' },
          jobStart: '2026-09-10',
          jobEnd: '2026-09-20',
          workPercentage: '30',
          estimatedIncome: '20000',
        },
      ],
    }
    const externalData: ExternalData = {
      income: {
        status: 'success',
        date: new Date(),
        data: {
          partTimeJobs: [{ id: retainedId }, { id: removedId }, {}],
        },
      },
    }

    expect(
      buildCreateIncomesRequest(answers, externalData).partTimeJobs,
    ).toEqual([
      {
        employerSSN: '5005101370',
        periodFrom: new Date('2026-09-10'),
        periodTo: new Date('2026-09-20'),
        ratio: 30,
        estimatedIncome: 20000,
      },
      { id: removedId, deleted: true },
    ])
  })

  it('treats removed answer rows as deleted persisted jobs', () => {
    const persistedId = 'persisted-job-id'
    const answers: FormValue = {
      typeOfIncome: [IncomeType.PART_TIME],
      registerPartTime: [{ validationId: persistedId, isRemoved: true }],
    }
    const externalData: ExternalData = {
      income: {
        status: 'success',
        date: new Date(),
        data: { partTimeJobs: [{ id: persistedId }] },
      },
    }

    expect(
      buildCreateIncomesRequest(answers, externalData).partTimeJobs,
    ).toEqual([{ id: persistedId, deleted: true }])
  })

  it('carries employerSSN through part-time delete markers when the persisted job has one', () => {
    const persistedId = 'persisted-job-id'
    const answers: FormValue = {
      typeOfIncome: [IncomeType.PART_TIME],
      registerPartTime: [{ validationId: persistedId, isRemoved: true }],
    }
    const externalData: ExternalData = {
      income: {
        status: 'success',
        date: new Date(),
        data: {
          partTimeJobs: [{ id: persistedId, employerSSN: '5005101370' }],
        },
      },
    }

    expect(
      buildCreateIncomesRequest(answers, externalData).partTimeJobs,
    ).toEqual([{ id: persistedId, deleted: true, employerSSN: '5005101370' }])
  })

  it('does not reconcile persisted part-time jobs when part-time is not selected', () => {
    const externalData: ExternalData = {
      income: {
        status: 'success',
        date: new Date(),
        data: { partTimeJobs: [{ id: 'persisted-job-id' }] },
      },
    }

    expect(
      buildCreateIncomesRequest({ typeOfIncome: [] }, externalData)
        .partTimeJobs,
    ).toBeUndefined()
  })

  describe('irregular jobs (casual work)', () => {
    it('creates new jobs, omits retained jobs, and deletes removed jobs', () => {
      const retainedId = 'retained-irregular-id'
      const removedId = 'removed-irregular-id'
      const answers: FormValue = {
        typeOfIncome: [IncomeType.CASUAL_WORK],
        registerCasualWork: [
          {
            validationId: retainedId,
            company: { nationalId: '010130-2399' },
            dateFrom: '2026-09-01',
            dateTo: '2026-09-02',
            estimatedIncome: '1000',
            workshiftPeriod: 'day-shift',
          },
          {
            validationId: 'stale-id',
            company: { nationalId: '010130-2399' },
            dateFrom: '2026-09-05',
            dateTo: '2026-09-06',
            estimatedIncome: '2000',
            workshiftPeriod: 'night-shift',
          },
        ],
      }
      const externalData: ExternalData = {
        income: {
          status: 'success',
          date: new Date(),
          data: {
            irregularJobs: [{ id: retainedId }, { id: removedId }, {}],
          },
        },
      }

      expect(
        buildCreateIncomesRequest(answers, externalData).irregularJobs,
      ).toEqual([
        {
          employerSSN: '0101302399',
          periodFrom: new Date('2026-09-05'),
          periodTo: new Date('2026-09-06'),
          estimatedIncome: 2000,
          workShiftPeriodIds: ['night-shift'],
        },
        { id: removedId, deleted: true },
      ])
    })

    it('treats removed answer rows as deleted persisted jobs', () => {
      const persistedId = 'persisted-irregular-id'
      const answers: FormValue = {
        typeOfIncome: [IncomeType.CASUAL_WORK],
        registerCasualWork: [{ validationId: persistedId, isRemoved: true }],
      }
      const externalData: ExternalData = {
        income: {
          status: 'success',
          date: new Date(),
          data: { irregularJobs: [{ id: persistedId }] },
        },
      }

      expect(
        buildCreateIncomesRequest(answers, externalData).irregularJobs,
      ).toEqual([{ id: persistedId, deleted: true }])
    })

    it('carries employerSSN through irregular delete markers when the persisted job has one', () => {
      const persistedId = 'persisted-irregular-id'
      const answers: FormValue = {
        typeOfIncome: [IncomeType.CASUAL_WORK],
        registerCasualWork: [{ validationId: persistedId, isRemoved: true }],
      }
      const externalData: ExternalData = {
        income: {
          status: 'success',
          date: new Date(),
          data: {
            irregularJobs: [{ id: persistedId, employerSSN: '0101302399' }],
          },
        },
      }

      expect(
        buildCreateIncomesRequest(answers, externalData).irregularJobs,
      ).toEqual([{ id: persistedId, deleted: true, employerSSN: '0101302399' }])
    })

    it('does not reconcile persisted irregular jobs when casual work is not selected', () => {
      const externalData: ExternalData = {
        income: {
          status: 'success',
          date: new Date(),
          data: { irregularJobs: [{ id: 'persisted-irregular-id' }] },
        },
      }

      expect(
        buildCreateIncomesRequest({ typeOfIncome: [] }, externalData)
          .irregularJobs,
      ).toBeUndefined()
    })
  })

  describe('contractor jobs (contract work)', () => {
    it('creates new jobs, omits retained jobs, and deletes removed jobs', () => {
      const retainedId = 'retained-contractor-id'
      const removedId = 'removed-contractor-id'
      const answers: FormValue = {
        typeOfIncome: [IncomeType.CONTRACT_WORK],
        registerContractWork: [
          {
            validationId: retainedId,
            contractJobStart: '2026-09-01',
            workEnds: '2026-09-02',
          },
          {
            contractJobStart: '2026-09-10',
            workEnds: '2026-09-20',
          },
        ],
      }
      const externalData: ExternalData = {
        income: {
          status: 'success',
          date: new Date(),
          data: {
            contractorJobs: [{ id: retainedId }, { id: removedId }, {}],
          },
        },
      }

      expect(
        buildCreateIncomesRequest(answers, externalData).contractorJobs,
      ).toEqual([
        {
          periodFrom: new Date('2026-09-10'),
          periodTo: new Date('2026-09-20'),
        },
        { id: removedId, deleted: true },
      ])
    })

    it('treats removed answer rows as deleted persisted jobs', () => {
      const persistedId = 'persisted-contractor-id'
      const answers: FormValue = {
        typeOfIncome: [IncomeType.CONTRACT_WORK],
        registerContractWork: [{ validationId: persistedId, isRemoved: true }],
      }
      const externalData: ExternalData = {
        income: {
          status: 'success',
          date: new Date(),
          data: { contractorJobs: [{ id: persistedId }] },
        },
      }

      expect(
        buildCreateIncomesRequest(answers, externalData).contractorJobs,
      ).toEqual([{ id: persistedId, deleted: true }])
    })

    it('does not reconcile persisted contractor jobs when contract work is not selected', () => {
      const externalData: ExternalData = {
        income: {
          status: 'success',
          date: new Date(),
          data: { contractorJobs: [{ id: 'persisted-contractor-id' }] },
        },
      }

      expect(
        buildCreateIncomesRequest({ typeOfIncome: [] }, externalData)
          .contractorJobs,
      ).toBeUndefined()
    })
  })

  describe('capital income payments', () => {
    it('creates new payments, omits retained payments, and deletes removed payments', () => {
      const retainedId = 'retained-capital-id'
      const removedId = 'removed-capital-id'
      const answers: FormValue = {
        typeOfIncome: [IncomeType.CAPITAL_INCOME],
        registerCapitalIncome: [
          {
            validationId: retainedId,
            paymentType: 'rent',
            amountPerMonth: '1000',
            paymentFrequency: 'oneTime',
            dateFrom: '2026-09-01',
            dateTo: '2026-09-02',
          },
          {
            paymentType: 'dividends',
            amountPerMonth: '2000',
            paymentFrequency: 'monthly',
            dateFrom: '2026-09-05',
          },
        ],
      }
      const externalData: ExternalData = {
        income: {
          status: 'success',
          date: new Date(),
          data: {
            capitalIncomePayments: [{ id: retainedId }, { id: removedId }, {}],
          },
        },
      }

      expect(
        buildCreateIncomesRequest(answers, externalData).capitalIncomePayments,
      ).toEqual([
        {
          incomeTypeId: 'dividends',
          estimatedIncome: 2000,
          periodFrom: new Date('2026-09-05'),
          periodTo: null,
        },
        { id: removedId, deleted: true },
      ])
    })

    it('treats removed answer rows as deleted persisted payments', () => {
      const persistedId = 'persisted-capital-id'
      const answers: FormValue = {
        typeOfIncome: [IncomeType.CAPITAL_INCOME],
        registerCapitalIncome: [{ validationId: persistedId, isRemoved: true }],
      }
      const externalData: ExternalData = {
        income: {
          status: 'success',
          date: new Date(),
          data: { capitalIncomePayments: [{ id: persistedId }] },
        },
      }

      expect(
        buildCreateIncomesRequest(answers, externalData).capitalIncomePayments,
      ).toEqual([{ id: persistedId, deleted: true }])
    })

    it('does not reconcile persisted capital payments when capital income is not selected', () => {
      const externalData: ExternalData = {
        income: {
          status: 'success',
          date: new Date(),
          data: {
            capitalIncomePayments: [{ id: 'persisted-capital-id' }],
          },
        },
      }

      expect(
        buildCreateIncomesRequest({ typeOfIncome: [] }, externalData)
          .capitalIncomePayments,
      ).toBeUndefined()
    })
  })

  describe('TR payments (social insurance)', () => {
    it('creates new payments, omits retained payments, and deletes removed payments', () => {
      const retainedId = 'retained-tr-id'
      const removedId = 'removed-tr-id'
      const answers: FormValue = {
        typeOfIncome: [IncomeType.SOCIAL_INSURANCE],
        registerSocialInsurance: [
          {
            validationId: retainedId,
            socialPaymentType: 'rehabilitation',
            amountPerMonth: '1000',
            paymentFrequency: 'monthly',
            dateFrom: '2026-09-01',
          },
          {
            socialPaymentType: 'disability',
            amountPerMonth: '3000',
            paymentFrequency: 'oneTime',
            dateFrom: '2026-09-05',
            dateTo: '2026-09-06',
          },
        ],
      }
      const externalData: ExternalData = {
        income: {
          status: 'success',
          date: new Date(),
          data: {
            trPayments: [{ id: retainedId }, { id: removedId }, {}],
          },
        },
      }

      expect(
        buildCreateIncomesRequest(answers, externalData).trPayments,
      ).toEqual([
        {
          incomeTypeId: 'disability',
          estimatedIncome: 3000,
          periodFrom: new Date('2026-09-05'),
          periodTo: new Date('2026-09-06'),
        },
        { id: removedId, deleted: true },
      ])
    })

    it('treats removed answer rows as deleted persisted payments', () => {
      const persistedId = 'persisted-tr-id'
      const answers: FormValue = {
        typeOfIncome: [IncomeType.SOCIAL_INSURANCE],
        registerSocialInsurance: [
          { validationId: persistedId, isRemoved: true },
        ],
      }
      const externalData: ExternalData = {
        income: {
          status: 'success',
          date: new Date(),
          data: { trPayments: [{ id: persistedId }] },
        },
      }

      expect(
        buildCreateIncomesRequest(answers, externalData).trPayments,
      ).toEqual([{ id: persistedId, deleted: true }])
    })

    it('does not reconcile persisted TR payments when social insurance is not selected', () => {
      const externalData: ExternalData = {
        income: {
          status: 'success',
          date: new Date(),
          data: { trPayments: [{ id: 'persisted-tr-id' }] },
        },
      }

      expect(
        buildCreateIncomesRequest({ typeOfIncome: [] }, externalData)
          .trPayments,
      ).toBeUndefined()
    })
  })

  describe('pension payments', () => {
    it('creates new payments, omits retained payments, and deletes removed payments', () => {
      const retainedId = 'retained-pension-id'
      const removedId = 'removed-pension-id'
      const answers: FormValue = {
        typeOfIncome: [IncomeType.PENSION],
        registerPension: [
          {
            validationId: retainedId,
            pensionType: 'pension',
            pensionFund: 'retained-fund',
            amountPerMonth: '1000',
            paymentFrequency: 'monthly',
            dateFrom: '2026-09-01',
          },
          {
            pensionType: 'pension',
            pensionFund: 'new-fund',
            amountPerMonth: '4000',
            paymentFrequency: 'monthly',
            dateFrom: '2026-09-08',
          },
        ],
      }
      const externalData: ExternalData = {
        income: {
          status: 'success',
          date: new Date(),
          data: {
            pensionPayments: [{ id: retainedId }, { id: removedId }, {}],
          },
        },
      }

      expect(
        buildCreateIncomesRequest(answers, externalData).pensionPayments,
      ).toEqual([
        {
          incomeTypeId: 'pension',
          pensionFundId: 'new-fund',
          estimatedIncome: 4000,
          periodFrom: new Date('2026-09-08'),
          periodTo: null,
        },
        { id: removedId, deleted: true },
      ])
    })

    it('treats removed answer rows as deleted persisted payments', () => {
      const persistedId = 'persisted-pension-id'
      const answers: FormValue = {
        typeOfIncome: [IncomeType.PENSION],
        registerPension: [{ validationId: persistedId, isRemoved: true }],
      }
      const externalData: ExternalData = {
        income: {
          status: 'success',
          date: new Date(),
          data: { pensionPayments: [{ id: persistedId }] },
        },
      }

      expect(
        buildCreateIncomesRequest(answers, externalData).pensionPayments,
      ).toEqual([{ id: persistedId, deleted: true }])
    })

    it('does not reconcile persisted pension payments when pension is not selected', () => {
      const externalData: ExternalData = {
        income: {
          status: 'success',
          date: new Date(),
          data: { pensionPayments: [{ id: 'persisted-pension-id' }] },
        },
      }

      expect(
        buildCreateIncomesRequest({ typeOfIncome: [] }, externalData)
          .pensionPayments,
      ).toBeUndefined()
    })
  })
})
