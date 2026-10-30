import set from 'lodash/set'
import { parentalLeaveFormMessages } from './messages'
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
  ApplicationAction,
  MANUAL,
  SINGLE,
  SPOUSE,
  ParentalRelations,
  ADOPTION,
  PERMANENT_FOSTER_CARE,
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
  isFollowUpApplication,
  getChildrenInProgress,
  getApplicationAnswers,
  getChildLabel,
  isNoChildrenFoundPath,
  getChildrenOptions,
  isChildNotInDataSelected,
  getPeriodIndex,
  getApplicationExternalData,
  getVmstApplicationId,
  getPreviousVmstLeave,
  getTypeOfApplicationFromRights,
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
  getVMSTApplicationAnswers,
  getChangeBaseline,
  pickFirstPhoneNumber,
} from './parentalLeaveUtils'
import { PersonInformation } from '../types'
import { NO, YES } from '@island.is/application/core'
import {
  ApplicationTypeSubSection,
  FollowUpSubSection,
  FosterCareOrAdoptionSubSection,
  MockDataSubSection,
  NoChildrenFoundSubSection,
  NoPrimaryParentSubSection,
  PrerequisitesForm,
  SelectChildSubSection,
} from '../forms/Prerequisites'

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

describe('getChildrenInProgress', () => {
  it('should list only children held by an unfinished application, with the application to open', () => {
    const externalData: ExternalData = {
      children: {
        data: {
          children: [
            {
              expectedDateOfBirth: '2027-10-29',
              parentalRelation: ParentalRelations.primary,
              existingApplicationId: 'waiting-for-vmst',
              existingApplicationIsInProgress: true,
            },
            {
              expectedDateOfBirth: '2027-05-18',
              parentalRelation: ParentalRelations.primary,
              existingApplicationId: 'pending-change',
              existingApplicationIsChangeInProgress: true,
            },
            {
              expectedDateOfBirth: '2027-04-02',
              parentalRelation: ParentalRelations.primary,
              existingApplicationId: 'approved',
            },
            {
              expectedDateOfBirth: '2028-01-01',
              parentalRelation: ParentalRelations.primary,
            },
          ],
        },
        date: new Date(),
        status: 'success',
      },
    }

    expect(getChildrenInProgress(externalData)).toEqual([
      {
        label: expect.objectContaining({
          values: { dateOfBirth: '29.10.2027' },
        }),
        applicationId: 'waiting-for-vmst',
        isChange: false,
      },
      {
        label: expect.objectContaining({
          values: { dateOfBirth: '18.05.2027' },
        }),
        applicationId: 'pending-change',
        isChange: true,
      },
    ])
  })

  it("should not throw for the applicant's own unfinished adoption", () => {
    // The synthesized child of an adoption or foster care application has no
    // expected date of birth. Formatting it used to throw, which crashed the
    // prerequisites of every new application while that one was in progress.
    const externalData: ExternalData = {
      children: {
        data: {
          children: [
            {
              expectedDateOfBirth: '',
              adoptionDate: '2026-11-15',
              parentalRelation: ParentalRelations.primary,
              existingApplicationId: 'adoption-in-progress',
              existingApplicationIsInProgress: true,
            },
          ],
        },
        date: new Date(),
        status: 'success',
      },
    }

    expect(getChildrenInProgress(externalData)).toEqual([
      {
        label: expect.objectContaining({
          id: parentalLeaveFormMessages.selectChild.adoptionOrFosterCare.id,
          values: { dateOfBirth: '15.11.2026' },
        }),
        applicationId: 'adoption-in-progress',
        isChange: false,
      },
    ])
  })
})

describe('getChildLabel', () => {
  it('should name a registry child by its expected date of birth', () => {
    expect(
      getChildLabel({
        expectedDateOfBirth: '2027-10-29',
        parentalRelation: ParentalRelations.primary,
        hasRights: true,
        remainingDays: 180,
      }),
    ).toEqual({
      ...parentalLeaveFormMessages.selectChild.baby,
      values: { dateOfBirth: '29.10.2027' },
    })
  })

  it("should name the applicant's own adopted or foster child by its adoption date", () => {
    expect(
      getChildLabel({
        expectedDateOfBirth: '',
        adoptionDate: '2026-11-15',
        parentalRelation: ParentalRelations.primary,
        hasRights: true,
        remainingDays: 180,
      }),
    ).toEqual({
      ...parentalLeaveFormMessages.selectChild.adoptionOrFosterCare,
      values: { dateOfBirth: '15.11.2026' },
    })
  })

  it('should not throw when there is no date at all', () => {
    expect(
      getChildLabel({
        expectedDateOfBirth: '',
        parentalRelation: ParentalRelations.primary,
        hasRights: true,
        remainingDays: 180,
      }).values,
    ).toEqual({ dateOfBirth: '' })
  })
})

