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
