import set from 'lodash/set'
import addDays from 'date-fns/addDays'
import {
  ApplicationWithAttachments as Application,
  ApplicationStatus,
  ApplicationTypes,
  ExternalData,
  Field,
  FieldComponents,
  FieldTypes,
  FormValue,
} from '@island.is/application/types'

import {
  MANUAL,
  SINGLE,
  SPOUSE,
  ParentalRelations,
  ADOPTION,
  States,
  FileType,
} from '../constants'
import { ChildInformation } from '../dataProviders/Children/types'
import {
  formatIsk,
  getAvailableRightsInMonths,
  getExpectedDateOfBirthOrAdoptionDateOrBirthDate,
  getSelectedChild,
  getTransferredDays,
  getOtherParentId,
  calculateEndDateForPeriodWithStartAndLength,
  calculatePeriodLengthInMonths,
  applicantIsMale,
  getOtherParentName,
  getSpouse,
  isEligibleForParentalLeave,
  getPeriodIndex,
  getApplicationExternalData,
  requiresOtherParentApproval,
  getMaxMultipleBirthsDays,
  getMultipleBirthsDays,
  getMultipleBirthRequestDays,
  getMaxMultipleBirthsInMonths,
  getMaxMultipleBirthsAndDefaultMonths,
  getAvailablePersonalRightsInDays,
  getAvailableRightsInDays,
  getAvailablePersonalRightsInMonths,
  getAdditionalSingleParentRightsInDays,
  allowOtherParentToUsePersonalAllowance,
  getAvailablePersonalRightsSingleParentInMonths,
  isParentWithoutBirthParent,
  isNotEligibleForParentWithoutBirthParent,
  isFosterCareAndAdoption,
  residentGrantIsOpenForApplication,
  setTestBirthAndExpectedDate,
  getActionName,
} from './parentalLeaveUtils'
import { PersonInformation } from '../types'
import { NO, YES } from '@island.is/application/core'

const buildApplication = (data?: {
  answers?: FormValue
  externalData?: ExternalData
  state?: string
}): Application => {
  const { answers = {}, externalData = {}, state = 'draft' } = data ?? {}

  return {
    id: '12345',
    assignees: [],
    applicant: '1234567890',
    typeId: ApplicationTypes.PARENTAL_LEAVE,
    created: new Date(),
    modified: new Date(),
    attachments: {},
    applicantActors: [],
    answers,
    state,
    externalData,
    status: ApplicationStatus.IN_PROGRESS,
  }
}

const buildField = (): Field => {
  return {
    type: FieldTypes.TEXT,
    component: FieldComponents.TEXT,
    id: 'periods',
    title: 'fieldTitle',
    children: undefined,
  }
}

let id = 0
const createApplicationBase = (): Application => ({
  answers: {},
  applicant: '',
  assignees: [],
  attachments: {},
  created: new Date(),
  modified: new Date(),
  applicantActors: [],
  externalData: {},
  id: (id++).toString(),
  state: '',
  typeId: ApplicationTypes.PARENTAL_LEAVE,
  name: '',
  status: ApplicationStatus.IN_PROGRESS,
})

describe('getExpectedDateOfBirthOrAdoptionDateOrBirthDate', () => {
  it('should return undefined when no child is found', () => {
    const application = buildApplication()
    const res = getExpectedDateOfBirthOrAdoptionDateOrBirthDate(application)

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

    const res = getExpectedDateOfBirthOrAdoptionDateOrBirthDate(application)

    expect(res).toEqual('2021-05-17')
  })

  it('should return the selected child DOB', () => {
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
        dateOfBirth: {
          data: {
            dateOfBirth: '2021-05-10',
          },
          date: new Date(),
          status: 'success',
        },
      },
    })

    const res = getExpectedDateOfBirthOrAdoptionDateOrBirthDate(application)

    expect(res).toEqual('2021-05-10')
  })

  it('should return the selected child adoption date if adoption', () => {
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
                expectedDateOfBirth: '',
                adoptionDate: '2021-05-17',
                dateOfBirth: '2021-01-01',
              },
            ],
            existingApplications: [],
          },
          date: new Date(),
          status: 'success',
        },
        dateOfBirth: {
          data: {
            dateOfBirth: '2021-01-01',
          },
          date: new Date(),
          status: 'success',
        },
      },
    })

    const res = getExpectedDateOfBirthOrAdoptionDateOrBirthDate(application)

    expect(res).toEqual('2021-05-17')
  })
})