describe('getChildrenOptions', () => {
  const childrenExternalData = (
    children: Record<string, unknown>[],
  ): ExternalData => ({
    children: {
      data: { children, existingApplications: [] },
      date: new Date(),
      status: 'success',
    },
  })

  const build = (children: Record<string, unknown>[]) =>
    getChildrenOptions(
      buildApplication({ externalData: childrenExternalData(children) }),
    )

  it('should list children without an application before ones that have one', () => {
    const options = build([
      // Deliberately the order collectChildren produces: the applicant's own
      // earlier applications come first there, for dedup precedence.
      {
        expectedDateOfBirth: '2027-03-04',
        parentalRelation: ParentalRelations.primary,
        existingApplicationId: 'previous-application-id',
      },
      {
        expectedDateOfBirth: '2028-01-01',
        parentalRelation: ParentalRelations.primary,
      },
    ])

    expect(options.map((o) => o.dataTestId)).toEqual([
      'child-1',
      'existing-application-0',
      'child-not-in-data',
    ])
  })

  it('should keep the original child index as the value, not the sorted position', () => {
    // `selectedChild` is an index into externalData.children.data.children, so
    // reordering for display must not renumber it.
    const options = build([
      {
        expectedDateOfBirth: '2027-03-04',
        parentalRelation: ParentalRelations.primary,
        existingApplicationId: 'previous-application-id',
      },
      {
        expectedDateOfBirth: '2028-01-01',
        parentalRelation: ParentalRelations.primary,
      },
    ])

    expect(options[0].value).toBe('1')
    expect(options[1].value).toBe('0')
  })

  it('should disable a child with an in-progress change application', () => {
    const options = build([
      {
        expectedDateOfBirth: '2027-03-04',
        parentalRelation: ParentalRelations.primary,
        existingApplicationId: 'pending-change-id',
        existingApplicationIsChangeInProgress: true,
      },
      {
        expectedDateOfBirth: '2028-01-01',
        parentalRelation: ParentalRelations.primary,
      },
    ])

    expect(options.map((option) => option.dataTestId)).toEqual([
      'child-1',
      'existing-application-0',
      'child-not-in-data',
    ])
    expect(options[1].value).toBe('0')
    expect(options[1].disabled).toBe(true)
  })

  it('should disable a child with an unfinished first-time application', () => {
    const options = build([
      {
        expectedDateOfBirth: '2027-03-04',
        parentalRelation: ParentalRelations.primary,
        existingApplicationId: 'waiting-for-approval-id',
        existingApplicationIsInProgress: true,
      },
    ])

    expect((options[0] as { disabled?: boolean }).disabled).toBe(true)
    expect(options[0].subLabel).toBe(
      parentalLeaveFormMessages.selectChild.applicationInProgress,
    )
  })

  it('should always offer the not-in-the-data option last', () => {
    expect(build([]).map((o) => o.dataTestId)).toEqual(['child-not-in-data'])
  })
})

describe('prerequisites screens hidden for a follow-up application', () => {
  // A change or residence grant inherits all of this from the application it
  // continues, so none of these questions should be put to the applicant again.
  const cases: [
    string,
    { condition?: (a: FormValue, e: ExternalData) => boolean },
  ][] = [
    ['mock data', MockDataSubSection],
    ['select child', SelectChildSubSection],
    ['application type', ApplicationTypeSubSection],
  ]

  const externalData: ExternalData = {
    children: {
      data: {
        children: [
          {
            expectedDateOfBirth: '2027-03-04',
            parentalRelation: ParentalRelations.primary,
          },
        ],
        existingApplications: [],
      },
      date: new Date(),
      status: 'success',
    },
  }

  it.each(cases)('should hide the %s screen', (_name, section) => {
    expect(
      section.condition?.(
        { applicationAction: ApplicationAction.CHANGE },
        externalData,
      ),
    ).toBe(false)
  })

  it.each(cases)(
    'should show the %s screen for a first-time application',
    (_name, section) => {
      expect(section.condition?.({}, externalData)).toBe(true)
    },
  )

  it('should show the follow-up screen only for a follow-up', () => {
    expect(
      FollowUpSubSection.condition?.(
        { applicationAction: ApplicationAction.CHANGE },
        externalData,
      ),
    ).toBe(true)
    expect(FollowUpSubSection.condition?.({}, externalData)).toBe(false)
  })
})

