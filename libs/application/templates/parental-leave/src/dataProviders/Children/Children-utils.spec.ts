import set from 'lodash/set'

import { Application, FormValue } from '@island.is/application/core'

import { ParentalRelations } from '../../constants'
import {
  getChildrenAndExistingApplications,
  applicationsToExistingChildApplication,
} from './Children-utils'
import {
  ChildInformationWithoutRights,
  PregnancyStatus,
  ChildrenWithoutRightsAndExistingApplications,
  ChildInformation,
} from './types'

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

describe('getChildrenAndExistingApplications', () => {
  it('should return an empty list for both if no children pregnancy', () => {
    const applicationsWhereApplicant: Application[] = []
    const applicationsWhereOtherParent: Application[] = []
    const pregnancyStatus = undefined

    const expected: ChildrenWithoutRightsAndExistingApplications = {
      children: [],
      existingApplications: [],
    }

    const result = getChildrenAndExistingApplications(
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

    const expected: ChildrenWithoutRightsAndExistingApplications = {
      children: [],
      existingApplications: expectedExistingApplications,
    }

    const result = getChildrenAndExistingApplications(
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

    const expected: ChildrenWithoutRightsAndExistingApplications = {
      children: [],
      existingApplications: expectedExistingApplications,
    }

    const result = getChildrenAndExistingApplications(
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
      },
    ]

    const expected: ChildrenWithoutRightsAndExistingApplications = {
      children: expectedChildren,
      existingApplications: [],
    }

    const result = getChildrenAndExistingApplications(
      applicationsWhereApplicant,
      applicationsWhereOtherParent,
      pregnancyStatus,
    )

    expect(result.children.length).toBe(1)
    expect(result).toStrictEqual(expected)
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

    const expected: ChildrenWithoutRightsAndExistingApplications = {
      children: expectedChildren,
      existingApplications: [],
    }

    const result = getChildrenAndExistingApplications(
      applicationsWhereApplicant,
      applicationsWhereOtherParent,
      pregnancyStatus,
    )

    expect(result.children.length).toBe(1)
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

    const expected: ChildrenWithoutRightsAndExistingApplications = {
      children: [],
      existingApplications: [
        {
          applicationId: applicationsWhereApplicant[0].id,
          expectedDateOfBirth: childFromPregnancyStatus.expectedDateOfBirth,
        },
      ],
    }

    const result = getChildrenAndExistingApplications(
      applicationsWhereApplicant,
      applicationsWhereOtherParent,
      pregnancyStatus,
    )

    expect(result.existingApplications.length).toBe(1)
    expect(result.children.length).toBe(0)
    expect(result).toStrictEqual(expected)
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

    const result = getChildrenAndExistingApplications(
      [],
      applicationsWhereOtherParent,
      pregnancyStatus,
    )

    expect(result.children[0].transferredDays).toBe(-45)
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

    const result = getChildrenAndExistingApplications(
      [],
      applicationsWhereOtherParent,
      pregnancyStatus,
    )

    expect(result.children[0].transferredDays).toBe(45)
  })
})
