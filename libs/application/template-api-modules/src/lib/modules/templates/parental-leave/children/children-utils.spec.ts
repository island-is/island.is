import set from 'lodash/set'

import {
  ApplicationWithAttachments as Application,
  FormValue,
} from '@island.is/application/types'

import {
  ApplicationStage,
  applicationsToInProgressChildApplications,
  collectChildren,
  getApplicationStage,
  isPrimaryParentApplicationForOtherParent,
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
  States,
} from '@island.is/application/templates/parental-leave'

let id = 0

const PRIMARY_PARENT_ID = '0101302129'
const SECONDARY_PARENT_ID = '0101302239'

const createApplicationWithChildren = (
  applicant: string,
  children: ChildInformationWithoutRights[],
  selectedChildIndex: number,
  answers?: FormValue,
  state: string = States.APPROVED,
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
    state,
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

describe('applicationsToExistingChildApplication', () => {
  const child: ChildInformationWithoutRights = {
    expectedDateOfBirth: '2027-03-04',
    parentalRelation: ParentalRelations.primary,
  }
  const withFundId = (fundId: string) => {
    const application = createApplicationWithChildren(
      PRIMARY_PARENT_ID,
      [child],
      0,
    )
    set(application, 'externalData.navId', {
      data: fundId,
      date: new Date(),
      status: 'success',
    })
    return application
  }

  it('should link a child to an application VMST has received', () => {
    expect(
      applicationsToExistingChildApplication([withFundId('2025-03076')]),
    ).toEqual([
      expect.objectContaining({
        expectedDateOfBirth: '2027-03-04',
      }),
    ])
  })

  // A mock application never reached VMST, so there is no leave a change could
  // continue: its child is offered as a first-time application instead.
  it('should not link a child to a mock application', () => {
    expect(
      applicationsToExistingChildApplication([
        withFundId('mock-application-fund-id'),
      ]),
    ).toEqual([])
  })
})

describe('applicationsToInProgressChildApplications', () => {
  const child: ChildInformationWithoutRights = {
    expectedDateOfBirth: '2027-03-04',
    parentalRelation: ParentalRelations.primary,
  }
  const inState = (state: string, answers?: FormValue) =>
    createApplicationWithChildren(PRIMARY_PARENT_ID, [child], 0, answers, state)

  it.each([
    States.DRAFT,
    States.OTHER_PARENT_APPROVAL,
    States.EMPLOYER_WAITING_TO_ASSIGN,
    States.EMPLOYER_APPROVAL,
    States.VINNUMALASTOFNUN_APPROVAL,
    States.ADDITIONAL_DOCUMENTS_REQUIRED,
  ])('should hold the child of a first-time application in %s', (state) => {
    expect(applicationsToInProgressChildApplications([inState(state)])).toEqual(
      [
        expect.objectContaining({
          expectedDateOfBirth: '2027-03-04',
          isApplicationInProgress: true,
          isChangeInProgress: false,
        }),
      ],
    )
  })

  it.each([
    States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
    States.EMPLOYER_APPROVE_EDITS,
    States.VINNUMALASTOFNUN_APPROVE_EDITS,
  ])('should hold the child of a change in %s', (state) => {
    expect(
      applicationsToInProgressChildApplications([
        inState(state, { applicationAction: 'change' }),
      ]),
    ).toEqual([
      expect.objectContaining({
        isApplicationInProgress: false,
        isChangeInProgress: true,
      }),
    ])
  })

  it.each([States.PREREQUISITES, States.APPROVED, States.CLOSED])(
    'should not hold the child of an application in %s',
    (state) => {
      expect(
        applicationsToInProgressChildApplications([inState(state)]),
      ).toEqual([])
    },
  )

  it('should not hold the child of a mock application', () => {
    const application = inState(States.VINNUMALASTOFNUN_APPROVAL)
    set(application, 'externalData.navId', {
      data: 'mock-application-fund-id',
      date: new Date(),
      status: 'success',
    })

    expect(applicationsToInProgressChildApplications([application])).toEqual([])
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
          isChangeInProgress: false,
        },
      ],
    )

    expect(result).toHaveLength(1)
    expect(result[0].vmstApplicationId).toBe('app-1')
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
          isChangeInProgress: false,
        },
      ],
    )

    expect(result).toHaveLength(1)
    expect(result[0].vmstApplicationId).toBeUndefined()
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
          isChangeInProgress: false,
        },
      ],
    )

    expect(result[0].vmstApplicationId).toBe('app-1')
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
          isChangeInProgress: false,
        },
        {
          applicationId: 'change-app',
          expectedDateOfBirth: '2020-10-10',
          isChangeInProgress: true,
        },
      ],
    )

    expect(result[0].inProgressApplicationId).toBe('change-app')
    expect(result[0].inProgressIsChange).toBe(true)
    expect(result[0].vmstApplicationId).toBe('approved-app')
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
        vmstApplicationId: existingApplication.id,
        key: `vmst:${existingApplication.id}`,
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

  // VMST does not know about an application still with the other parent or the
  // employer, and its list never says a change is under way.
  it.each([
    [States.EMPLOYER_APPROVAL, undefined, false],
    [
      States.VINNUMALASTOFNUN_APPROVE_EDITS,
      { applicationAction: 'change' },
      true,
    ],
  ] as const)(
    'should hold a child with an unfinished application in %s even when VMST lists the leave',
    (state, answers, isChange) => {
      const children: ChildInformationWithoutRights[] = [
        {
          expectedDateOfBirth: '2020-10-10',
          parentalRelation: ParentalRelations.primary,
        },
      ]
      const unfinished = createApplicationWithChildren(
        PRIMARY_PARENT_ID,
        children,
        0,
        answers,
        state,
      )

      const { children: result } = getChildren([unfinished], [], undefined, [
        {
          applicationId: 'vmst-app-123',
          expectedDateOfBirth: '2020-10-10',
          isChangeInProgress: false,
        },
      ])

      expect(result[0].inProgressApplicationId).toBe(unfinished.id)
      expect(!!result[0].inProgressIsChange).toBe(isChange)
      expect(result[0].vmstApplicationId).toBe('vmst-app-123')
    },
  )

  it('should drop a stale link copied from an earlier application', () => {
    const children: ChildInformationWithoutRights[] = [
      {
        expectedDateOfBirth: '2020-10-10',
        parentalRelation: ParentalRelations.primary,
        vmstApplicationId: 'long-gone-mock-application',
        inProgressApplicationId: 'long-gone-mock-application',
        inProgressIsChange: true,
      },
    ]
    const earlier = createApplicationWithChildren(
      PRIMARY_PARENT_ID,
      children,
      0,
    )
    set(earlier, 'externalData.navId', {
      data: 'mock-application-fund-id',
      date: new Date(),
      status: 'success',
    })

    const { children: result } = getChildren([earlier], [], undefined)

    expect(result).toStrictEqual([
      {
        expectedDateOfBirth: '2020-10-10',
        parentalRelation: ParentalRelations.primary,
        key: 'edd:2020-10-10',
      },
    ])
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
          isChangeInProgress: false,
        },
      ],
    )

    expect(result[0].vmstApplicationId).toBe('vmst-app-123')
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
    expect(result[0].vmstApplicationId).toBe(approvedApplication.id)
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
        vmstApplicationId: existingApplication.id,
        key: `vmst:${existingApplication.id}`,
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
        key: 'edd:2020-10-10',
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
        key: 'edd:2021-05-10',
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
        vmstApplicationId: existingApplication.id,
        key: `vmst:${existingApplication.id}`,
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