describe('multiple births questions on the select-child screen', () => {
  // They must not be asked for a child that already has an application: the
  // answer is prefilled from VMST for the leave being changed and asking again
  // could contradict it.
  const screen = SelectChildSubSection.children[0] as unknown as {
    children: {
      id: string
      condition?: (a: FormValue, e: ExternalData) => boolean
    }[]
  }

  const externalDataFor = (child: Record<string, unknown>): ExternalData => ({
    children: {
      data: { children: [child], existingApplications: [] },
      date: new Date(),
      status: 'success',
    },
  })

  const conditionFor = (id: string) =>
    screen.children.find((field) => field.id === id)?.condition

  const freshChild = {
    expectedDateOfBirth: '2028-01-01',
    parentalRelation: ParentalRelations.primary,
  }
  const childBeingChanged = {
    ...freshChild,
    existingApplicationId: 'previous-application-id',
  }

  it('should ask for a child with no application yet', () => {
    const condition = conditionFor('multipleBirths.hasMultipleBirths')

    expect(
      condition?.({ selectedChild: '0' }, externalDataFor(freshChild)),
    ).toBe(true)
  })

  it('should not ask for a child that already has an application', () => {
    expect(
      conditionFor('multipleBirths.hasMultipleBirths')?.(
        { selectedChild: '0' },
        externalDataFor(childBeingChanged),
      ),
    ).toBe(false)

    expect(
      conditionFor('multipleBirths.multipleBirths')?.(
        { selectedChild: '0', multipleBirths: { hasMultipleBirths: YES } },
        externalDataFor(childBeingChanged),
      ),
    ).toBe(false)
  })
})

describe('isChildNotInDataSelected', () => {
  it('should recognise the sentinel', () => {
    expect(isChildNotInDataSelected({ selectedChild: 'new' })).toBe(true)
    expect(isChildNotInDataSelected({ selectedChild: '0' })).toBe(false)
    expect(isChildNotInDataSelected({})).toBe(false)
  })
})

describe('isNoChildrenFoundPath', () => {
  it('should be true when no registry child was picked', () => {
    expect(isNoChildrenFoundPath({ selectedChild: 'new' })).toBe(true)
    expect(isNoChildrenFoundPath({})).toBe(true)
  })

  it('should be false once a registry child is picked', () => {
    expect(
      isNoChildrenFoundPath({
        selectedChild: '0',
        noChildrenFound: { typeOfApplication: 'primary_adoption' },
      }),
    ).toBe(false)
  })
})

describe('selected child on the no-children-found path', () => {
  const registry: ExternalData = {
    children: {
      data: {
        children: [
          {
            expectedDateOfBirth: '2027-10-29',
            parentalRelation: ParentalRelations.primary,
            existingApplicationId: 'approved-leave',
          },
          {
            expectedDateOfBirth: '2027-11-17',
            parentalRelation: ParentalRelations.primary,
          },
        ],
      },
      date: new Date(),
      status: 'success',
    },
  }
  const adoption = { typeOfApplication: 'primary_adoption' }

  it('should not resolve "Ný umsókn" to a registry child during prerequisites', () => {
    // Index 0 is a registry child here, not the synthesized one. Resolving to it
    // made the change screen start a change for that child's leave.
    expect(
      getSelectedChild(
        { selectedChild: 'new', noChildrenFound: adoption },
        registry,
      ),
    ).toBeNull()
  })

  it('should keep a registry child picked after answering the screens', () => {
    expect(
      getSelectedChild(
        { selectedChild: '1', noChildrenFound: adoption },
        registry,
      )?.expectedDateOfBirth,
    ).toBe('2027-11-17')
  })

  it('should still point at the synthesized child when none was ever picked', () => {
    // An empty registry never asks for a child, so `selectedChild` stays unset.
    expect(
      getApplicationAnswers({ noChildrenFound: adoption }).selectedChild,
    ).toBe('0')
  })
})

