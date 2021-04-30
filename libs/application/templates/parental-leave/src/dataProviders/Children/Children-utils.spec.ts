import set from 'lodash/set'

import { Application } from '@island.is/application/core'

import {
  getChildrenAndExistingApplications,
  applicationsToExistingChildApplication,
} from './Children-utils'

import {
  ChildInformation,
  PregnancyStatus,
  ChildrenAndExistingApplications,
} from './types'

let id = 0

const PRIMARY_PARENT_ID = '0101302129'

const createApplicationWithChildren = (
  applicant: string,
  children: ChildInformation[],
  selectedChildIndex: number,
  state = '',
): Application => {
  const externalData: Application['externalData'] = {}

  set(externalData, 'children.data', {
    children,
  })

  return {
    answers: {
      selectedChild: `${selectedChildIndex}`,
    },
    applicant,
    assignees: [],
    attachments: {},
    created: new Date(),
    externalData,
    id: `${id++}`,
    modified: new Date(),
    state,
    status: 'inprogress' as Application['status'],
    typeId: 'ParentalLeave' as Application['typeId'],
  }
}

describe('getChildrenAndExistingApplications', () => {
  it('should return an empty list for both if no children pregnancy', () => {
    const applicationsWhereApplicant: Application[] = []
    const applicationsWhereOtherParent: Application[] = []
    const pregnancyStatus = undefined

    const expected: ChildrenAndExistingApplications = {
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
    const children: ChildInformation[] = [
      {
        expectedDateOfBirth: '2020-10-10',
        parentalRelation: 'primary',
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

    const expected: ChildrenAndExistingApplications = {
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

  it('should return child as secondary parental relation when listed as other parent in a primary parents application', () => {
    const children: ChildInformation[] = [
      {
        expectedDateOfBirth: '2020-10-10',
        parentalRelation: 'primary',
      },
    ]

    const applicationsWhereApplicant: Application[] = []
    const applicationsWhereOtherParent: Application[] = [
      createApplicationWithChildren(PRIMARY_PARENT_ID, children, 0),
    ]
    const pregnancyStatus = undefined

    const expectedChildren: ChildInformation[] = [
      {
        ...children[0],
        parentalRelation: 'secondary',
        primaryParentNationalRegistryId: PRIMARY_PARENT_ID,
      },
    ]

    const expected: ChildrenAndExistingApplications = {
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
    const children: ChildInformation[] = []

    const applicationsWhereApplicant: Application[] = []
    const applicationsWhereOtherParent: Application[] = []
    const pregnancyStatus: PregnancyStatus = {
      hasActivePregnancy: true,
      expectedDateOfBirth: '2021-05-10',
    }

    const expectedChildren: ChildInformation[] = [
      {
        parentalRelation: 'primary',
        expectedDateOfBirth: pregnancyStatus.expectedDateOfBirth,
      },
    ]

    const expected: ChildrenAndExistingApplications = {
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
})
