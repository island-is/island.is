import addDays from 'date-fns/addDays'
import type { FamilyMember } from '@island.is/api/domains/national-registry'
import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
  ExternalData,
  FormValue,
} from '@island.is/application/core'

import { NO, MANUAL, ParentalRelations } from '../constants'
import { ChildInformation } from '../dataProviders/Children/types'
import {
  formatIsk,
  getAvailableRightsInMonths,
  getExpectedDateOfBirth,
  getSelectedChild,
  getTransferredDays,
  getOtherParentId,
  calculateEndDateForPeriodWithStartAndLength,
  calculatePeriodLengthInMonths,
} from './parentalLeaveUtils'

function buildApplication(data?: {
  answers?: FormValue
  externalData?: ExternalData
  state?: string
}): Application {
  const { answers = {}, externalData = {}, state = 'draft' } = data ?? {}

  return {
    id: '12345',
    assignees: [],
    applicant: '1234567890',
    typeId: ApplicationTypes.PARENTAL_LEAVE,
    created: new Date(),
    modified: new Date(),
    attachments: {},
    answers,
    state,
    externalData,
    status: ApplicationStatus.IN_PROGRESS,
  }
}

describe('getExpectedDateOfBirth', () => {
  it('should return undefined when no child is found', () => {
    const application = buildApplication()
    const res = getExpectedDateOfBirth(application)

    expect(res).toBeUndefined()
  })

  it('should return the selected child expected DOB', () => {
    const application = buildApplication({
      answers: {
        selectedChild: 0,
      },
      externalData: {
        children: {
          data: {
            children: [
              {
                hasRights: true,
                remainingDays: 180,
                transferredDays: undefined, // Transferred days are only defined for secondary parents
                parentalRelation: ParentalRelations.primary,
                expectedDateOfBirth: '2021-05-17',
              },
            ],
            existingApplications: [],
          },
          date: new Date(),
          status: 'success',
        },
      },
    })

    const res = getExpectedDateOfBirth(application)

    expect(res).toEqual('2021-05-17')
  })
})

describe('formatIsk', () => {
  it('should take a number as input and format it following ISK format', () => {
    const res = formatIsk(100000)

    expect(res).toEqual('100.000 kr.')
  })
})

describe('getTransferredDays', () => {
  it('should return the number of days requested by the primary parent', () => {
    const application = buildApplication({
      answers: {
        requestRights: {
          isRequestingRights: 'yes',
          requestDays: 45,
        },
      },
    })

    const child = {
      hasRights: true,
      remainingDays: 180,
      parentalRelation: ParentalRelations.primary,
      expectedDateOfBirth: '2021-05-17',
    } as ChildInformation

    const res = getTransferredDays(application, child)

    expect(res).toEqual(45)
  })

  it('should return the number of days given by the primary parent', () => {
    const application = buildApplication({
      answers: {
        giveRights: {
          isGivingRights: 'yes',
          giveDays: 45,
        },
      },
    })

    const child = {
      hasRights: true,
      remainingDays: 180,
      parentalRelation: ParentalRelations.primary,
      expectedDateOfBirth: '2021-05-17',
    } as ChildInformation

    const res = getTransferredDays(application, child)

    expect(res).toEqual(-45)
  })

  it('should return the number of days given to the secondary parent', () => {
    const application = buildApplication({
      answers: {},
    })

    const child = {
      hasRights: true,
      remainingDays: 180,
      transferredDays: 45,
      parentalRelation: ParentalRelations.secondary,
      expectedDateOfBirth: '2021-05-17',
    } as ChildInformation

    const res = getTransferredDays(application, child)

    expect(res).toEqual(45)
  })
})

describe('getAvailableRightsInMonths', () => {
  it('should return an error when no child is selected', () => {
    const application = buildApplication()

    expect(() => {
      getAvailableRightsInMonths(application)
    }).toThrow('Missing selected child')
  })

  it('should return the number of rights in months for the selected child', () => {
    const application = buildApplication({
      answers: {
        selectedChild: 0,
      },
      externalData: {
        children: {
          data: {
            children: [
              {
                hasRights: true,
                remainingDays: 180,
                parentalRelation: ParentalRelations.primary,
                expectedDateOfBirth: '2021-05-17',
              },
            ],
            existingApplications: [],
          },
          date: new Date(),
          status: 'success',
        },
      },
    })

    const res = getAvailableRightsInMonths(application)

    expect(res).toBe(6)
  })
})

describe('getSelectedChild', () => {
  it('should return null if it cannot find a child', () => {
    const answers = {}
    const externalData = {}
    const res = getSelectedChild(answers, externalData)

    expect(res).toBeNull()
  })

  it('should return the selected child', () => {
    const answers = {
      selectedChild: 0,
    }

    const externalData = {
      children: {
        data: {
          children: [
            {
              hasRights: true,
              remainingDays: 180,
              transferredDays: undefined, // Transferred days are only defined for secondary parents
              parentalRelation: ParentalRelations.primary,
              expectedDateOfBirth: '2021-05-17',
            },
          ],
          existingApplications: [],
        },
        date: new Date(),
        status: 'success',
      },
    } as ExternalData

    const res = getSelectedChild(answers, externalData)

    expect(res).toEqual({
      hasRights: true,
      remainingDays: 180,
      transferredDays: undefined,
      parentalRelation: ParentalRelations.primary,
      expectedDateOfBirth: '2021-05-17',
    })
  })
})

