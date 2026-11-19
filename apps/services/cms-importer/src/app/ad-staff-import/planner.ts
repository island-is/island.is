import { EN_LOCALE, LOCALE } from '../constants'
import { MAX_REMOVAL_RATIO } from './constants'
import { isSyncedEntryId } from './mapper'
import {
  AdStaffSource,
  ExistingStaffEntry,
  StaffField,
  StaffMember,
  StaffSyncPlan,
} from './types'

interface PlanInput {
  source: AdStaffSource
  /** Staff members from Entra ID */
  desired: Array<StaffMember>
  /** Existing synced teamMember entries */
  existing: Array<ExistingStaffEntry>
  /** teamList.teamMembers as it is now */
  currentTeamMemberIds: Array<string>
  /** Entry ids of people still in the group who could not be mapped, they are not removed */
  retainedIds?: Array<string>
}

const sameIds = (a: Array<string>, b: Array<string>) =>
  a.length === b.length && a.every((id, index) => id === b[index])

const getChangedFields = (
  member: StaffMember,
  entry: ExistingStaffEntry,
): Array<StaffField> => {
  const changed: Array<StaffField> = []
  if (member.name !== entry.name) changed.push('name')
  if (
    member.title[LOCALE] !== entry.title[LOCALE] ||
    member.title[EN_LOCALE] !== entry.title[EN_LOCALE]
  ) {
    changed.push('title')
  }
  if ((member.email ?? '') !== (entry.email ?? '')) changed.push('email')
  if ((member.phone ?? '') !== (entry.phone ?? '')) changed.push('phone')
  if (
    !sameIds([...member.filterTagIds].sort(), [...entry.filterTagIds].sort())
  ) {
    changed.push('filterTags')
  }
  return changed
}

/**
 * Works out what to change in Contentful. Only fields that come from Entra ID are
 * compared, so things editors add in Contentful (intro, extra image) are kept.
 */
export const planStaffSync = ({
  source,
  desired,
  existing,
  currentTeamMemberIds,
  retainedIds = [],
}: PlanInput): StaffSyncPlan => {
  const existingById = new Map(existing.map((entry) => [entry.id, entry]))
  const keepIds = new Set([
    ...desired.map((member) => member.entryId),
    ...retainedIds,
  ])

  const plan: StaffSyncPlan = {
    create: [],
    update: [],
    remove: [],
    skipped: [],
    teamMemberIds: [],
    teamListChanged: false,
  }

  for (const member of desired) {
    const entry = existingById.get(member.entryId)
    if (!entry) {
      plan.create.push(member)
      continue
    }
    if (entry.hasUnpublishedChanges) {
      plan.skipped.push({
        entryId: member.entryId,
        reason: 'has unpublished changes in Contentful',
      })
      continue
    }
    const changedFields = getChangedFields(member, entry)
    if (changedFields.length > 0 || entry.isArchived || !entry.isPublished) {
      plan.update.push({ member, changedFields, unarchive: entry.isArchived })
    }
  }

  const removeIds = new Set([
    ...currentTeamMemberIds.filter(
      (id) => isSyncedEntryId(source, id) && !keepIds.has(id),
    ),
    ...existing
      .filter((entry) => !entry.isArchived && !keepIds.has(entry.id))
      .map((entry) => entry.id),
  ])
  plan.remove = [...removeIds]

  const teamMemberIds = currentTeamMemberIds.filter((id) => !removeIds.has(id))
  for (const member of desired) {
    if (!teamMemberIds.includes(member.entryId)) {
      teamMemberIds.push(member.entryId)
    }
  }
  plan.teamMemberIds = teamMemberIds
  plan.teamListChanged = !sameIds(currentTeamMemberIds, teamMemberIds)

  return plan
}

/**
 * Stops a run that would remove most of the list, e.g. when the group is empty
 * because of a misconfiguration. Returns an error message, or null when safe.
 */
export const checkPlanSafety = (
  plan: StaffSyncPlan,
  syncedCountInList: number,
): string | null => {
  if (syncedCountInList === 0 || plan.remove.length === 0) {
    return null
  }
  if (plan.remove.length > syncedCountInList * MAX_REMOVAL_RATIO) {
    return `Refusing to remove ${plan.remove.length} of ${syncedCountInList} synced staff members in one run`
  }
  return null
}
