import { checkPlanSafety, planStaffSync } from './planner'
import { AdStaffSource, ExistingStaffEntry, StaffMember } from './types'

const source: AdStaffSource = {
  key: 'test',
  teamListId: 'team-list',
  contentfulTagId: 'ownerTest',
  placeholderPhotoAssetId: 'placeholder',
  departmentTagIds: {},
}

const member = (n: number, overrides: Partial<StaffMember> = {}) => ({
  entryId: `adstaff-test-${n}`,
  adObjectId: `${n}`,
  name: `Person ${n}`,
  title: { 'is-IS': 'Ritari', en: 'Secretary' },
  email: `person${n}@example.is`,
  filterTagIds: ['tag-a'],
  ...overrides,
})

const existing = (
  m: StaffMember,
  overrides: Partial<ExistingStaffEntry> = {},
): ExistingStaffEntry => ({
  id: m.entryId,
  name: m.name,
  title: { ...m.title },
  email: m.email,
  phone: m.phone,
  filterTagIds: [...m.filterTagIds],
  isArchived: false,
  isPublished: true,
  hasUnpublishedChanges: false,
  ...overrides,
})

describe('planStaffSync', () => {
  it('creates new people and appends them to the list', () => {
    const plan = planStaffSync({
      source,
      desired: [member(1), member(2)],
      existing: [existing(member(1))],
      currentTeamMemberIds: ['manual-entry', 'adstaff-test-1'],
    })

    expect(plan.create.map((m) => m.entryId)).toEqual(['adstaff-test-2'])
    expect(plan.update).toEqual([])
    expect(plan.remove).toEqual([])
    expect(plan.teamMemberIds).toEqual([
      'manual-entry',
      'adstaff-test-1',
      'adstaff-test-2',
    ])
    expect(plan.teamListChanged).toBe(true)
  })

  it('updates only the fields that changed', () => {
    const updated = member(1, {
      title: { 'is-IS': 'Sálfræðingur', en: 'Psychologist' },
      phone: '555 0000',
    })

    const plan = planStaffSync({
      source,
      desired: [updated],
      existing: [existing(member(1))],
      currentTeamMemberIds: ['adstaff-test-1'],
    })

    expect(plan.update).toEqual([
      { member: updated, changedFields: ['title', 'phone'], unarchive: false },
    ])
    expect(plan.teamListChanged).toBe(false)
  })

  it('does nothing when nothing changed, regardless of tag order', () => {
    const m = member(1, { filterTagIds: ['tag-a', 'tag-b'] })

    const plan = planStaffSync({
      source,
      desired: [m],
      existing: [existing(m, { filterTagIds: ['tag-b', 'tag-a'] })],
      currentTeamMemberIds: ['adstaff-test-1'],
    })

    expect(plan.create).toEqual([])
    expect(plan.update).toEqual([])
    expect(plan.remove).toEqual([])
    expect(plan.teamListChanged).toBe(false)
  })

  it('removes leavers but keeps manually added members', () => {
    const plan = planStaffSync({
      source,
      desired: [member(1)],
      existing: [existing(member(1)), existing(member(2))],
      currentTeamMemberIds: [
        'adstaff-test-1',
        'manual-entry',
        'adstaff-test-2',
      ],
    })

    expect(plan.remove).toEqual(['adstaff-test-2'])
    expect(plan.teamMemberIds).toEqual(['adstaff-test-1', 'manual-entry'])
  })

  it('keeps people who are still in the group but could not be mapped', () => {
    const plan = planStaffSync({
      source,
      desired: [],
      existing: [existing(member(1))],
      currentTeamMemberIds: ['adstaff-test-1'],
      retainedIds: ['adstaff-test-1'],
    })

    expect(plan.remove).toEqual([])
    expect(plan.teamMemberIds).toEqual(['adstaff-test-1'])
  })

  it('skips entries with unpublished changes', () => {
    const plan = planStaffSync({
      source,
      desired: [member(1, { name: 'New Name' })],
      existing: [existing(member(1), { hasUnpublishedChanges: true })],
      currentTeamMemberIds: ['adstaff-test-1'],
    })

    expect(plan.update).toEqual([])
    expect(plan.skipped).toEqual([
      {
        entryId: 'adstaff-test-1',
        reason: 'has unpublished changes in Contentful',
      },
    ])
  })

  it('unarchives people who come back', () => {
    const m = member(1)

    const plan = planStaffSync({
      source,
      desired: [m],
      existing: [existing(m, { isArchived: true })],
      currentTeamMemberIds: [],
    })

    expect(plan.create).toEqual([])
    expect(plan.update).toEqual([
      { member: m, changedFields: [], unarchive: true },
    ])
    expect(plan.teamMemberIds).toEqual(['adstaff-test-1'])
  })

  it('publishes entries a failed run left unpublished', () => {
    const m = member(1)

    const plan = planStaffSync({
      source,
      desired: [m],
      existing: [existing(m, { isPublished: false })],
      currentTeamMemberIds: [],
    })

    expect(plan.update).toEqual([
      { member: m, changedFields: [], unarchive: false },
    ])
  })
})

describe('checkPlanSafety', () => {
  const planRemoving = (count: number) =>
    planStaffSync({
      source,
      desired: [],
      existing: [],
      currentTeamMemberIds: Array.from(
        { length: count },
        (_, i) => `adstaff-test-${i}`,
      ),
    })

  it('allows the first run and small removals', () => {
    expect(checkPlanSafety(planRemoving(0), 0)).toBeNull()
    expect(checkPlanSafety(planRemoving(2), 10)).toBeNull()
  })

  it('stops a run that would remove most of the list', () => {
    expect(checkPlanSafety(planRemoving(10), 10)).toBe(
      'Refusing to remove 10 of 10 synced staff members in one run',
    )
  })
})