describe('child linking consistency', () => {
  const primaryChild = (
    expectedDateOfBirth: string,
  ): ChildInformationWithoutRights => ({
    expectedDateOfBirth,
    parentalRelation: ParentalRelations.primary,
  })
  const leave = (
    applicationId: string,
    dates: { expectedDateOfBirth?: string; dateOfBirth?: string },
  ) => ({
    applicationId,
    expectedDateOfBirth: dates.expectedDateOfBirth ?? '',
    dateOfBirth: dates.dateOfBirth,
    isChangeInProgress: false,
  })
  const withFundId = (application: Application, fundId = '2025-03076') => {
    set(application, 'externalData.navId', {
      data: fundId,
      date: new Date(),
      status: 'success',
    })
    return application
  }

  it('should link a VMST leave whose dates carry a time part', () => {
    const { children } = getChildren(
      [],
      [],
      { hasActivePregnancy: true, expectedDateOfBirth: '2027-03-04' },
      [leave('vmst-1', { expectedDateOfBirth: '2027-03-04T00:00:00' })],
    )

    expect(children).toHaveLength(1)
    expect(children[0].vmstApplicationId).toBe('vmst-1')
    expect(children[0].key).toBe('vmst:vmst-1')
  })

  it('should treat a moved due date as the same pregnancy the leave was applied for', () => {
    const applied = createApplicationWithChildren(
      PRIMARY_PARENT_ID,
      [primaryChild('2027-03-04')],
      0,
    )

    const { children } = getChildren(
      [applied],
      [],
      { hasActivePregnancy: true, expectedDateOfBirth: '2027-03-20' },
      [leave(applied.id, { expectedDateOfBirth: '2027-03-04' })],
    )

    expect(children).toHaveLength(1)
    expect(children[0].vmstApplicationId).toBe(applied.id)
  })

  it('should link a registered pregnancy to a leave applied for on paper under an earlier due date', () => {
    const { children } = getChildren(
      [],
      [],
      { hasActivePregnancy: true, expectedDateOfBirth: '2027-03-20' },
      [leave('paper-leave', { expectedDateOfBirth: '2027-03-04' })],
    )

    expect(children).toHaveLength(1)
    expect(children[0].vmstApplicationId).toBe('paper-leave')
  })

  it('should keep a pregnancy due well apart from an earlier leave as a new child', () => {
    const { children } = getChildren(
      [],
      [],
      { hasActivePregnancy: true, expectedDateOfBirth: '2028-06-01' },
      [leave('older-leave', { expectedDateOfBirth: '2027-03-04' })],
    )

    expect(children).toHaveLength(1)
    expect(children[0].vmstApplicationId).toBeUndefined()
  })

  it('should not match a simulated development pregnancy on a moved due date', () => {
    const { children } = getChildren(
      [],
      [],
      {
        hasActivePregnancy: true,
        expectedDateOfBirth: '2027-03-20',
        isSimulated: true,
      },
      [leave('dev-leave', { expectedDateOfBirth: '2027-03-04' })],
    )

    expect(children[0].vmstApplicationId).toBeUndefined()
  })

  it("should link the applicant's own child to its leave by id and take VMST's dates", () => {
    const applied = createApplicationWithChildren(
      PRIMARY_PARENT_ID,
      [primaryChild('2027-03-04')],
      0,
    )

    const { children } = getChildren([applied], [], undefined, [
      leave(applied.id, {
        expectedDateOfBirth: '2027-03-15',
        dateOfBirth: '2027-03-12',
      }),
    ])

    expect(children).toEqual([
      expect.objectContaining({
        vmstApplicationId: applied.id,
        expectedDateOfBirth: '2027-03-15',
        dateOfBirth: '2027-03-12',
      }),
    ])
  })

  it('should offer no change when VMST answered and lists no leave for the child', () => {
    const approved = createApplicationWithChildren(
      PRIMARY_PARENT_ID,
      [primaryChild('2027-03-04')],
      0,
    )

    const { children } = getChildren([approved], [], undefined, [])

    expect(children).toHaveLength(1)
    expect(children[0].vmstApplicationId).toBeUndefined()
  })

  it("should fall back to the leave's root id, not a change application's, when VMST is unavailable", () => {
    const change = withFundId(
      createApplicationWithChildren(
        PRIMARY_PARENT_ID,
        [primaryChild('2027-03-04')],
        0,
        { applicationAction: 'change', initialQuery: 'root-application-id' },
      ),
    )

    const { children } = getChildren([change], [], undefined, null)

    expect(children[0].vmstApplicationId).toBe('root-application-id')
  })

  it('should not offer a change for a closed application when VMST is unavailable', () => {
    const closed = withFundId(
      createApplicationWithChildren(
        PRIMARY_PARENT_ID,
        [primaryChild('2027-03-04')],
        0,
        undefined,
        States.CLOSED,
      ),
    )

    expect(applicationsToExistingChildApplication([closed])).toEqual([])
  })

  it('should not offer a change for an unfinished application that never reached VMST', () => {
    const draft = createApplicationWithChildren(
      PRIMARY_PARENT_ID,
      [primaryChild('2027-03-04')],
      0,
      undefined,
      States.DRAFT,
    )

    expect(applicationsToExistingChildApplication([draft])).toEqual([])
  })

  it("should refresh a secondary parent's earlier snapshot with the primary parent's current transfer", () => {
    const staleSnapshot: ChildInformationWithoutRights = {
      expectedDateOfBirth: '2027-03-04',
      parentalRelation: ParentalRelations.secondary,
      primaryParentNationalRegistryId: PRIMARY_PARENT_ID,
      transferredDays: 45,
    }
    const ownEarlier = createApplicationWithChildren(
      SECONDARY_PARENT_ID,
      [staleSnapshot],
      0,
    )
    const primaryApplication = createApplicationWithChildren(
      PRIMARY_PARENT_ID,
      [primaryChild('2027-03-04')],
      0,
      { otherParentId: SECONDARY_PARENT_ID },
    )

    const { children } = getChildren([ownEarlier], [primaryApplication], null)

    expect(children).toHaveLength(1)
    expect(children[0].transferredDays).toBe(0)
  })

  it("should take the most recently modified of the primary parent's applications", () => {
    const older = createApplicationWithChildren(
      PRIMARY_PARENT_ID,
      [primaryChild('2027-03-04')],
      0,
      {
        otherParentId: SECONDARY_PARENT_ID,
        multipleBirths: { hasMultipleBirths: 'yes', multipleBirths: 2 },
      },
    )
    older.modified = new Date('2026-01-01')
    const newer = createApplicationWithChildren(
      PRIMARY_PARENT_ID,
      [primaryChild('2027-03-04')],
      0,
      { otherParentId: SECONDARY_PARENT_ID },
    )
    newer.modified = new Date('2026-06-01')

    const { children } = getChildren([], [older, newer], null)

    expect(children).toHaveLength(1)
    expect(children[0].multipleBirthsDays).toBe(0)
  })

  it('should give every child a unique key', () => {
    const { children } = getChildren(
      [
        createApplicationWithChildren(
          PRIMARY_PARENT_ID,
          [primaryChild('2026-01-01')],
          0,
        ),
      ],
      [],
      { hasActivePregnancy: true, expectedDateOfBirth: '2027-03-04' },
      [],
    )

    expect(children.map((child) => child.key)).toEqual([
      'edd:2026-01-01',
      'edd:2027-03-04',
    ])
  })
})

