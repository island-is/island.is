import { Application, ApplicationTypes } from '@island.is/application/core'
import differenceInDays from 'date-fns/differenceInDays'
import parseISO from 'date-fns/parseISO'

import { minPeriodDays, usageMaxMonths } from '../config'
import { answerValidators } from './answerValidators'
import { errorMessages } from './messages'

describe('answerValidators', () => {
  const application: Application = {
    answers: { someAnswer: 'awesome' },
    assignees: [],
    applicant: '',
    attachments: {},
    created: new Date(),
    externalData: {
      pregnancyStatus: {
        date: new Date(),
        status: 'success',
        data: {
          hasActivePregnancy: true,
          pregnancyDueDate: '2021-01-15',
        },
      },
    },
    id: '',
    modified: new Date(),
    state: '',
    typeId: ApplicationTypes.EXAMPLE,
  }

  it('should return error when DOB is undefined', () => {
    const newApplication = {
      ...application,
      externalData: {
        ...application.externalData,
        parentalLeaves: {
          date: new Date(),
          reason: 'Sync failed',
          status: 'failure',
        },
        pregnancyStatus: {
          date: new Date(),
          reason: 'Sync failed',
          status: 'failure',
        },
      },
    } as Application

    const newAnswers = 'specificDate'

    expect(
      answerValidators['firstPeriodStart'](newAnswers, newApplication),
    ).toStrictEqual({
      message: errorMessages.dateOfBirth,
      path: 'firstPeriodStart',
      values: undefined,
    })
  })

  it('should return error for startDate before DOB', () => {
    const newAnswers = [{ startDate: '2021-01-12' }]

    expect(answerValidators['periods'](newAnswers, application)).toStrictEqual({
      message: errorMessages.periodsStartDateBeforeDob,
      path: 'periods[0].startDate',
      values: undefined,
    })
  })

  it('should return error for startDate after maximum months period', () => {
    const newAnswers = [{ startDate: '2025-01-29' }]

    expect(answerValidators['periods'](newAnswers, application)).toStrictEqual({
      message: errorMessages.periodsPeriodRange,
      path: 'periods[0].startDate',
      values: { usageMaxMonths },
    })
  })

  it('should return error for endDate before startDate', () => {
    const newAnswers = [{ startDate: '2021-01-29', endDate: '2021-01-20' }]

    expect(answerValidators['periods'](newAnswers, application)).toStrictEqual({
      message: errorMessages.periodsEndDateBeforeStartDate,
      path: 'periods[0].endDate',
      values: undefined,
    })
  })

  it('should return error if the endDate is before or less than 14 days from the DOB when the startDate is undefined', () => {
    const newAnswers = [{ endDate: '2021-01-20' }]

    expect(answerValidators['periods'](newAnswers, application)).toStrictEqual({
      message: errorMessages.periodsEndDate,
      path: 'periods[0].endDate',
      values: { minPeriodDays },
    })
  })

  it('should return error for endDate before minimum days', () => {
    const newAnswers = [
      { startDate: '2021-01-29', endDate: '2021-02-04', ratio: '100' },
    ]

    expect(answerValidators['periods'](newAnswers, application)).toStrictEqual({
      message: errorMessages.periodsEndDateMinimumPeriod,
      path: 'periods[0].endDate',
      values: { minPeriodDays },
    })
  })

  it('should return error for ratio of days less than minimum days', () => {
    const startDate = '2021-01-29'
    const endDate = '2021-02-16'
    const ratio = 25
    const newAnswers = [{ startDate, endDate, ratio }]
    const diff = differenceInDays(parseISO(endDate), parseISO(startDate))
    const diffWithRatio = (diff * ratio) / 100

    expect(answerValidators['periods'](newAnswers, application)).toStrictEqual({
      message: errorMessages.periodsRatio,
      path: 'periods[0].ratio',
      values: {
        minPeriodDays,
        diff,
        ratio,
        diffWithRatio,
      },
    })
  })
})
