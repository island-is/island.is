import set from 'lodash/set'

import {
  ApplicationWithAttachments as Application,
  FormValue,
} from '@island.is/application/types'

import {
  collectChildren,
  getChildren,
  getChildrenFromMockData,
  applicationsToExistingChildApplication,
  applicationsToChildInformation,
  vmstParentalLeavesToChildApplicationLinks,
} from './children-utils'
import {
  ParentalRelations,
  ChildApplicationLink,
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

describe('collectChildren', () => {
  const child = (
    expectedDateOfBirth: string,
    extra: Partial<ChildInformationWithoutRights> = {},
  ) =>
    ({
      expectedDateOfBirth,
      parentalRelation: ParentalRelations.primary,
      ...extra,
    } as ChildInformationWithoutRights)

  it("should link a child to the applicant's existing application for it", () => {
    const result = collectChildren(
      [[child('2020-10-10')]],
      [
        {
          applicationId: 'app-1',
          expectedDateOfBirth: '2020-10-10',
          hasApplicationFundId: true,
          isChangeInProgress: false,
        },
      ],
    )

    expect(result).toHaveLength(1)
    expect(result[0].existingApplicationId).toBe('app-1')
  })

  it('should leave a child unlinked when no existing application matches', () => {
    // Children are matched on date of birth alone, so a different date is a
    // different child — this is why the mock path has to merge in the applicant's
    // earlier applications rather than rely on the date being retyped.
    const result = collectChildren(
      [[child('2028-01-01')]],
      [
        {
          applicationId: 'app-1',
          expectedDateOfBirth: '2027-03-04',
          hasApplicationFundId: true,
          isChangeInProgress: false,
        },
      ],
    )

    expect(result).toHaveLength(1)
    expect(result[0].existingApplicationId).toBeUndefined()
  })

  it('should let the earliest source win on duplicates', () => {
    const result = collectChildren(
      [
        [child('2020-10-10', { transferredDays: 45 })],
        [child('2020-10-10', { transferredDays: 0 })],
      ],
      [],
    )

    expect(result).toHaveLength(1)
    expect(result[0].transferredDays).toBe(45)
  })

  it('should keep distinct children from several sources', () => {
    const result = collectChildren(
      [[child('2020-10-10')], [child('2022-05-05')]],
      [],
    )

    expect(result.map((c) => c.expectedDateOfBirth)).toEqual([
      '2020-10-10',
      '2022-05-05',
    ])
  })

  it('should match foster care and adoption on adoption date', () => {
    const result = collectChildren(
      [[child('', { adoptionDate: '2021-06-01' })]],
      [
        {
          applicationId: 'app-1',
          expectedDateOfBirth: '',
          adoptionDate: '2021-06-01',
          hasApplicationFundId: true,
          isChangeInProgress: false,
        },
      ],
    )

    expect(result[0].existingApplicationId).toBe('app-1')
  })

  it('should prefer an in-progress change over an approved application for the same child', () => {
    // Otherwise picking the same child would spawn a second change alongside the
    // one already in flight.
    const result = collectChildren(
      [[child('2020-10-10')]],
      [
        {
          applicationId: 'approved-app',
          expectedDateOfBirth: '2020-10-10',
          hasApplicationFundId: true,
          isChangeInProgress: false,
        },
        {
          applicationId: 'change-app',
          expectedDateOfBirth: '2020-10-10',
          hasApplicationFundId: true,
          isChangeInProgress: true,
        },
      ],
    )

    expect(result[0].existingApplicationId).toBe('change-app')
    expect(result[0].existingApplicationIsChangeInProgress).toBe(true)
  })
})

describe('getChildren', () => {
  it('should return an empty list for both if no children pregnancy', () => {
    const applicationsWhereApplicant: Application[] = []
    const applicationsWhereOtherParent: Application[] = []
    const pregnancyStatus = undefined

    const expected: ChildInformationWithoutRights[] = []

    const { children: result } = getChildren(
      applicationsWhereApplicant,
      applicationsWhereOtherParent,
      pregnancyStatus,
    )

    expect(result).toStrictEqual(expected)
  })

  it('should keep a child the applicant already applied for, linked to that application', () => {
    // Nothing else produces this child once it is born: the other-parent list only
    // covers children someone else applied for, and pregnancy status goes false
    // after birth. If this list dropped it, the child would vanish from the select
    // screen entirely and the change flow would be unreachable.
    const children: ChildInformationWithoutRights[] = [
      {
        expectedDateOfBirth: '2020-10-10',
        parentalRelation: ParentalRelations.primary,
      },
    ]

    const existingApplication = createApplicationWithChildren(
      PRIMARY_PARENT_ID,
      children,
      0,
    )
    const applicationsWhereApplicant: Application[] = [existingApplication]
    const applicationsWhereOtherParent: Application[] = []
    const pregnancyStatus = undefined

    const expectedExistingApplications = applicationsToExistingChildApplication(
      applicationsWhereApplicant,
    )

    const expected: ChildInformationWithoutRights[] = [
      {
        ...children[0],
        existingApplicationId: existingApplication.id,
        existingApplicationHasFundId: false,
        existingApplicationIsChangeInProgress: false,
      },
    ]

    const { children: result } = getChildren(
      applicationsWhereApplicant,
      applicationsWhereOtherParent,
      pregnancyStatus,
    )

    expect(expectedExistingApplications.length).toBe(1)
    expect(result).toStrictEqual(expected)
  })

  it('should prefer a VMST match over a local historical application when both exist', () => {
    const children: ChildInformationWithoutRights[] = [
      {
        expectedDateOfBirth: '2020-10-10',
        parentalRelation: ParentalRelations.primary,
      },
    ]

    const existingApplication = createApplicationWithChildren(
      PRIMARY_PARENT_ID,
      children,
      0,
    )

    const { children: result } = getChildren(
      [existingApplication],
      [],
      undefined,
      [
        {
          applicationId: 'vmst-app-123',
          expectedDateOfBirth: '2020-10-10',
          hasApplicationFundId: true,
          isChangeInProgress: false,
        },
      ],
    )

    expect(result[0].existingApplicationId).toBe('vmst-app-123')
    expect(result[0].existingApplicationHasFundId).toBe(true)
  })

  it('should pass childApplicationLinks through unchanged in its return', () => {
    const links: ChildApplicationLink[] = [
      {
        childKey: 'vmst:vmst-app-1',
        vmstApplicationId: 'vmst-app-1',
        expectedDateOfBirth: '2027-04-10',
        applicationFundId: 'fund-1',
      },
    ]

    const { childApplicationLinks } = getChildren([], [], undefined, [], links)

    expect(childApplicationLinks).toBe(links)
  })

  it('should default childApplicationLinks to an empty list when none are provided', () => {
    const { childApplicationLinks } = getChildren([], [], undefined)

    expect(childApplicationLinks).toEqual([])
  })

  it("should keep an approved application's child selectable after the birth, with no pregnancy status", () => {
    // The scenario that regressed: apply, get approved by VMST, then come back to
    // change it. The child is born so pregnancy status is false, and the applicant
    // is the primary parent so nothing appears in the other-parent list either.
    const children: ChildInformationWithoutRights[] = [
      {
        expectedDateOfBirth: '2020-10-10',
        parentalRelation: ParentalRelations.primary,
      },
    ]

    const approvedApplication = createApplicationWithChildren(
      PRIMARY_PARENT_ID,
      children,
      0,
    )

    const { children: result } = getChildren([approvedApplication], [], {
      hasActivePregnancy: false,
      expectedDateOfBirth: '',
    })

    expect(result).toHaveLength(1)
    expect(result[0].existingApplicationId).toBe(approvedApplication.id)
  })

  it('should keep the child for a secondary parent who already applied, linked to that application', () => {
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

    // One application is one action, so the child stays selectable. The applicant's
    // own application is the source, so the child keeps the shape it had there and
    // the other-parent copy of the same child is deduped away.
    const expected: ChildInformationWithoutRights[] = [
      {
        ...children[0],
        existingApplicationId: existingApplication.id,
        existingApplicationHasFundId: false,
        existingApplicationIsChangeInProgress: false,
      },
    ]

    const { children: result, existingApplications } = getChildren(
      applicationsWhereApplicant,
      applicationsWhereOtherParent,
      pregnancyStatus,
    )

    expect(result).toStrictEqual(expected)
    expect(existingApplications).toStrictEqual(expectedExistingApplications)
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

    const { children: result } = getChildren(
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

    const { children: result } = getChildren(
      applicationsWhereApplicant,
      applicationsWhereOtherParent,
      pregnancyStatus,
    )

    expect(result.length).toBe(1)
    expect(result).toStrictEqual(expected)
  })

  it('should list an unborn child the primary parent already applied for exactly once, linked to that application', () => {
    const childFromPregnancyStatus: ChildInformationWithoutRights = {
      expectedDateOfBirth: '2021-05-10',
      parentalRelation: ParentalRelations.primary,
    }

    const children: ChildInformationWithoutRights[] = [childFromPregnancyStatus]

    const existingApplication = createApplicationWithChildren(
      PRIMARY_PARENT_ID,
      children,
      0,
    )
    const applicationsWhereApplicant: Application[] = [existingApplication]
    const applicationsWhereOtherParent: Application[] = []
    const pregnancyStatus: PregnancyStatus = {
      hasActivePregnancy: true,
      expectedDateOfBirth: childFromPregnancyStatus.expectedDateOfBirth,
    }

    // The child is kept so it can be changed, but the pregnancy status must not
    // add a second copy of it.
    const expected: ChildInformationWithoutRights[] = [
      {
        ...childFromPregnancyStatus,
        existingApplicationId: existingApplication.id,
        existingApplicationHasFundId: false,
        existingApplicationIsChangeInProgress: false,
      },
    ]

    const { children: result } = getChildren(
      applicationsWhereApplicant,
      applicationsWhereOtherParent,
      pregnancyStatus,
    )

    expect(result.length).toBe(1)
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

    const { children: result } = getChildren(
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

    const { children: result } = getChildren(
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

    const { children: result } = getChildren(
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

    const { children: result } = getChildren(
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

    const { children: result } = getChildren(
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

    const { children: result } = getChildren(
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

    const { children: result } = getChildren(
      [],
      applicationsWhereOtherParent,
      pregnancyStatus,
    )

    expect(result[0].multipleBirthsDays).toBe(260)
    expect(result[0].transferredDays).toBe(0)
  })
})

describe('getChildrenFromMockData', () => {
  it('should name the missing answer rather than crash on undefined.slice', () => {
    // It reads the mock answers off the application it is given. A follow-up has
    // none — mock is inherited from its predecessor and its own answers are not
    // seeded until prerequisites exit — so calling this for one used to throw
    // "Cannot read properties of undefined (reading 'slice')".
    const application = createApplicationWithChildren(
      PRIMARY_PARENT_ID,
      [],
      0,
      {
        mock: { useMockedParentalRelation: ParentalRelations.primary },
      },
    )

    expect(() => getChildrenFromMockData(application)).toThrow()
    expect(() => getChildrenFromMockData(application)).not.toThrow(
      /reading 'slice'/,
    )
  })
})

describe('vmstParentalLeavesToChildApplicationLinks', () => {
  it('should create a `vmst:<id>` link for every VMST record with an applicationId', () => {
    const links = vmstParentalLeavesToChildApplicationLinks([
      {
        applicationId: 'vmst-app-1',
        applicationFundId: 'fund-1',
        expectedDateOfBirth: '2027-04-10',
      },
      {
        applicationId: 'vmst-app-2',
        expectedDateOfBirth: '2027-08-11',
      },
    ])

    expect(links).toHaveLength(2)
    expect(links[0]).toMatchObject({
      childKey: 'vmst:vmst-app-1',
      vmstApplicationId: 'vmst-app-1',
      applicationFundId: 'fund-1',
      expectedDateOfBirth: '2027-04-10',
    })
    expect(links[1]).toMatchObject({
      childKey: 'vmst:vmst-app-2',
      vmstApplicationId: 'vmst-app-2',
      expectedDateOfBirth: '2027-08-11',
    })
  })

  it('should skip records with no applicationId', () => {
    const links = vmstParentalLeavesToChildApplicationLinks([
      { expectedDateOfBirth: '2027-04-10' },
    ])

    expect(links).toHaveLength(0)
  })

  it('should keep the existing childKey when VMST re-reports the same applicationId', () => {
    const previous: ChildApplicationLink[] = [
      {
        childKey: 'vmst:vmst-app-1',
        vmstApplicationId: 'vmst-app-1',
        expectedDateOfBirth: '2027-04-10',
      },
    ]

    // VMST now revises the expected DOB. The link must not be rekeyed on that
    // change, otherwise the change flow loses its anchor.
    const links = vmstParentalLeavesToChildApplicationLinks(
      [
        {
          applicationId: 'vmst-app-1',
          expectedDateOfBirth: '2027-04-15',
          applicationFundId: 'fund-1',
        },
      ],
      previous,
    )

    expect(links).toHaveLength(1)
    expect(links[0].childKey).toBe('vmst:vmst-app-1')
    expect(links[0].expectedDateOfBirth).toBe('2027-04-15')
    expect(links[0].applicationFundId).toBe('fund-1')
  })

  it('should preserve prior links VMST momentarily omits', () => {
    const previous: ChildApplicationLink[] = [
      {
        childKey: 'vmst:vmst-app-1',
        vmstApplicationId: 'vmst-app-1',
        expectedDateOfBirth: '2027-04-10',
        applicationFundId: 'fund-1',
      },
    ]

    // VMST returns nothing this round — a known transient state around submission.
    // Forgetting the link would flicker the change row off.
    const links = vmstParentalLeavesToChildApplicationLinks([], previous)

    expect(links).toEqual(previous)
  })

  it('should produce distinct links for twins that share an expected DOB', () => {
    const links = vmstParentalLeavesToChildApplicationLinks([
      { applicationId: 'vmst-app-twin-1', expectedDateOfBirth: '2027-04-10' },
      { applicationId: 'vmst-app-twin-2', expectedDateOfBirth: '2027-04-10' },
    ])

    expect(links.map((l) => l.vmstApplicationId)).toEqual([
      'vmst-app-twin-1',
      'vmst-app-twin-2',
    ])
    expect(new Set(links.map((l) => l.childKey)).size).toBe(2)
  })

  it('should backfill missing fields from prior links without dropping them', () => {
    const previous: ChildApplicationLink[] = [
      {
        childKey: 'vmst:vmst-app-1',
        vmstApplicationId: 'vmst-app-1',
        expectedDateOfBirth: '2027-04-10',
        applicationFundId: 'fund-1',
      },
    ]

    // VMST omits applicationFundId this round; we must not drop it from the link.
    const links = vmstParentalLeavesToChildApplicationLinks(
      [
        {
          applicationId: 'vmst-app-1',
          expectedDateOfBirth: '2027-04-10',
          dateOfBirth: '2027-04-12',
        },
      ],
      previous,
    )

    expect(links[0].applicationFundId).toBe('fund-1')
    expect(links[0].dateOfBirth).toBe('2027-04-12')
  })
})
