import set from 'lodash/set'

import {
  ApplicationWithAttachments as Application,
  FormValue,
} from '@island.is/application/types'

import {
  getChildren,
  applicationsToExistingChildApplication,
  applicationsToChildInformation,
} from './children-utils'
import {
  ParentalRelations,
  ChildInformationWithoutRights,
  PregnancyStatus,
  ChildInformation,
} from '@island.is/application/templates/parental-leave'

let id = 0

// eslint-disable-next-line local-rules/disallow-kennitalas
const PRIMARY_PARENT_ID = '0101302129'
const SECONDARY_PARENT_ID = '0101302239'

const createApplicationWithChildren = (
  applicant: string,
  children: ChildInformationWithoutRights[],
  selectedChildIndex: number,
  answers?: FormValue,
): Application => {
  const externalData: Application['externalData'] = {}

  set(externalData, 'children.data', {
    children,
  })

  return {
    answers: {
      selectedChild: `${selectedChildIndex}`,
      ...answers,
    },
    applicant,
    assignees: [],
    applicantActors: [],
    attachments: {},
    created: new Date(),
    externalData,
    id: `${id++}`,
    modified: new Date(),
    state: '',
    status: 'inprogress' as Application['status'],
    typeId: 'ParentalLeave' as Application['typeId'],
  }
}

describe('applicationsToChildInformation', () => {
  it('should return empty array when no applicant', () => {
    const applicationsWhereApplicant: Application[] = []
    expect(applicationsToChildInformation(applicationsWhereApplicant)).toEqual(
      [],
    )
  })
  it('should return empty array when no children', () => {
    const children: ChildInformationWithoutRights[] = []
    const applicationsWhereApplicant: Application[] = [
      createApplicationWithChildren(PRIMARY_PARENT_ID, children, 0),
    ]
    expect(applicationsToChildInformation(applicationsWhereApplicant)).toEqual(
      [],
    )
  })
  it('should return children of applicant', () => {
    const children: ChildInformationWithoutRights[] = [
      {
        expectedDateOfBirth: '2020-10-10',
        parentalRelation: ParentalRelations.primary,
      },
    ]
    const applicationsWhereApplicant: Application[] = [
      createApplicationWithChildren(PRIMARY_PARENT_ID, children, 0),
    ]
    expect(applicationsToChildInformation(applicationsWhereApplicant)).toEqual(
      children,
    )
  })
})