describe('isFosterCareAndAdoption', () => {
  it('should return true if application is due to adoption for primary parent', () => {
    const application = buildApplication({
      answers: {
        noChildrenFound: {
          typeOfApplication: ADOPTION,
        },
        selectedChild: 0,
      },
      externalData: {
        children: {
          data: {
            children: [
              {
                hasRights: true,
                remainingDays: 180,
                transferredDays: undefined,
                parentalRelation: 'primary',
                expectedDateOfBirth: '2022-12-20',
              },
            ],
            existingApplications: [],
          },
          date: new Date('2022-11-07T20:05:46.422Z'),
          status: 'success',
        },
      },
    })

    expect(isFosterCareAndAdoption(application)).toBe(true)
  })

  it('should return true if application is due to adoption for secondary parent', () => {
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
                transferredDays: 0,
                parentalRelation: 'secondary',
                expectedDateOfBirth: '2022-12-20',
                primaryParentNationalRegistryId: '1111111119',
                primaryParentGenderCode: '1',
                primaryParentTypeOfApplication: ADOPTION,
              },
            ],
            existingApplications: [],
          },
          date: new Date('2022-11-07T20:05:46.422Z'),
          status: 'success',
        },
      },
    })

    expect(isFosterCareAndAdoption(application)).toBe(true)
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

describe('getMultipleBirthsDays', () => {
  it('should return the number of multiple days of other parent', () => {
    const application = buildApplication({
      answers: {
        multipleBirthsRequestDays: 80,
        selectedChild: 0,
      },
      externalData: {
        children: {
          data: {
            children: [
              {
                hasRights: true,
                remainingDays: 235,
                multipleBirthsDays: 55,
                transferredDays: -14,
                parentalRelation: 'secondary',
                expectedDateOfBirth: '2022-12-20',
              },
            ],
            existingApplications: [],
          },
          date: new Date('2022-11-07T20:05:46.422Z'),
          status: 'success',
        },
      },
    })

    const res = getMultipleBirthsDays(application)

    expect(res).toEqual(55)
  })

  it('should return the number of multiple days of primary parent', () => {
    const application = buildApplication({
      answers: {
        multipleBirthsRequestDays: 80,
        selectedChild: 0,
        multipleBirths: {
          hasMultipleBirths: YES,
        },
      },
      externalData: {
        children: {
          data: {
            children: [
              {
                hasRights: true,
                transferredDays: -14,
                parentalRelation: 'primary',
                expectedDateOfBirth: '2022-12-20',
              },
            ],
            existingApplications: [],
          },
          date: new Date('2022-11-07T20:05:46.422Z'),
          status: 'success',
        },
      },
    })

    const res = getMultipleBirthsDays(application)

    expect(res).toEqual(80)
  })
})

describe('getMultipleBirthRequestDays', () => {
  it('should return the number of multiple request days of primary parent', () => {
    const application = buildApplication({
      answers: {
        multipleBirthsRequestDays: 80,
        selectedChild: 0,
        multipleBirths: {
          hasMultipleBirths: YES,
        },
      },
    })

    const res = getMultipleBirthRequestDays(application.answers)

    expect(res).toEqual(80)
  })
})

describe('getMaxMultipleBirthsDays', () => {
  it('should return the number of maximum multiple request days for 2 children', () => {
    const application = buildApplication({
      answers: {
        multipleBirths: {
          hasMultipleBirths: YES,
          multipleBirths: 2,
        },
      },
    })

    const res = getMaxMultipleBirthsDays(application.answers)

    expect(res).toEqual(180)
  })

  it('should return the number of maximum multiple request days for 3 children', () => {
    const application = buildApplication({
      answers: {
        selectedChild: 0,
        multipleBirths: {
          hasMultipleBirths: YES,
          multipleBirths: 3,
        },
      },
    })

    const res = getMaxMultipleBirthsDays(application.answers)

    expect(res).toEqual(360)
  })
})

