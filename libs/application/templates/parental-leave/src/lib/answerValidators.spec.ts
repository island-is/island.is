import {
  ApplicationWithAttachments as Application,
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'
import format from 'date-fns/format'

import { minimumPeriodStartBeforeExpectedDateOfBirth } from '../config'
import { MANUAL, ParentalRelations } from '../constants'
import { answerValidators } from './answerValidators'
import { errorMessages } from './messages'
import { StartDateOptions, AnswerValidationConstants } from '../constants'
import { NO, YES } from '@island.is/application/core'

const { VALIDATE_LATEST_PERIOD } = AnswerValidationConstants

const dateFormat = 'yyyy-MM-dd'
const DEFAULT_DOB = '2021-01-15'
const DEFAULT_DOB_DATE = new Date(DEFAULT_DOB)

const formatDate = (date: Date) => format(date, dateFormat)

const createBaseApplication = (): Application => ({
  answers: {
    someAnswer: 'someValue',
    selectedChild: '0',
    applicationType: { option: 'parentalLeave' },
  },
  assignees: [],
  applicant: '',
  attachments: {},
  applicantActors: [],
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
  typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
  status: ApplicationStatus.IN_PROGRESS,
})

describe('answerValidators', () => {
  let application: Application

  beforeEach(() => {
    application = createBaseApplication()
  })

  it('should return an error if startDate is more than 1 month before DOB', () => {
    const newAnswers = [
      {
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: '2020-12-01',
      },
    ]

    expect(answerValidators['periods'](newAnswers, application)).toStrictEqual({
      message: errorMessages.periodsStartDate,
      path: 'periods[0].startDate',
      values: {},
    })
  })

  it(`shouldn't return an error if startDate is less than 1 month before DOB`, () => {
    const newAnswers = [
      {
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: '2021-01-12',
      },
    ]

    expect(answerValidators['periods'](newAnswers, application)).toBeUndefined()
  })

  it('should return error for startDate after maximum months period', () => {
    const newAnswers = [
      {
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: '2025-01-29',
      },
    ]

    expect(answerValidators['periods'](newAnswers, application)).toStrictEqual({
      message: errorMessages.periodsPeriodRange,
      path: 'periods[0].startDate',
      values: { usageMaxMonths: 23.5 },
    })
  })

  describe('requestRights', () => {
    it('should return error if not using all "common" days from multipleBirths and request more days', () => {
      const newAnswer = {
        isRequestingRights: YES,
        requestDays: 14,
      }

      const appAnswers = {
        ...application.answers,
        multipleBirthsRequestDays: 30,
        multipleBirths: {
          hasMultipleBirths: YES,
          multipleBirths: 2,
        },
      }

      const newApplication = {
        ...application,
        answers: appAnswers,
      }

      expect(
        answerValidators['requestRights'](newAnswer, newApplication),
      ).toStrictEqual({
        message: errorMessages.notAllowedToRequestRights,
        path: 'transferRights',
        values: undefined,
      })
    })

    it('should return not error if using all "common" days from multipleBirths and request more days', () => {
      const newAnswer = {
        isRequestingRights: YES,
        requestDays: 14,
      }

      const appAnswers = {
        ...application.answers,
        multipleBirthsRequestDays: 180,
        multipleBirths: {
          hasMultipleBirths: YES,
          multipleBirths: 2,
        },
      }

      const newApplication = {
        ...application,
        answers: appAnswers,
      }

      expect(
        answerValidators['requestRights'](newAnswer, newApplication),
      ).toStrictEqual(undefined)
    })
  })

  describe('giveRights', () => {
    it('should return error if not using all "common" days from multipleBirths and giving days', () => {
      const newAnswer = {
        isGivingRights: YES,
        giveDays: 14,
      }

      const appAnswers = {
        ...application.answers,
        multipleBirthsRequestDays: 30,
        multipleBirths: {
          hasMultipleBirths: YES,
          multipleBirths: 2,
        },
      }

      const newApplication = {
        ...application,
        answers: appAnswers,
      }

      expect(
        answerValidators['giveRights'](newAnswer, newApplication),
      ).toStrictEqual({
        message: errorMessages.notAllowedToGiveRights,
        path: 'transferRights',
        values: undefined,
      })
    })

    it('should return not error if using 0 "common" days from multipleBirths and giving days', () => {
      const newAnswer = {
        isGivingRights: YES,
        giveDays: 14,
      }

      const appAnswers = {
        ...application.answers,
        multipleBirthsRequestDays: 0,
        multipleBirths: {
          hasMultipleBirths: YES,
          multipleBirths: 2,
        },
      }

      const newApplication = {
        ...application,
        answers: appAnswers,
      }

      expect(
        answerValidators['giveRights'](newAnswer, newApplication),
      ).toStrictEqual(undefined)
    })

    it('should return error if other parent MANUAL, not otherParentRightOfAccess and giving days', () => {
      const newAnswer = {
        isGivingRights: YES,
        giveDays: 14,
      }

      const appAnswers = {
        ...application.answers,
        otherParentRightOfAccess: NO,
        otherParentObj: {
          chooseOtherParent: MANUAL,
          otherParentName: 'Spouse Spousson',
          otherParentId: '',
        },
      }

      const newApplication = {
        ...application,
        answers: appAnswers,
      }

      expect(
        answerValidators['giveRights'](newAnswer, newApplication),
      ).toStrictEqual({
        message: errorMessages.notAllowedToGiveRightsOtherParentNotAllowed,
        path: 'transferRights',
        values: undefined,
      })
    })

    it('should return not error if other parent MANUAL, otherParentRightOfAccess and giving days', () => {
      const newAnswer = {
        isGivingRights: YES,
        giveDays: 14,
      }

      const appAnswers = {
        ...application.answers,
        otherParentRightOfAccess: YES,
        otherParentObj: {
          chooseOtherParent: MANUAL,
          otherParentName: 'Spouse Spousson',
          otherParentId: '',
        },
      }

      const newApplication = {
        ...application,
        answers: appAnswers,
      }

      expect(
        answerValidators['giveRights'](newAnswer, newApplication),
      ).toStrictEqual(undefined)
    })
  })
})

describe('when constructing a new period', () => {
  let application: Application

  beforeEach(() => {
    application = createBaseApplication()
  })

  const createValidationResultForPeriod = (period: Record<string, unknown>) =>
    answerValidators[VALIDATE_LATEST_PERIOD]([period], application)

  it('should be required that the answer is an array', () => {
    expect(answerValidators[VALIDATE_LATEST_PERIOD]([], application)).toEqual(
      undefined,
    )

    expect(answerValidators[VALIDATE_LATEST_PERIOD](null, application)).toEqual(
      {
        path: 'periods',
        message: errorMessages.periodsNotAList,
      },
    )
  })

  it('should be allowed to pass an empty array', () => {
    expect(answerValidators[VALIDATE_LATEST_PERIOD]([], application)).toEqual(
      undefined,
    )
  })

  it('should not be allowed to pass without providing a start date', () => {
    expect(
      createValidationResultForPeriod({
        startDate: null,
      }),
    ).toEqual({
      message: errorMessages.periodsStartMissing,
      path: 'periods[0].startDate',
      values: undefined,
    })
  })

  it('should not be allowed to pass without providing a use length option', () => {
    expect(
      createValidationResultForPeriod({
        startDate: DEFAULT_DOB_DATE,
        useLength: null,
      }),
    ).toEqual({
      message: errorMessages.periodsUseLengthMissing,
      path: 'periods[0].useLength',
      values: undefined,
    })
  })

  it('should not be allowed to pass without providing an end date', () => {
    expect(
      createValidationResultForPeriod({
        startDate: DEFAULT_DOB_DATE,
        useLength: NO,
        endDate: null,
      }),
    ).toEqual({
      message: errorMessages.periodsEndDateRequired,
      path: 'periods[0].endDate',
      values: undefined,
    })
  })

  it('should not be allowed to pass without providing a ratio', () => {
    expect(
      createValidationResultForPeriod({
        startDate: DEFAULT_DOB_DATE,
        useLength: NO,
        endDate: formatDate(addDays(DEFAULT_DOB_DATE, 30)),
        ratio: null,
      }),
    ).toEqual({
      message: errorMessages.periodsRatioMissing,
      path: 'periods[0].ratio',
      values: undefined,
    })
  })

  it('should not be allowed to pass in a start date before dob but not further back than minimum', () => {
    const minimumDate = addMonths(
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
      message: errorMessages.periodsStartDate,
      path: 'periods[0].startDate',
      values: {},
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
      message: errorMessages.periodsEndDateDefinitionMissing,
      path: 'periods[0].endDate',
      values: {},
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
      message: errorMessages.periodsEndDateBeforeStartDate,
      path: 'periods',
      values: {},
    })

    // expect(
    //   createValidationResultForPeriod({
    //     firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
    //     startDate: DEFAULT_DOB,
    //     useLength: NO,
    //     endDate: formatDate(addDays(DEFAULT_DOB_DATE, 5)),
    //   }),
    // ).toStrictEqual(undefined)

    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: DEFAULT_DOB,
        useLength: NO,
        endDate: formatDate(addDays(DEFAULT_DOB_DATE, 30)),
      }),
    ).toEqual(undefined)
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

  it('should not be able to pass in ratio before start and end dates', () => {
    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        useLength: NO,
        endDate: formatDate(addDays(DEFAULT_DOB_DATE, 30)),
        ratio: '100',
      }),
    ).toStrictEqual({
      message: errorMessages.periodsStartMissing,
      path: 'periods[0].startDate',
      values: {},
    })

    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: formatDate(addDays(DEFAULT_DOB_DATE, 10)),
        useLength: NO,
        ratio: '100',
      }),
    ).toStrictEqual({
      message: errorMessages.periodsEndDateRequired,
      path: 'periods[0].ratio',
      values: {},
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

  it('should not be able to have a lower ratio than 1%', () => {
    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: DEFAULT_DOB,
        useLength: NO,
        endDate: formatDate(addDays(DEFAULT_DOB_DATE, 30)),
        days: '30',
        percentage: '50',
        ratio: '0',
      }),
    ).toStrictEqual({
      message: errorMessages.periodsRatioBelowMinimum,
      path: 'periods[0].ratio',
      values: {},
    })
  })
})