describe('getChildren', () => {
  it('should return an empty list for both if no children pregnancy', () => {
    const applicationsWhereApplicant: Application[] = []
    const applicationsWhereOtherParent: Application[] = []
    const pregnancyStatus = undefined

    const expected: ChildInformationWithoutRights[] = []

    const result = getChildren(
      applicationsWhereApplicant,
      applicationsWhereOtherParent,
      pregnancyStatus,
    )

    expect(result).toStrictEqual(expected)
  })

  it('should return child as existing application if already as applicant', () => {
    const children: ChildInformationWithoutRights[] = [
      {
        expectedDateOfBirth: '2020-10-10',
        parentalRelation: ParentalRelations.primary,
      },
    ]

    const applicationsWhereApplicant: Application[] = [
      createApplicationWithChildren(PRIMARY_PARENT_ID, children, 0),
    ]
    const applicationsWhereOtherParent: Application[] = []
    const pregnancyStatus = undefined

    const expectedExistingApplications = applicationsToExistingChildApplication(
      applicationsWhereApplicant,
    )

    const expected: ChildInformationWithoutRights[] = []

    const result = getChildren(
      applicationsWhereApplicant,
      applicationsWhereOtherParent,
      pregnancyStatus,
    )

    expect(expectedExistingApplications.length).toBe(1)
    expect(result).toStrictEqual(expected)
  })

  it('should not include child for secondary parent if dob is already in an existing application', () => {
    const children: ChildInformationWithoutRights[] = [
      {
        expectedDateOfBirth: '2020-10-10',
        parentalRelation: ParentalRelations.secondary,
        primaryParentNationalRegistryId: PRIMARY_PARENT_ID,
      },
    ]

    const existingApplicationOfPrimaryParent = createApplicationWithChildren(
      PRIMARY_PARENT_ID,
      children,
      0,
      {
        otherParentId: SECONDARY_PARENT_ID,
      },
    )

    const existingApplication = createApplicationWithChildren(
      SECONDARY_PARENT_ID,
      children,
      0,
    )

    const applicationsWhereApplicant: Application[] = [existingApplication]
    const applicationsWhereOtherParent: Application[] = [
      existingApplicationOfPrimaryParent,
    ]
    const pregnancyStatus = undefined

    const expectedExistingApplications = applicationsToExistingChildApplication(
      applicationsWhereApplicant,
    )

    const expected: ChildInformationWithoutRights[] = []

    const result = getChildren(
      applicationsWhereApplicant,
      applicationsWhereOtherParent,
      pregnancyStatus,
    )

    expect(result).toStrictEqual(expected)
  })

  it('should return child as secondary parental relation when listed as other parent in a primary parents application', () => {
    const children: ChildInformationWithoutRights[] = [
      {
        expectedDateOfBirth: '2020-10-10',
        parentalRelation: ParentalRelations.primary,
      },
    ]

    const applicationsWhereApplicant: Application[] = []
    const applicationsWhereOtherParent: Application[] = [
      createApplicationWithChildren(PRIMARY_PARENT_ID, children, 0),
    ]
    const pregnancyStatus = undefined

    const expectedChildren: ChildInformationWithoutRights[] = [
      {
        ...children[0],
        parentalRelation: ParentalRelations.secondary,
        primaryParentNationalRegistryId: PRIMARY_PARENT_ID,
        transferredDays: 0,
        multipleBirthsDays: 0,
      },
    ]

    const expected: ChildInformationWithoutRights[] = [...expectedChildren]

    const result = getChildren(
      applicationsWhereApplicant,
      applicationsWhereOtherParent,
      pregnancyStatus,
    )

    expect(result.length).toBe(1)
    expect(result).toEqual(expected)
  })

  it('should include child in list of children with primary relation when pregnancyStatus is defined', () => {
    const applicationsWhereApplicant: Application[] = []
    const applicationsWhereOtherParent: Application[] = []
    const pregnancyStatus: PregnancyStatus = {
      hasActivePregnancy: true,
      expectedDateOfBirth: '2021-05-10',
    }

    const expectedChildren: ChildInformationWithoutRights[] = [
      {
        parentalRelation: ParentalRelations.primary,
        expectedDateOfBirth: pregnancyStatus.expectedDateOfBirth,
      },
    ]

    const expected: ChildInformationWithoutRights[] = [...expectedChildren]

    const result = getChildren(
      applicationsWhereApplicant,
      applicationsWhereOtherParent,
      pregnancyStatus,
    )

    expect(result.length).toBe(1)
    expect(result).toStrictEqual(expected)
  })

  it('should not duplicate expected date of birth in in result.children and result.existingApplications when primary parent has already applied for her unborn child', () => {
    const childFromPregnancyStatus: ChildInformationWithoutRights = {
      expectedDateOfBirth: '2021-05-10',
      parentalRelation: ParentalRelations.primary,
    }

    const children: ChildInformationWithoutRights[] = [childFromPregnancyStatus]

    const applicationsWhereApplicant: Application[] = [
      createApplicationWithChildren(PRIMARY_PARENT_ID, children, 0),
    ]
    const applicationsWhereOtherParent: Application[] = []
    const pregnancyStatus: PregnancyStatus = {
      hasActivePregnancy: true,
      expectedDateOfBirth: childFromPregnancyStatus.expectedDateOfBirth,
    }

    const expected: ChildInformationWithoutRights[] = []

    const result = getChildren(
      applicationsWhereApplicant,
      applicationsWhereOtherParent,
      pregnancyStatus,
    )

    expect(result.length).toBe(0)
    expect(result).toEqual(expected)
  })

  it('should return the number of days requested by the primary parent', () => {
    const childFromPregnancyStatus: ChildInformationWithoutRights = {
      expectedDateOfBirth: '2021-05-10',
      parentalRelation: ParentalRelations.primary,
    }

    const children: ChildInformationWithoutRights[] = [childFromPregnancyStatus]

    const pregnancyStatus: PregnancyStatus = {
      hasActivePregnancy: true,
      expectedDateOfBirth: childFromPregnancyStatus.expectedDateOfBirth,
    }

    const applicationsWhereOtherParent: Application[] = [
      createApplicationWithChildren(PRIMARY_PARENT_ID, children, 0, {
        requestRights: {
          isRequestingRights: 'yes',
          requestDays: 45,
        },
        giveRights: {
          isGivingRights: 'no',
        },
      }),
    ]

    const result = getChildren(
      [],
      applicationsWhereOtherParent,
      pregnancyStatus,
    )
    expect(result[0].transferredDays).toBe(-45)
  })

  it('should return the number of days given by the primary parent', () => {
    const childFromPregnancyStatus: ChildInformation = {
      expectedDateOfBirth: '2021-05-10',
      parentalRelation: ParentalRelations.primary,
      hasRights: true,
      remainingDays: 180,
    }

    const children: ChildInformation[] = [childFromPregnancyStatus]

    const pregnancyStatus: PregnancyStatus = {
      hasActivePregnancy: true,
      expectedDateOfBirth: childFromPregnancyStatus.expectedDateOfBirth,
    }

    const applicationsWhereOtherParent: Application[] = [
      createApplicationWithChildren(PRIMARY_PARENT_ID, children, 0, {
        requestRights: {
          isRequestingRights: 'no',
        },
        giveRights: {
          isGivingRights: 'yes',
          giveDays: 45,
        },
      }),
    ]

    const result = getChildren(
      [],
      applicationsWhereOtherParent,
      pregnancyStatus,
    )

    expect(result[0].transferredDays).toBe(45)
  })

  it('should return the number of "common" days primary parent left', () => {
    const childFromPregnancyStatus: ChildInformationWithoutRights = {
      expectedDateOfBirth: '2021-05-10',
      parentalRelation: ParentalRelations.primary,
    }

    const children: ChildInformationWithoutRights[] = [childFromPregnancyStatus]

    const pregnancyStatus: PregnancyStatus = {
      hasActivePregnancy: true,
      expectedDateOfBirth: childFromPregnancyStatus.expectedDateOfBirth,
    }

    const applicationsWhereOtherParent: Application[] = [
      createApplicationWithChildren(PRIMARY_PARENT_ID, children, 0, {
        multipleBirths: {
          hasMultipleBirths: 'yes',
          multipleBirths: 3,
        },
        multipleBirthsRequestDays: 110,
      }),
    ]

    const result = getChildren(
      [],
      applicationsWhereOtherParent,
      pregnancyStatus,
    )
    expect(result[0].multipleBirthsDays).toBe(250)
  })

  it('should return the number of days requested and "common" days is 0 by the primary parent', () => {
    const childFromPregnancyStatus: ChildInformationWithoutRights = {
      expectedDateOfBirth: '2021-05-10',
      parentalRelation: ParentalRelations.primary,
    }

    const children: ChildInformationWithoutRights[] = [childFromPregnancyStatus]

    const pregnancyStatus: PregnancyStatus = {
      hasActivePregnancy: true,
      expectedDateOfBirth: childFromPregnancyStatus.expectedDateOfBirth,
    }

    const applicationsWhereOtherParent: Application[] = [
      createApplicationWithChildren(PRIMARY_PARENT_ID, children, 0, {
        multipleBirths: {
          hasMultipleBirths: 'yes',
          multipleBirths: 2,
        },
        multipleBirthsRequestDays: 180,
        requestRights: {
          isRequestingRights: 'yes',
          requestDays: 30,
        },
        giveRights: {
          isGivingRights: 'no',
        },
      }),
    ]

    const result = getChildren(
      [],
      applicationsWhereOtherParent,
      pregnancyStatus,
    )
    expect(result[0].transferredDays).toBe(-30)
    expect(result[0].multipleBirthsDays).toBe(0)
  })

  it('should return the number of days requested is 0 and get "common" days by the primary parent', () => {
    const childFromPregnancyStatus: ChildInformationWithoutRights = {
      expectedDateOfBirth: '2021-05-10',
      parentalRelation: ParentalRelations.primary,
    }

    const children: ChildInformationWithoutRights[] = [childFromPregnancyStatus]

    const pregnancyStatus: PregnancyStatus = {
      hasActivePregnancy: true,
      expectedDateOfBirth: childFromPregnancyStatus.expectedDateOfBirth,
    }

    const applicationsWhereOtherParent: Application[] = [
      createApplicationWithChildren(PRIMARY_PARENT_ID, children, 0, {
        multipleBirths: {
          hasMultipleBirths: 'yes',
          multipleBirths: 2,
        },
        multipleBirthsRequestDays: 45,
        requestRights: {
          isRequestingRights: 'yes',
          requestDays: 30,
        },
        giveRights: {
          isGivingRights: 'no',
        },
      }),
    ]

    const result = getChildren(
      [],
      applicationsWhereOtherParent,
      pregnancyStatus,
    )
    expect(result[0].transferredDays).toBe(0)
    expect(result[0].multipleBirthsDays).toBe(135)
  })

  it('should return the number of days given and "common" days by the primary parent', () => {
    const childFromPregnancyStatus: ChildInformation = {
      expectedDateOfBirth: '2021-05-10',
      parentalRelation: ParentalRelations.primary,
      hasRights: true,
      remainingDays: 180,
    }

    const children: ChildInformation[] = [childFromPregnancyStatus]

    const pregnancyStatus: PregnancyStatus = {
      hasActivePregnancy: true,
      expectedDateOfBirth: childFromPregnancyStatus.expectedDateOfBirth,
    }

    const applicationsWhereOtherParent: Application[] = [
      createApplicationWithChildren(PRIMARY_PARENT_ID, children, 0, {
        multipleBirths: {
          hasMultipleBirths: 'yes',
          multipleBirths: 2,
        },
        multipleBirthsRequestDays: 0,
        requestRights: {
          isRequestingRights: 'no',
        },
        giveRights: {
          isGivingRights: 'yes',
          giveDays: 45,
        },
      }),
    ]

    const result = getChildren(
      [],
      applicationsWhereOtherParent,
      pregnancyStatus,
    )

    expect(result[0].multipleBirthsDays).toBe(180)
    expect(result[0].transferredDays).toBe(45)
  })

  it('should return the number of days given is 0 and "common" days by the primary parent', () => {
    const childFromPregnancyStatus: ChildInformation = {
      expectedDateOfBirth: '2021-05-10',
      parentalRelation: ParentalRelations.primary,
      hasRights: true,
      remainingDays: 180,
    }

    const children: ChildInformation[] = [childFromPregnancyStatus]

    const pregnancyStatus: PregnancyStatus = {
      hasActivePregnancy: true,
      expectedDateOfBirth: childFromPregnancyStatus.expectedDateOfBirth,
    }

    const applicationsWhereOtherParent: Application[] = [
      createApplicationWithChildren(PRIMARY_PARENT_ID, children, 0, {
        multipleBirths: {
          hasMultipleBirths: 'yes',
          multipleBirths: 3,
        },
        multipleBirthsRequestDays: 100,
        requestRights: {
          isRequestingRights: 'no',
        },
        giveRights: {
          isGivingRights: 'yes',
          giveDays: 45,
        },
      }),
    ]

    const result = getChildren(
      [],
      applicationsWhereOtherParent,
      pregnancyStatus,
    )

    expect(result[0].multipleBirthsDays).toBe(260)
    expect(result[0].transferredDays).toBe(0)
  })
})