describe('getMaxMultipleBirthsInMonths', () => {
  it('should return the number of max multiple births days', () => {
    const application = buildApplication({
      answers: {
        selectedChild: 0,
        multipleBirths: {
          hasMultipleBirths: YES,
          multipleBirths: 2,
        },
      },
    })

    const res = getMaxMultipleBirthsInMonths(application.answers)

    expect(res).toEqual(6)
  })
})

describe('getMaxMultipleBirthsAndDefaultMonths', () => {
  it('should return the number of months from max multiple births and default days', () => {
    const application = buildApplication({
      answers: {
        selectedChild: 0,
        multipleBirths: {
          hasMultipleBirths: YES,
          multipleBirths: 2,
        },
      },
    })

    const res = getMaxMultipleBirthsAndDefaultMonths(application.answers)

    expect(res).toEqual(12)
  })
})

describe('getAvailableRightsInDays', () => {
  it('should return the number of available right with multiple births and request days for primary parent', () => {
    const application = buildApplication({
      answers: {
        selectedChild: 0,
        multipleBirthsRequestDays: 180,
        multipleBirths: {
          hasMultipleBirths: YES,
          multipleBirths: 2,
        },
        requestRights: {
          isRequestingRights: YES,
          requestDays: 30,
        },
      },
      externalData: {
        children: {
          data: {
            children: [
              {
                hasRights: true,
                remainingDays: 180,
                transferredDays: 30,
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

    const res = getAvailableRightsInDays(application)

    expect(res).toBe(390)
  })

  it('should return the number of available right with multiple births and giving days for primary parent', () => {
    const application = buildApplication({
      answers: {
        selectedChild: 0,
        multipleBirthsRequestDays: 0,
        multipleBirths: {
          hasMultipleBirths: YES,
          multipleBirths: 2,
        },
        giveRights: {
          isGivingRights: YES,
          giveDays: 30,
        },
      },
      externalData: {
        children: {
          data: {
            children: [
              {
                hasRights: true,
                remainingDays: 180,
                transferredDays: -30,
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

    const res = getAvailableRightsInDays(application)

    expect(res).toBe(150)
  })

  it('should return the number of available right with request days for primary parent', () => {
    const application = buildApplication({
      answers: {
        selectedChild: 0,
        requestRights: {
          isRequestingRights: YES,
          requestDays: 30,
        },
      },
      externalData: {
        children: {
          data: {
            children: [
              {
                hasRights: true,
                remainingDays: 180,
                transferredDays: 30,
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

    const res = getAvailableRightsInDays(application)

    expect(res).toBe(210)
  })

  it('should return the number of available right with request days for secondary parent', () => {
    const application = buildApplication({
      answers: {
        selectedChild: 0,
        requestRights: {
          isRequestingRights: YES,
          requestDays: 30,
        },
      },
      externalData: {
        children: {
          data: {
            children: [
              {
                hasRights: true,
                remainingDays: 210,
                transferredDays: 30,
                parentalRelation: ParentalRelations.secondary,
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

    const res = getAvailableRightsInDays(application)

    expect(res).toBe(210)
  })

  it('should return the number of available right with multiple births and giving days for secondary parent', () => {
    const application = buildApplication({
      answers: {
        selectedChild: 0,
        giveRights: {
          isGivingRights: YES,
          giveDays: 30,
        },
      },
      externalData: {
        children: {
          data: {
            children: [
              {
                hasRights: true,
                remainingDays: 150,
                transferredDays: -30,
                parentalRelation: ParentalRelations.secondary,
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

    const res = getAvailableRightsInDays(application)

    expect(res).toBe(150)
  })
})

describe('getAvailablePersonalRightsInDays', () => {
  it('should return the number of available right with multiple births and request days for primary parent', () => {
    const application = buildApplication({
      answers: {
        selectedChild: 0,
        multipleBirthsRequestDays: 90,
        multipleBirths: {
          hasMultipleBirths: YES,
          multipleBirths: 2,
        },
        requestRights: {
          isRequestingRights: YES,
          requestDays: 30,
        },
      },
      externalData: {
        children: {
          data: {
            children: [
              {
                hasRights: true,
                remainingDays: 180,
                transferredDays: 30,
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

    const res = getAvailablePersonalRightsInDays(application)

    expect(res).toBe(180)
  })

  it('should return the number of available right with multiple births and giving days for primary parent', () => {
    const application = buildApplication({
      answers: {
        selectedChild: 0,
        multipleBirthsRequestDays: 0,
        multipleBirths: {
          hasMultipleBirths: YES,
          multipleBirths: 2,
        },
        giveRights: {
          isGivingRights: YES,
          giveDays: 30,
        },
      },
      externalData: {
        children: {
          data: {
            children: [
              {
                hasRights: true,
                remainingDays: 180,
                transferredDays: -30,
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

    const res = getAvailablePersonalRightsInDays(application)

    expect(res).toBe(180)
  })

  it('should return the number of available right with request days for primary parent', () => {
    const application = buildApplication({
      answers: {
        selectedChild: 0,
        requestRights: {
          isRequestingRights: YES,
          requestDays: 30,
        },
      },
      externalData: {
        children: {
          data: {
            children: [
              {
                hasRights: true,
                remainingDays: 180,
                transferredDays: 30,
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

    const res = getAvailablePersonalRightsInDays(application)

    expect(res).toBe(180)
  })

  it('should return the number of available right with request days for secondary parent', () => {
    const application = buildApplication({
      answers: {
        selectedChild: 0,
        requestRights: {
          isRequestingRights: YES,
          requestDays: 30,
        },
      },
      externalData: {
        children: {
          data: {
            children: [
              {
                hasRights: true,
                remainingDays: 210,
                transferredDays: 30,
                parentalRelation: ParentalRelations.secondary,
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

    const res = getAvailablePersonalRightsInDays(application)

    expect(res).toBe(180)
  })

  it('should return the number of available right with multiple births and giving days for secondary parent', () => {
    const application = buildApplication({
      answers: {
        selectedChild: 0,
        giveRights: {
          isGivingRights: YES,
          giveDays: 30,
        },
      },
      externalData: {
        children: {
          data: {
            children: [
              {
                hasRights: true,
                remainingDays: 150,
                transferredDays: -30,
                parentalRelation: ParentalRelations.secondary,
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

    const res = getAvailablePersonalRightsInDays(application)

    expect(res).toBe(180)
  })
})

describe('getAvailablePersonalRightsInMonths', () => {
  it('should return the number of months with multiple births and request days for primary parent', () => {
    const application = buildApplication({
      answers: {
        selectedChild: 0,
        multipleBirthsRequestDays: 90,
        multipleBirths: {
          hasMultipleBirths: YES,
          multipleBirths: 2,
        },
        requestRights: {
          isRequestingRights: YES,
          requestDays: 30,
        },
      },
      externalData: {
        children: {
          data: {
            children: [
              {
                hasRights: true,
                remainingDays: 180,
                transferredDays: 30,
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

    const res = getAvailablePersonalRightsInMonths(application)

    expect(res).toBe(6)
  })

  it('should return the number of months with multiple births and giving days for secondary parent', () => {
    const application = buildApplication({
      answers: {
        selectedChild: 0,
        giveRights: {
          isGivingRights: YES,
          giveDays: 30,
        },
      },
      externalData: {
        children: {
          data: {
            children: [
              {
                hasRights: true,
                remainingDays: 150,
                transferredDays: -30,
                parentalRelation: ParentalRelations.secondary,
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

    const res = getAvailablePersonalRightsInMonths(application)

    expect(res).toBe(6)
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

  it('should return the number of months with multiple births and request days for primary parent', () => {
    const application = buildApplication({
      answers: {
        selectedChild: 0,
        multipleBirthsRequestDays: 180,
        multipleBirths: {
          hasMultipleBirths: YES,
          multipleBirths: 2,
        },
        requestRights: {
          isRequestingRights: YES,
          requestDays: 30,
        },
      },
      externalData: {
        children: {
          data: {
            children: [
              {
                hasRights: true,
                remainingDays: 180,
                transferredDays: 30,
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

    expect(res).toBe(13)
  })
})

describe('Single Parent', () => {
  it('getAdditionalSingleParentRightsInDays - should return 0 additional days when not single parent', () => {
    const application = buildApplication()

    const res = getAdditionalSingleParentRightsInDays(application)

    expect(res).toBe(0)
  })

  it('getAdditionalSingleParentRightsInDays - should return 180 days for additional right for single parent', () => {
    const application = buildApplication({
      answers: {
        selectedChild: 0,
        otherParent: SINGLE,
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

    const res = getAdditionalSingleParentRightsInDays(application)

    expect(res).toBe(180)
  })

  it('getAdditionalSingleParentRightsInDays - should return 450 for single parent personal right', () => {
    const application = buildApplication({
      answers: {
        selectedChild: 0,
        otherParent: SINGLE,
        multipleBirths: {
          multipleBirths: 2,
          hasMultipleBirths: YES,
        },
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

    const res = getAvailableRightsInDays(application)

    expect(res).toBe(540)
  })

  it('getAvailablePersonalRightsSingleParentInMonths - should return 12 months for single parents', () => {
    const application = buildApplication({
      answers: {
        selectedChild: 0,
        otherParent: SINGLE,
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

    const res = getAvailablePersonalRightsSingleParentInMonths(application)

    expect(res).toBe(12)
  })
})

describe('getSpouse', () => {
  it('should return null with no spouse', () => {
    const application = buildApplication()
    expect(getSpouse(application)).toEqual(null)
  })
  it('should return name and national ID of spouse', () => {
    const application = buildApplication({
      externalData: {
        person: {
          data: {
            spouse: {
              name: 'my spouse',
              nationalId: 'spouse national ID',
            },
          },
          date: new Date(),
          status: 'success',
        },
      },
    })
    expect(getSpouse(application)).toEqual({
      name: 'my spouse',
      nationalId: 'spouse national ID',
    })
  })
})

describe('isEligableForParentalLeave', () => {
  it('should return undefined without data', () => {
    const application = buildApplication()
    expect(isEligibleForParentalLeave(application.externalData)).toEqual(
      undefined,
    )
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

describe('getPeriodIndex', () => {
  it('should return -1 if field id is missing', () => {
    expect(getPeriodIndex()).toEqual(-1)
  })
  it('should return 0 if field id === periods', () => {
    const field = buildField()
    expect(getPeriodIndex(field)).toEqual(0)
  })
})

describe('getApplicationExternalData', () => {
  it('should get external data from application with expected return values', () => {
    const application = buildApplication({
      externalData: {
        children: {
          data: {
            children: 'Mock child',
          },
          date: new Date(),
          status: 'success',
        },
        userProfile: {
          data: {
            email: 'mock@email.is',
            mobilePhoneNumber: 'Mock number',
          },
          date: new Date(),
          status: 'success',
        },
        person: {
          data: {
            genderCode: 'Mock gender code',
            fullName: 'Mock name',
          },
          date: new Date(),
          status: 'success',
        },
      },
    })
    expect(getApplicationExternalData(application.externalData)).toEqual({
      applicantGenderCode: 'Mock gender code',
      applicantName: 'Mock name',
      applicationFundId: '',
      children: 'Mock child',
      dataProvider: {
        children: 'Mock child',
      },
      VMSTOtherParent: {},
      navId: '',
      userEmail: 'mock@email.is',
      userPhoneNumber: 'Mock number',
    })
  })
})

describe('ParentWithOutBirthParent', () => {
  it('should return true if question one and two are answeres YES and thrid question answered NO', () => {
    const application = buildApplication({
      answers: {
        noPrimaryParent: {
          birthDate: '2023-02-03',
          questionOne: 'yes',
          questionTwo: 'yes',
          questionThree: 'no',
        },
      },
    })
    expect(isParentWithoutBirthParent(application.answers)).toBe(true)
  })

  it('should return true if either question one and two are answeres NO and/or thrid question answered YES', () => {
    const application = buildApplication({
      answers: {
        noPrimaryParent: {
          questionOne: 'no',
          questionTwo: 'yes',
          questionThree: 'no',
        },
      },
    })
    expect(isNotEligibleForParentWithoutBirthParent(application.answers)).toBe(
      true,
    )
  })
})

describe('requiresOtherParentApproval', () => {
  it('should return false when conditions not met', () => {
    const application = buildApplication()
    expect(
      requiresOtherParentApproval(
        application.answers,
        application.externalData,
      ),
    ).toBe(false)
  })
  it('should return true when usePersonalAllowanceFromSpouse === YES ', () => {
    const application = buildApplication({
      answers: {
        usePersonalAllowanceFromSpouse: YES,
      },
    })
    expect(
      requiresOtherParentApproval(
        application.answers,
        application.externalData,
      ),
    ).toBe(true)
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
    applicantActors: [],
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

  it('should return undefined if NO parent is selected', () => {
    application.answers.otherParentObj = {
      chooseOtherParent: NO,
    }

    expect(getOtherParentId(application)).toBeUndefined()
  })

  it('should return answers.otherParentId if manual is selected', () => {
    const expectedId = '1234567899'

    application.answers.otherParentObj = {
      chooseOtherParent: MANUAL,
      otherParentId: expectedId,
    }

    expect(getOtherParentId(application)).toBe(expectedId)
  })

  it('should return spouse if spouse is selected', () => {
    const expectedSpouse: PersonInformation['spouse'] = {
      name: 'Spouse Spouseson',
      nationalId: '1234567890',
    }

    application.externalData.person = {
      data: {
        spouse: expectedSpouse,
      },
      date: new Date(),
      status: 'success',
    }
    application.answers.otherParentObj = {
      chooseOtherParent: 'spouse',
    }

    expect(getOtherParentId(application)).toBe(expectedSpouse.nationalId)
  })

  it('should not return other parent id if where is no primary parent birth date', () => {
    const expectedId = ''

    const application = buildApplication({
      answers: {
        noPrimaryParent: {
          birthDate: '2023-02-03',
          questionOne: 'no',
          questionTwo: 'yes',
          questionThree: 'yes',
        },
      },
    })

    expect(getOtherParentId(application)).toBe(expectedId)
  })
})

describe('getOtherParentName', () => {
  let application: Application
  beforeEach(() => {
    application = createApplicationBase()
  })

  it('should return undefined if NO parent is selected', () => {
    application.answers.otherParentObj = {
      chooseOtherParent: NO,
    }

    expect(getOtherParentName(application)).toBeUndefined()
  })

  it('should return answers.otherParentName if manual is selected', () => {
    const expectedName = '1234567899'

    application.answers.otherParentObj = {
      chooseOtherParent: MANUAL,
      otherParentName: expectedName,
    }

    expect(getOtherParentName(application)).toBe(expectedName)
  })

  it('should return spouse if spouse is selected', () => {
    const expectedSpouse: PersonInformation['spouse'] = {
      name: 'Spouse Spouseson',
      nationalId: '1234567890',
    }

    application.externalData.person = {
      data: {
        spouse: expectedSpouse,
      },
      date: new Date(),
      status: 'success',
    }
    application.answers.otherParentObj = {
      chooseOtherParent: 'spouse',
    }

    expect(getOtherParentName(application)).toBe(expectedSpouse.name)
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
      calculateEndDateForPeriodWithStartAndLength('2021-02-28', 1),
    ).toEqual(new Date(2021, 2, 27))
  })

  it('should calculate month + n for whole months when startDate is 31', () => {
    expect(
      calculateEndDateForPeriodWithStartAndLength('2021-01-31', 1),
    ).toEqual(new Date(2021, 1, 28))

    expect(
      calculateEndDateForPeriodWithStartAndLength('2021-03-31', 1),
    ).toEqual(new Date(2021, 3, 30))

    expect(
      calculateEndDateForPeriodWithStartAndLength('2020-12-31', 1),
    ).toEqual(new Date(2021, 0, 31))
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
    expect(calculatePeriodLengthInMonths('2021-01-01', '2021-01-15')).toBe(0.5)
    expect(calculatePeriodLengthInMonths('2021-01-14', '2021-01-28')).toBe(0.5)
    expect(calculatePeriodLengthInMonths('2021-01-31', '2021-02-13')).toBe(0.5)
    expect(calculatePeriodLengthInMonths('2021-02-28', '2021-03-14')).toBe(0.5)
    expect(calculatePeriodLengthInMonths('2021-02-28', '2021-03-28')).toBe(1)
    expect(calculatePeriodLengthInMonths('2021-02-28', '2021-04-13')).toBe(1.5)
    expect(calculatePeriodLengthInMonths('2021-02-28', '2021-05-13')).toBe(2.5)
    expect(calculatePeriodLengthInMonths('2021-02-28', '2021-07-13')).toBe(4.5)
    expect(calculatePeriodLengthInMonths('2021-02-28', '2022-07-13')).toBe(16.5)
    expect(calculatePeriodLengthInMonths('2021-03-27', '2021-04-11')).toBe(0.5)
  })
})

describe('applicantIsMale', () => {
  it('should return false if genderCode is missing', () => {
    const application = buildApplication()

    expect(applicantIsMale(application)).toBe(false)
  })

  it('should return false if genderCode is present and !== "1"', () => {
    const application1 = buildApplication()
    const application2 = buildApplication()
    const application3 = buildApplication()

    set(application1.externalData, 'person.data.genderCode', '0')
    set(application2.externalData, 'person.data.genderCode', 'invalid')
    set(application3.externalData, 'person.data.genderCode', '11')

    expect(applicantIsMale(application1)).toBe(false)
    expect(applicantIsMale(application2)).toBe(false)
    expect(applicantIsMale(application3)).toBe(false)
  })

  it('should return true if genderCode is === "1"', () => {
    const application = buildApplication()

    set(application.externalData, 'person.data.genderCode', '1')

    expect(applicantIsMale(application)).toBe(true)
  })
})

test.each([
  { parentRelation: '', expected: false },
  { parentRelation: SPOUSE, expected: true },
  { parentRelation: SINGLE, expected: false },
  { parentRelation: 'some bogus value', expected: false },
])(
  'it should return true if the otherParent is SPOUSE otherwise false',
  ({ parentRelation, expected }) => {
    const application = buildApplication({
      answers: {
        otherParentObj: {
          chooseOtherParent: parentRelation,
        },
      },
    })
    expect(allowOtherParentToUsePersonalAllowance(application.answers)).toBe(
      expected,
    )
  },
)
test.each([
  { date: setTestBirthAndExpectedDate(6, 0, false, true), expected: true },
  { date: setTestBirthAndExpectedDate(7, 0, false, true), expected: false },
  { date: setTestBirthAndExpectedDate(1, 0, true, false), expected: false },
  { date: setTestBirthAndExpectedDate(0, 0, true, false), expected: true },
  { date: setTestBirthAndExpectedDate(0, 0, false, true), expected: true },
  { date: setTestBirthAndExpectedDate(10), expected: true },
])(
  'should return true if today is after the date and within 6 months of the date',
  ({ date, expected }) => {
    expect(residentGrantIsOpenForApplication(date.birthDate)).toBe(expected)
  },
)

describe('getActionName', () => {
  let application: Application
  beforeEach(() => {
    application = createApplicationBase()
  })

  it('should return FileType.EMPDOCPER if changeEmployerFile, changeEmployer and changePeriods', () => {
    set(application, 'answers.fileUpload.changeEmployerFile', [
      { name: 'file1.pdf', key: 'Key1' },
    ])
    set(application, 'answers.changeEmployer', true)
    set(application, 'answers.changePeriods', true)

    application.state = States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS

    const result = getActionName(application)

    expect(result).toBe(FileType.EMPDOCPER)
  })

  it('should return FileType.PERIOD if changePeriods', () => {
    set(application, 'answers.changePeriods', true)

    application.state = States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS

    const result = getActionName(application)

    expect(result).toBe(FileType.PERIOD)
  })

  it('should return FileType.EMPLOYER if changeEmployer', () => {
    set(application, 'answers.changeEmployer', true)

    application.state = States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS

    const result = getActionName(application)

    expect(result).toBe(FileType.EMPLOYER)
  })

  it('should return FileType.EMPPER if changePeriods & changeEmployer', () => {
    set(application, 'answers.changeEmployer', true)
    set(application, 'answers.changePeriods', true)

    application.state = States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS

    const result = getActionName(application)

    expect(result).toBe(FileType.EMPPER)
  })

  it('should return FileType.DOCUMENT if state is ADDITIONAL_DOCUMENTS_REQUIRED', () => {
    application.state = application.state = States.ADDITIONAL_DOCUMENTS_REQUIRED

    const result = getActionName(application)

    expect(result).toBe(FileType.DOCUMENT)
  })

  it('should return undefined if no conditions met', () => {
    application.state = application.state = States.CLOSED

    const result = getActionName(application)

    expect(result).toBeUndefined()
  })
})