describe('getOtherParentId', () => {
  let id = 0
  const createApplicationBase = (): Application => ({
    answers: {},
    applicant: '',
    assignees: [],
    attachments: {},
    created: new Date(),
    modified: new Date(),
    externalData: {},
    id: (id++).toString(),
    state: '',
    typeId: ApplicationTypes.PARENTAL_LEAVE,
    name: '',
    status: ApplicationStatus.IN_PROGRESS,
  })

  let application: Application
  beforeEach(() => {
    application = createApplicationBase()
  })

  it('should return undefined if no parent is selected', () => {
    application.answers.otherParent = NO

    expect(getOtherParentId(application)).toBeUndefined()
  })

  it('should return answers.otherParentId if manual is selected', () => {
    application.answers.otherParent = MANUAL

    const expectedId = '1234567899'

    application.answers.otherParentId = expectedId

    expect(getOtherParentId(application)).toBe(expectedId)
  })

  it('should return spouse if spouse is selected', () => {
    const expectedSpouse: Pick<
      FamilyMember,
      'fullName' | 'familyRelation' | 'nationalId'
    > = {
      familyRelation: 'spouse' as FamilyMember['familyRelation'],
      fullName: 'Spouse Spouseson',
      nationalId: '1234567890',
    }

    application.externalData.family = {
      data: [expectedSpouse],
      date: new Date(),
      status: 'success',
    }
    application.answers.otherParent = 'spouse'

    expect(getOtherParentId(application)).toBe(expectedSpouse.nationalId)
  })
})

describe('calculateEndDateForPeriodWithStartAndLength', () => {
  it('should calculate month + n and day of month - 1 for whole months', () => {
    expect(
      calculateEndDateForPeriodWithStartAndLength('2021-01-01', 1),
    ).toEqual(new Date(2021, 0, 31))

    expect(
      calculateEndDateForPeriodWithStartAndLength('2021-01-01', 2),
    ).toEqual(new Date(2021, 1, 28))

    expect(
      calculateEndDateForPeriodWithStartAndLength('2021-01-01', 3),
    ).toEqual(new Date(2021, 2, 31))

    expect(
      calculateEndDateForPeriodWithStartAndLength('2021-06-15', 1),
    ).toEqual(new Date(2021, 6, 14))

    expect(
      calculateEndDateForPeriodWithStartAndLength('2021-01-31', 1),
    ).toEqual(new Date(2021, 1, 27))

    expect(
      calculateEndDateForPeriodWithStartAndLength('2021-03-31', 1),
    ).toEqual(new Date(2021, 3, 29))

    expect(
      calculateEndDateForPeriodWithStartAndLength('2021-02-28', 1),
    ).toEqual(new Date(2021, 2, 27))
  })

  it('should calculate month + n and multiply remainder with 28', () => {
    const addWholeMonthsPlusRemainder = (
      startDate: string,
      wholeMonths: number,
      remainder: number,
    ) => {
      const whole = calculateEndDateForPeriodWithStartAndLength(
        startDate,
        wholeMonths,
      )

      return addDays(whole, remainder * 28)
    }

    expect(addWholeMonthsPlusRemainder('2021-01-01', 0, 0.5)).toEqual(
      new Date(2021, 0, 0.5 * 28),
    )

    expect(addWholeMonthsPlusRemainder('2021-01-01', 1, 0.5)).toEqual(
      new Date(2021, 1, 0.5 * 28),
    )

    expect(addWholeMonthsPlusRemainder('2021-01-01', 5, 0.5)).toEqual(
      new Date(2021, 5, 0.5 * 28),
    )

    expect(addWholeMonthsPlusRemainder('2021-02-28', 0, 0.5)).toEqual(
      new Date(2021, 2, 0.5 * 28 - 1),
    )

    expect(addWholeMonthsPlusRemainder('2021-03-01', 0, 0.5)).toEqual(
      new Date(2021, 2, 0.5 * 28),
    )
  })
})

describe('calculatePeriodLengthInMonths', () => {
  it('should calculate whole months correctly', () => {
    expect(
      calculatePeriodLengthInMonths(
        '2021-01-01',
        calculateEndDateForPeriodWithStartAndLength(
          '2021-01-01',
          1,
        ).toISOString(),
      ),
    ).toBe(1)

    expect(
      calculatePeriodLengthInMonths(
        '2021-01-31',
        calculateEndDateForPeriodWithStartAndLength(
          '2021-01-31',
          1,
        ).toISOString(),
      ),
    ).toBe(1)
  })

  it('should calculate half months correctly', () => {
    expect(calculatePeriodLengthInMonths('2021-01-01', '2021-01-14')).toBe(0.5)
    expect(calculatePeriodLengthInMonths('2021-01-14', '2021-01-28')).toBe(0.5)
    expect(calculatePeriodLengthInMonths('2021-01-31', '2021-02-13')).toBe(0.5)
    expect(calculatePeriodLengthInMonths('2021-02-28', '2021-03-13')).toBe(0.5)
    expect(calculatePeriodLengthInMonths('2021-02-28', '2021-03-27')).toBe(1)
    expect(calculatePeriodLengthInMonths('2021-02-28', '2021-04-13')).toBe(1.5)
    expect(calculatePeriodLengthInMonths('2021-02-28', '2021-05-13')).toBe(2.5)
    expect(calculatePeriodLengthInMonths('2021-02-28', '2021-07-13')).toBe(4.5)
    expect(calculatePeriodLengthInMonths('2021-02-28', '2022-07-13')).toBe(16.5)
    expect(calculatePeriodLengthInMonths('2021-03-27', '2021-04-11')).toBe(0.5)
  })
})
