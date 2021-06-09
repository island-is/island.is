import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
  buildTextField,
  ExternalData,
  FormValue,
} from '@island.is/application/core'

import { ParentalRelations } from './constants'
import { ChildInformation } from './dataProviders/Children/types'
import {
  calculatePeriodPercentage,
  formatIsk,
  getAvailableRightsInMonths,
  getExpectedDateOfBirth,
  getSelectedChild,
  getTransferredDays,
  updateComputedRights,
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
                transferredDays: 45,
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

describe('getNameAndIdOfSpouse', () => {})

describe('getEstimatedMonthlyPay', () => {})

describe('formatPeriods', () => {})

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

describe('getOtherParentOptions', () => {})

describe('getAllPeriodDates', () => {})

describe('createRange', () => {})

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
              transferredDays: 45,
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
      transferredDays: 45,
      parentalRelation: ParentalRelations.primary,
      expectedDateOfBirth: '2021-05-17',
    })
  })
})

describe('isEligibleForParentalLeave', () => {})

describe('calculatePeriodPercentage', () => {
  it('should return 100% when under the maximum amount of months', () => {
    const application = buildApplication({
      answers: {
        selectedChild: 0,
        periods: [
          {
            startDate: '2021-01-01',
            endDate: '2021-04-01',
          },
        ],
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

    const res = calculatePeriodPercentage(application, {
      ...buildTextField({
        id: 'periods[0].startDate',
        title: '',
      }),
    })

    expect(res).toEqual(100)
  })

  it('should return 75% when number of months used is above limit using default dates', () => {
    const application = buildApplication({
      answers: {
        selectedChild: 0,
        periods: [],
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

    const res = calculatePeriodPercentage(
      application,
      {
        ...buildTextField({
          id: 'periods[0].startDate',
          title: '',
        }),
      },
      {
        startDate: '2021-01-01',
        endDate: '2021-09-01',
      },
    )

    expect(res).toEqual(75)
  })

  it('should return 75% when number of months used is above limit', () => {
    const application = buildApplication({
      answers: {
        selectedChild: 0,
        periods: [
          {
            startDate: '2021-01-01',
            endDate: '2021-09-01',
          },
        ],
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

    const res = calculatePeriodPercentage(application, {
      ...buildTextField({
        id: 'periods[0].startDate',
        title: '',
      }),
    })

    expect(res).toEqual(75)
  })
})

describe('updateComputedRights', () => {
  it('should return an object containing the days to consume', () => {
    const daysWithPercent = 180 // 6 months at 100%
    const personal = 180 // Default rights for an applicant
    const extra = 0 // No requested or given days
    const res = updateComputedRights(daysWithPercent, { personal, extra })

    console.log('-res', res)
  })

  it('should return the periods', () => {
    const daysWithPercent = 225 // 7.5 months at 100%
    const personal = 180 // Default rights for an applicant
    const extra = 45 // Given by other parent
    const res = updateComputedRights(daysWithPercent, { personal, extra })
  })
})

describe('new fn', () => {
  it('should work', () => {
    const startDate = new Date(2021, 0, 1)
    const endDate = new Date(2021, 6, 1)
    const ratio = 100
  })
})