describe('getApplicationStage', () => {
  const child: ChildInformationWithoutRights = {
    expectedDateOfBirth: '2027-03-04',
    parentalRelation: ParentalRelations.primary,
  }

  it.each([
    States.OTHER_PARENT_APPROVAL_FOR_EDITS,
    States.ADDITIONAL_DOCUMENTS_REQUIRED_FOR_EDITS,
  ])('should treat %s as a change in progress', (state) => {
    expect(
      getApplicationStage(
        createApplicationWithChildren(PRIMARY_PARENT_ID, [child], 0, {}, state),
      ),
    ).toBe(ApplicationStage.CHANGE_IN_PROGRESS)
  })

  it.each([
    States.RESIDENCE_GRANT_APPLICATION,
    States.RESIDENCE_GRANT_APPLICATION_NO_BIRTH_DATE,
  ])('should treat a residence grant in %s as in progress', (state) => {
    expect(
      getApplicationStage(
        createApplicationWithChildren(
          PRIMARY_PARENT_ID,
          [child],
          0,
          { applicationAction: 'residenceGrant' },
          state,
        ),
      ),
    ).toBe(ApplicationStage.IN_PROGRESS)
  })
})

describe('isPrimaryParentApplicationForOtherParent', () => {
  const child: ChildInformationWithoutRights = {
    expectedDateOfBirth: '2027-03-04',
    parentalRelation: ParentalRelations.primary,
  }
  const inState = (state: string, fundId?: string) => {
    const application = createApplicationWithChildren(
      PRIMARY_PARENT_ID,
      [child],
      0,
      { otherParentId: SECONDARY_PARENT_ID },
      state,
    )
    if (fundId) {
      set(application, 'externalData.navId', {
        data: fundId,
        date: new Date(),
        status: 'success',
      })
    }
    return application
  }

  it('should accept an approved application', () => {
    expect(
      isPrimaryParentApplicationForOtherParent(inState(States.APPROVED)),
    ).toBe(true)
  })

  it('should refuse a closed application', () => {
    expect(
      isPrimaryParentApplicationForOtherParent(
        inState(States.CLOSED, 'fund-1'),
      ),
    ).toBe(false)
  })

  it('should refuse an application that has not reached VMST', () => {
    expect(
      isPrimaryParentApplicationForOtherParent(inState(States.DRAFT)),
    ).toBe(false)
  })

  it('should refuse a mock application', () => {
    expect(
      isPrimaryParentApplicationForOtherParent(
        inState(States.APPROVED, 'mock-application-fund-id'),
      ),
    ).toBe(false)
  })
})
