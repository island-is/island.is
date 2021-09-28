import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/core'
import differenceInDays from 'date-fns/differenceInDays'
import parseISO from 'date-fns/parseISO'
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'
import parse from 'date-fns/parse'

import {
  minPeriodDays,
  usageMaxMonths,
  minimumPeriodStartBeforeExpectedDateOfBirth,
} from '../config'
import { ParentalRelations } from '../constants'
import { answerValidators, VALIDATE_LATEST_PERIOD } from './answerValidators'
import { errorMessages } from './messages'
import { YES, NO, StartDateOptions } from '..'

const dateFormat = 'yyyy-MM-dd'
const DEFAULT_DOB = '2021-01-15'
const DEFAULT_DOB_DATE = new Date(DEFAULT_DOB)

const formatDate = (date: Date) => format(date, dateFormat)
const parseDate = (date: string) => parse(date, dateFormat, new Date(0))

const createBaseApplication = (): Application => ({
  answers: { someAnswer: 'someValue', selectedChild: '0' },
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
})

describe.skip('answerValidators', () => {
  let application: Application

  beforeEach(() => {
    application = createBaseApplication()
  })

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

describe('when constructing a new period', () => {
  let application: Application

  beforeEach(() => {
    application = createBaseApplication()
  })

  const createValidationResultForPeriod = (period: object) =>
    answerValidators[VALIDATE_LATEST_PERIOD]([period], application)

  it('should be required that the answer is an array', () => {
    expect(answerValidators[VALIDATE_LATEST_PERIOD]([], application)).toEqual(
      undefined,
    )

    expect(answerValidators[VALIDATE_LATEST_PERIOD](null, application)).toEqual(
      {
        path: 'periods',
        message: 'Svar þarf að vera listi af tímabilum',
      },
    )
  })

  it('should be allowed to pass an empty array', () => {
    expect(answerValidators[VALIDATE_LATEST_PERIOD]([], application)).toEqual(
      undefined,
    )
  })

  it('should not be allowed to pass in a start date before dob but not further back than minimum', () => {
    const minimumDate = addDays(
      DEFAULT_DOB_DATE,
      -minimumPeriodStartBeforeExpectedDateOfBirth,
    )

    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: formatDate(addDays(minimumDate, 1)),
      }),
    ).toStrictEqual(undefined)

    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: formatDate(addDays(minimumDate, -1)),
      }),
    ).toStrictEqual({
      message: 'Ógild upphafsdagsetning',
      path: 'periods[0].startDate',
      values: undefined,
    })
  })

  it('should not be able to pass in endDate before noting if want to use length or not', () => {
    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: DEFAULT_DOB,
        endDate: formatDate(addDays(DEFAULT_DOB_DATE, 30)),
      }),
    ).toStrictEqual({
      message: 'Ekki tilgreint hvernig eigi að velja endalok tímabils',
      path: 'periods[0].endDate',
      values: undefined,
    })

    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: DEFAULT_DOB,
        useLength: NO,
        endDate: formatDate(addDays(DEFAULT_DOB_DATE, 30)),
      }),
    ).toEqual(undefined)
  })

  it('should not be able to pass in endDate before startDate + minimumPeriodLength', () => {
    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: DEFAULT_DOB,
        useLength: NO,
        endDate: formatDate(addDays(DEFAULT_DOB_DATE, -1)),
      }),
    ).toStrictEqual({
      message: 'Endadagsetning getur ekki verið á undan upphafsdagsetningu',
      path: 'periods[0].endDate',
      values: undefined,
    })

    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: DEFAULT_DOB,
        useLength: NO,
        endDate: formatDate(addDays(DEFAULT_DOB_DATE, 5)),
      }),
    ).toStrictEqual({
      message: 'Tímabil verður of stutt með þessa endadagsetningu',
      path: 'periods[0].endDate',
      values: undefined,
    })

    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: DEFAULT_DOB,
        useLength: NO,
        endDate: formatDate(addDays(DEFAULT_DOB_DATE, 30)),
      }),
    ).toEqual(undefined)
  })

  it('should not be able to pass in endDate with useLength = YES without having a duration', () => {
    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: DEFAULT_DOB,
        useLength: YES,
        endDate: formatDate(addDays(DEFAULT_DOB_DATE, 30)),
      }),
    ).toStrictEqual({
      message: 'Ekki tókst að finna upplýsingar um fjölda mánaða valda',
      path: 'periods[0].endDate',
      values: undefined,
    })
  })

  it('should not be able to pass in endDate more than 2 years from expected date of birth', () => {
    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: DEFAULT_DOB,
        useLength: NO,
        endDate: formatDate(addDays(DEFAULT_DOB_DATE, 30)),
      }),
    ).toEqual(undefined)
  })

  it('should not be able to pass in ratio before saving days and ratio', () => {
    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: DEFAULT_DOB,
        useLength: NO,
        endDate: formatDate(addDays(DEFAULT_DOB_DATE, 30)),
        ratio: '100',
      }),
    ).toStrictEqual({
      message: 'Upplýsingar um fjölda daga sem á að nýta vantar',
      path: 'periods[0].ratio',
      values: undefined,
    })

    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: DEFAULT_DOB,
        useLength: NO,
        endDate: formatDate(addDays(DEFAULT_DOB_DATE, 30)),
        days: '30',
        ratio: '100',
      }),
    ).toStrictEqual({
      message: 'Upplýsingar um mögulega hámarksnýtingu á tímibili vantar',
      path: 'periods[0].ratio',
      values: undefined,
    })

    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: DEFAULT_DOB,
        useLength: NO,
        endDate: formatDate(addDays(DEFAULT_DOB_DATE, 30)),
        days: '30',
        percentage: '100',
        ratio: '100',
      }),
    ).toEqual(undefined)
  })

  it('should not be able to have a higher ratio than percentage', () => {
    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: DEFAULT_DOB,
        useLength: NO,
        endDate: formatDate(addDays(DEFAULT_DOB_DATE, 30)),
        days: '30',
        percentage: '50',
        ratio: '100',
      }),
    ).toStrictEqual({
      message:
        'Nýtingarhlutfall hærra en möguleg hámarksnýting fyrir valið tímabil',
      path: 'periods[0].ratio',
      values: undefined,
    })
  })
})
