import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/core'
import differenceInDays from 'date-fns/differenceInDays'
import parseISO from 'date-fns/parseISO'

import { minPeriodDays, usageMaxMonths } from '../config'
import { ParentalRelations } from '../constants'
import { answerValidators } from './answerValidators'
import { errorMessages } from './messages'

const DEFAULT_DOB = '2021-01-15'

describe('answerValidators', () => {
  const application: Application = {
    answers: { someAnswer: 'awesome', selectedChild: '0' },
    assignees: [],
    applicant: '',
    attachments: {},
    created: new Date(),
    externalData: {
      children: {
        date: new Date(),
        status: 'success',
        data: {
          children: [
            {
              expectedDateOfBirth: DEFAULT_DOB,
              parentalRelation: ParentalRelations.primary,
            },
          ],
        },
      },
    },
    id: '',
    modified: new Date(),
    state: '',
    typeId: ApplicationTypes.EXAMPLE,
    status: ApplicationStatus.IN_PROGRESS,
  }

  it('should return error when DOB is undefined', () => {
    const newApplication = {
      ...application,
      externalData: {
        ...application.externalData,
        children: {
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

  it('should return error for a period with undefined startDate and undefined endDate', () => {
    const newAnswers = [{}]

    expect(answerValidators['periods'](newAnswers, application)).toStrictEqual({
      message: errorMessages.periodsStartDateRequired,
      path: 'periods[0].startDate',
      values: undefined,
    })
  })

  it('should return error for a period with estimatedDateOfBirth startDate and undefined endDate', () => {
    const newAnswers = [{}]

    const newApplication = {
      ...application,
      answers: {
        ...application.answers,
        firstPeriodStart: 'estimatedDateOfBirth',
      },
    } as Application

    expect(
      answerValidators['periods'](newAnswers, newApplication),
    ).toStrictEqual({
      message: errorMessages.periodsEndDateRequired,
      path: 'periods[0].endDate',
      values: undefined,
    })
  })

  it('should return error for a (2nd or later) period that is empty (ex: they try to continue with empty startDate)', () => {
    const newAnswers = [
      { startDate: '2021-06-01', endDate: '2021-07-01', ratio: '100' },
      {},
    ]
    const newApplication = {
      ...application,
      answers: {
        ...application.answers,
        periods: [
          { ratio: '100', endDate: '2021-07-01', startDate: '2021-06-01' },
        ],
      },
    } as Application

    expect(
      answerValidators['periods'](newAnswers, newApplication),
    ).toStrictEqual(undefined)
  })

  it('should return error for a 2nd (or later) period with a startDate but with endDate undefined)', () => {
    const newAnswers = [
      { ratio: '100', endDate: '2021-07-01', startDate: '2021-06-01' },
      { startDate: '2021-07-15' },
    ]
    const newApplication = {
      ...application,
      answers: {
        ...application.answers,
        periods: [
          { ratio: '100', endDate: '2021-07-01', startDate: '2021-06-01' },
          { startDate: '2021-07-15' },
        ],
        firstPeriodStart: 'estimatedDateOfBirth',
      },
    } as Application

    expect(
      answerValidators['periods'](newAnswers, newApplication),
    ).toStrictEqual({
      message: errorMessages.periodsEndDateRequired,
      path: 'periods[1].endDate',
      values: undefined,
    })
  })

  it('should return an error if startDate is more than 1 month before DOB', () => {
    const newAnswers = [{ startDate: '2020-12-01' }]

    expect(answerValidators['periods'](newAnswers, application)).toStrictEqual({
      message: errorMessages.periodsStartDateBeforeDob,
      path: 'periods[0].startDate',
      values: undefined,
    })
  })

  it(`shouldn't return an error if startDate is less than 1 month before DOB`, () => {
    const newAnswers = [{ startDate: '2021-01-12' }]

    expect(answerValidators['periods'](newAnswers, application)).toBeUndefined()
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