describe('no-children-found prerequisites', () => {
  const externalData: ExternalData = {
    children: {
      data: {
        children: [
          {
            expectedDateOfBirth: '2027-10-29',
            parentalRelation: ParentalRelations.primary,
          },
        ],
      },
      date: new Date(),
      status: 'success',
    },
  }

  const isShown = (
    section: { condition?: unknown },
    answers: FormValue,
  ): boolean =>
    (
      section.condition as (
        answers: FormValue,
        externalData: ExternalData,
      ) => boolean
    )(answers, externalData)

  it('should come after child selection, which is where "Ný umsókn" is picked', () => {
    // The shell only moves forward through the form's order. Before child
    // selection, picking "Ný umsókn" left no screen ahead and a blank page.
    const ids = PrerequisitesForm.children[0].children?.map(({ id }) => id)
    const selectChild = ids?.indexOf(SelectChildSubSection.id) ?? -1

    expect(selectChild).toBeGreaterThan(-1)
    for (const section of [
      NoChildrenFoundSubSection,
      FosterCareOrAdoptionSubSection,
      NoPrimaryParentSubSection,
    ]) {
      expect(ids?.indexOf(section.id)).toBeGreaterThan(selectChild)
    }
  })

  it('should follow "Ný umsókn" with the no-children-found screens', () => {
    const answers = {
      selectedChild: 'new',
      noChildrenFound: { typeOfApplication: 'primary_adoption' },
    }

    expect(isShown(NoChildrenFoundSubSection, answers)).toBe(true)
    expect(isShown(FosterCareOrAdoptionSubSection, answers)).toBe(true)
  })

  it('should keep a screen after "Umsókn vegna" before a type is picked', () => {
    // Otherwise the shell finds nothing ahead and renders no next button.
    expect(
      isShown(FosterCareOrAdoptionSubSection, { selectedChild: 'new' }),
    ).toBe(true)
  })

  it('should hide them again when a registry child is picked afterwards', () => {
    const adoption = {
      selectedChild: '0',
      noChildrenFound: { typeOfApplication: 'primary_adoption' },
    }
    const other = {
      selectedChild: '0',
      noChildrenFound: { typeOfApplication: 'other' },
    }

    expect(isShown(FosterCareOrAdoptionSubSection, adoption)).toBe(false)
    expect(isShown(NoPrimaryParentSubSection, other)).toBe(false)
  })
})

describe('isFollowUpApplication', () => {
  it('should be false for a first-time application', () => {
    expect(isFollowUpApplication({})).toBe(false)
    expect(
      isFollowUpApplication({ applicationAction: ApplicationAction.APPLY }),
    ).toBe(false)
  })

  it('should be true for a change or residence grant', () => {
    // This is what stops the change flow looping: the child keeps its
    // existingApplicationId in the change application, so the screen that starts a
    // change has to know not to fire again.
    expect(
      isFollowUpApplication({ applicationAction: ApplicationAction.CHANGE }),
    ).toBe(true)
    expect(
      isFollowUpApplication({
        applicationAction: ApplicationAction.RESIDENCE_GRANT,
      }),
    ).toBe(true)
  })
})

