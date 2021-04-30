import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/core'
import differenceInDays from 'date-fns/differenceInDays'
import parseISO from 'date-fns/parseISO'

import { minPeriodDays, usageMaxMonths } from '../config'
import { answerValidators } from './answerValidators'

describe('answerValidators', () => {
  const application: Application = {
    answers: { someAnswer: 'awesome' },
    assignees: [],
    applicant: '',
    attachments: {},
    created: new Date(),
    externalData: {
      pregnancyStatusAndRights: {
        date: new Date(),
        status: 'success',
        data: {
          pregnancyStatus: {
            hasActivePregnancy: true,
            pregnancyDueDate: '2021-01-15',
          },
          parentalLeaves: [],
        },
      },
    },
    id: '',
    modified: new Date(),
    state: '',
    typeId: ApplicationTypes.EXAMPLE,
    status: ApplicationStatus.IN_PROGRESS,
  }

  it.skip('should return error when DOB is undefined', () => {
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
      message:
        'We haven’t been able to fetch automatically the date of birth for your baby. Please try again later.',
      path: 'firstPeriodStart',
    })
  })

  it('should return error for startDate before DOB', () => {
    const newAnswers = [{ startDate: '2021-01-12' }]

    expect(answerValidators['periods'](newAnswers, application)).toStrictEqual({
      message: 'Start date cannot be before expected date of birth.',
      path: 'periods[0].startDate',
    })
  })

  it('should return error for startDate after maximum months period', () => {
    const newAnswers = [{ startDate: '2025-01-29' }]

    expect(answerValidators['periods'](newAnswers, application)).toStrictEqual({
      message: `You can't apply for a period beyond ${usageMaxMonths} months from the DOB.`,
      path: 'periods[0].startDate',
    })
  })

  it('should return error for endDate before startDate', () => {
    const newAnswers = [{ startDate: '2021-01-29', endDate: '2021-01-20' }]

    expect(answerValidators['periods'](newAnswers, application)).toStrictEqual({
      message: 'End date cannot be before the start date.',
      path: 'periods[0].endDate',
    })
  })

  it('should return error if the endDate is before or less than 14 days from the DOB when the startDate is undefined', () => {
    const newAnswers = [{ endDate: '2021-01-20' }]

    expect(answerValidators['periods'](newAnswers, application)).toStrictEqual({
      message: `End date cannot be less than the ${minPeriodDays} days from the date of birth.`,
      path: 'periods[0].endDate',
    })
  })

  it('should return error for endDate before minimum days', () => {
    const newAnswers = [
      { startDate: '2021-01-29', endDate: '2021-02-04', ratio: '100' },
    ]

    expect(answerValidators['periods'](newAnswers, application)).toStrictEqual({
      message: `You cannot apply for a period shorter than ${minPeriodDays} days.`,
      path: 'periods[0].endDate',
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
      message: `The minimum is ${minPeriodDays} days of leave, you've chosen ${diff} days at ${ratio}% which ends up as only ${diffWithRatio} days leave.`,
      path: 'periods[0].ratio',
    })
  })
})