describe('isEligibleForParentalLeave', () => {
  it('should not be eligible without data', () => {
    const application = buildApplication()
    expect(isEligibleForParentalLeave(application.externalData)).toBe(false)
  })

  it('should be eligible once the provider has resolved a child', () => {
    const application = buildApplication({
      externalData: {
        children: {
          data: {
            children: [
              {
                hasRights: true,
                remainingDays: 180,
                parentalRelation: 'primary',
                expectedDateOfBirth: '2022-10-31',
              },
            ],
            existingApplications: [],
          },
          date: new Date(),
          status: 'success',
        },
      },
    })

    expect(isEligibleForParentalLeave(application.externalData)).toBe(true)
  })

  it('should be eligible for a child that already has an application, so it can be changed', () => {
    const application = buildApplication({
      externalData: {
        children: {
          data: {
            children: [
              {
                hasRights: true,
                remainingDays: 0,
                parentalRelation: 'primary',
                expectedDateOfBirth: '2022-10-31',
                existingApplicationId: 'previous-application-id',
              },
            ],
            existingApplications: [],
          },
          date: new Date(),
          status: 'success',
        },
      },
    })

    expect(isEligibleForParentalLeave(application.externalData)).toBe(true)
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
      childApplicationLinks: [],
      children: 'Mock child',
      dataProvider: {
        children: 'Mock child',
      },
      existingApplications: [],
      VMSTOtherParent: {},
      VMSTPeriods: undefined,
      VMSTApplicationRights: undefined,
      VMSTApplicationInformation: undefined,
      dateOfBirth: undefined,
      navId: '',
      userEmail: 'mock@email.is',
      userPhoneNumber: 'Mock number',
    })
  })

  it('should map VMST application information to follow-up answers', () => {
    const application = buildApplication({
      externalData: {
        VMSTApplicationInformation: {
          data: {
            email: 'applicant@island.is',
            phoneNumber: '6612345',
            paymentInfo: {
              bankAccount: '011126111111',
              personalAllowance: 50,
              personalAllowanceFromSpouse: 100,
              union: { id: 'F001', name: 'Union' },
              pensionFund: { id: 'L001', name: 'Pension' },
              privatePensionFund: { id: 'X001', name: 'Private pension' },
              privatePensionFundRatio: 2,
            },
            otherParentId: '0101307789',
            otherParentName: 'Other Parent',
            periods: [
              {
                from: '2027-01-01',
                to: '2027-03-01',
                ratio: '100,50',
                firstPeriodStart: 'specificDate',
                rightsCodePeriod: 'M-L-GR,ORLOF-FBF',
                days: '60',
                paid: false,
                approved: true,
              },
            ],
            employers: [
              {
                email: 'employer@island.is',
                nationalRegistryId: '1111111119',
              },
            ],
            applicationRights: [
              {
                rightsUnit: 'M-S-GR',
                rightsDescription: 'Self employed personal right',
                months: '6.0',
                days: '180',
                daysLeft: '120',
              },
              {
                rightsUnit: 'ORLOF-FBF',
                rightsDescription: 'Multiple births',
                months: '12.0',
                days: '360',
                daysLeft: '360',
              },
            ],
          },
          status: 'success',
          date: new Date(),
        },
      } as unknown as ExternalData,
    })

    expect(getVMSTApplicationAnswers(application.externalData)).toMatchObject({
      applicant: {
        email: 'applicant@island.is',
        phoneNumber: '6612345',
        language: 'IS',
      },
      applicationType: {
        option: 'parentalLeave',
      },
      employment: {
        isSelfEmployed: YES,
      },
      payments: {
        bank: '011126111111',
        pensionFund: 'L001',
        useUnion: YES,
        union: 'F001',
        usePrivatePensionFund: YES,
        privatePensionFund: 'X001',
        privatePensionFundPercentage: '2',
      },
      personalAllowance: {
        usePersonalAllowance: YES,
        useAsMuchAsPossible: NO,
        usage: '50',
      },
      personalAllowanceFromSpouse: {
        usePersonalAllowance: YES,
        useAsMuchAsPossible: YES,
        usage: '100',
      },
      otherParent: MANUAL,
      otherParentObj: {
        chooseOtherParent: MANUAL,
        otherParentId: '0101307789',
        otherParentName: 'Other Parent',
      },
      periods: [
        {
          startDate: '2027-01-01',
          endDate: '2027-03-01',
          ratio: '100',
          firstPeriodStart: 'specificDate',
          rightCodePeriod: 'M-L-GR',
          daysToUse: '60',
          paid: false,
          approved: true,
        },
      ],
      employers: [
        {
          email: 'employer@island.is',
          companyNationalRegistryId: '1111111119',
        },
      ],
      multipleBirths: {
        hasMultipleBirths: YES,
        multipleBirths: '2',
      },
      multipleBirthsRequestDays: 360,
    })
  })

  it('should not build a change baseline from null VMST data on first-time applications', () => {
    const application = buildApplication({
      externalData: {
        VMSTApplicationInformation: {
          data: null,
          status: 'success',
          date: new Date(),
        },
        VMSTPeriods: {
          data: null,
          status: 'success',
          date: new Date(),
        },
        VMSTApplicationRights: {
          data: null,
          status: 'success',
          date: new Date(),
        },
        VMSTOtherParent: {
          data: null,
          status: 'success',
          date: new Date(),
        },
      } as unknown as ExternalData,
    })

    expect(getVMSTApplicationAnswers(application.externalData)).toEqual({})
    expect(getChangeBaseline(application.externalData)).toBeNull()
  })

  it('should ignore failed VMST provider object payloads on mock applications', () => {
    const application = buildApplication({
      externalData: {
        VMSTApplicationInformation: {
          data: null,
          status: 'success',
          date: new Date(),
        },
        VMSTPeriods: {
          data: {},
          status: 'failure',
          statusCode: 500,
          reason: {
            title: 'Eitthvað fór úrskeiðis',
            summary: 'Villa kom upp',
          },
          date: new Date(),
        },
        VMSTApplicationRights: {
          data: {},
          status: 'failure',
          statusCode: 500,
          reason: {
            title: 'Eitthvað fór úrskeiðis',
            summary: 'Villa kom upp',
          },
          date: new Date(),
        },
        VMSTOtherParent: {
          data: {
            otherParentId: '',
            otherParentName: '',
          },
          status: 'success',
          date: new Date(),
        },
      } as unknown as ExternalData,
    })

    expect(getVMSTApplicationAnswers(application.externalData)).toEqual({})
    expect(getChangeBaseline(application.externalData)).toBeNull()
  })

  describe('VMST leave a follow-up continues', () => {
    const withLinks = (initialQuery: string) =>
      buildApplication({
        answers: { initialQuery },
        externalData: {
          children: {
            data: {
              children: [],
              childApplicationLinks: [
                {
                  childKey: 'vmst:root-application-id',
                  vmstApplicationId: 'root-application-id',
                },
              ],
            },
            date: new Date(),
            status: 'success',
          },
        },
      })

    it('should take the VMST id from a leave VMST lists for the applicant', () => {
      const application = withLinks('root-application-id')

      expect(getPreviousVmstLeave(application)?.vmstApplicationId).toBe(
        'root-application-id',
      )
      expect(getVmstApplicationId(application)).toBe('root-application-id')
    })

    // `initialQuery` comes from the browser and VMST's application lookup does
    // not check ownership.
    it('should not trust an id VMST does not list for the applicant', () => {
      const application = withLinks('someone-elses-application-id')

      expect(getPreviousVmstLeave(application)).toBeUndefined()
      expect(getVmstApplicationId(application)).toBe(application.id)
    })
  })

  it('should read adoption and permanent foster care off the rights code', () => {
    expect(getTypeOfApplicationFromRights([{ rightsUnit: 'M-Æ-L-GR' }])).toBe(
      ADOPTION,
    )
    expect(getTypeOfApplicationFromRights([{ rightsUnit: 'F-FÓ-GR' }])).toBe(
      PERMANENT_FOSTER_CARE,
    )
    expect(
      getTypeOfApplicationFromRights([{ rightsUnit: 'M-L-GR' }]),
    ).toBeUndefined()
  })

  it('should pick the first phone number from a semicolon-separated VMST list', () => {
    const application = buildApplication({
      externalData: {
        VMSTApplicationInformation: {
          data: {
            email: 'applicant@island.is',
            phoneNumber: '8663887; 9999999; 7999999; 899',
          },
          status: 'success',
          date: new Date(),
        },
      } as unknown as ExternalData,
    })

    expect(getVMSTApplicationAnswers(application.externalData)).toMatchObject({
      applicant: {
        phoneNumber: '8663887',
      },
    })
  })

  it('should prefill what only the VMST parental-leaves list returns', () => {
    const application = buildApplication({
      externalData: {
        VMSTApplicationInformation: {
          data: {
            otherParentId: '0101307789',
            otherParentName: 'Other Parent',
            language: 'en',
            otherParentBlocked: true,
            noOfChildren: '3',
            applicationRights: [
              { rightsUnit: 'M-L-GR', days: '180' },
              { rightsUnit: 'ORLOF-FBF', days: '360' },
            ],
          },
          status: 'success',
          date: new Date(),
        },
      } as unknown as ExternalData,
    })

    expect(getVMSTApplicationAnswers(application.externalData)).toMatchObject({
      applicant: { language: 'EN' },
      otherParentRightOfAccess: NO,
      multipleBirths: { hasMultipleBirths: YES, multipleBirths: '3' },
    })
  })

  it('should prefer the seeded VMST id over the provider once prefill has run', () => {
    const application = buildApplication({
      answers: { vmstApplicationId: 'root-application-id' },
    })

    expect(getVmstApplicationId(application)).toBe('root-application-id')
  })

  it('should fall back to its own id for a first-time application', () => {
    const application = buildApplication()

    expect(getVmstApplicationId(application)).toBe(application.id)
  })

  it('should get applicationFundId from persisted navId external data', () => {
    const application = buildApplication({
      externalData: {
        navId: {
          data: '2025-03076',
          date: new Date(),
          status: 'success',
        },
      },
    })

    expect(getApplicationExternalData(application.externalData)).toMatchObject({
      applicationFundId: '2025-03076',
      navId: '2025-03076',
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
        otherParent: 'spouse',
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

  it('should return false once the application has a fund id from sendApplication', () => {
    const application = buildApplication({
      answers: {
        otherParent: 'spouse',
        usePersonalAllowanceFromSpouse: YES,
      },
      externalData: {
        sendApplication: {
          data: { id: '2017-05140' },
          date: new Date(),
          status: 'success',
        },
      },
    })

    expect(
      requiresOtherParentApproval(
        application.answers,
        application.externalData,
      ),
    ).toBe(false)
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

  it('should return FileType.DOCUMENT if state is ADDITIONAL_DOCUMENTS_REQUIRED_FOR_EDITS', () => {
    application.state = States.ADDITIONAL_DOCUMENTS_REQUIRED_FOR_EDITS

    const result = getActionName(application)

    expect(result).toBe(FileType.DOCUMENT)
  })

  it('should return undefined if no conditions met', () => {
    application.state = application.state = States.CLOSED

    const result = getActionName(application)

    expect(result).toBeUndefined()
  })
})

describe('pickFirstPhoneNumber', () => {
  it('should return undefined for empty or missing input', () => {
    expect(pickFirstPhoneNumber(undefined)).toBeUndefined()
    expect(pickFirstPhoneNumber(null)).toBeUndefined()
    expect(pickFirstPhoneNumber('')).toBeUndefined()
    expect(pickFirstPhoneNumber('   ')).toBeUndefined()
    expect(pickFirstPhoneNumber(';;;')).toBeUndefined()
  })

  it('should return the input unchanged when there is only one number', () => {
    expect(pickFirstPhoneNumber('8663887')).toBe('8663887')
    expect(pickFirstPhoneNumber('  8663887  ')).toBe('8663887')
  })

  it('should return the first non-empty entry from a semicolon-separated list', () => {
    expect(pickFirstPhoneNumber('8663887; 9999999; 7999999; 899')).toBe(
      '8663887',
    )
    expect(pickFirstPhoneNumber('866-3887; 4213075;')).toBe('866-3887')
    expect(pickFirstPhoneNumber('; 8663887; 9999999')).toBe('8663887')
  })
})

describe('getApplicationExternalData applicationFundId', () => {
  // Regression: `getValueViaPath` only substitutes its default when a path is
  // absent, so a path that exists and holds `null` came back as `null`. Readers
  // compare against '' — the other-parent filter in ChildrenService among them —
  // so a null quietly defeated them.
  it('should be an empty string, not null, when nothing has reached VMST', () => {
    const { applicationFundId } = getApplicationExternalData({
      navId: { data: null, date: new Date(), status: 'success' },
      sendApplication: { data: null, date: new Date(), status: 'success' },
    } as unknown as ExternalData)

    expect(applicationFundId).toBe('')
  })

  it('should be an empty string when no provider has run at all', () => {
    const { applicationFundId } = getApplicationExternalData(
      {} as unknown as ExternalData,
    )

    expect(applicationFundId).toBe('')
  })

  it('should take the fund id from sendApplication once the application is sent', () => {
    const { applicationFundId } = getApplicationExternalData({
      navId: { data: null, date: new Date(), status: 'success' },
      sendApplication: {
        data: { id: '2017-05140' },
        date: new Date(),
        status: 'success',
      },
    } as unknown as ExternalData)

    expect(applicationFundId).toBe('2017-05140')
  })
})
