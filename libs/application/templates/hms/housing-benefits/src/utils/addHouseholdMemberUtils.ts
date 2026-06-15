import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import * as kennitala from 'kennitala'
import * as m from '../lib/messages'
import {
  getAssigneeNationalIds,
  getCompletedAssigneeNationalIdSet,
  getHouseholdMembersOver18ExcludingApplicant,
  getRejectedAssigneeNames,
} from './assigneeUtils'
import { getRejectedAssigneeNationalIds } from './assigneeRejectionUtils'
import { hasAssigneeRolePrereqOk } from './mapUserToRole'
import {
  getRentalAgreementTenantsFlat,
  getRentalAgreementTenantsForStaticTable,
} from './rentalAgreementUtils'

type HouseholdMemberRepeaterRow = {
  nationalIdWithName?: { nationalId?: string; name?: string }
  isRemoved?: boolean
}

const normalizeKt = (nationalId: string): string =>
  kennitala.isValid(nationalId) ? kennitala.sanitize(nationalId) : nationalId

const assigneeDisplayName = (
  application: Application,
  nationalId: string,
): string => {
  const key = normalizeKt(nationalId)
  const fromAssigneeInfo = getValueViaPath<string>(
    application.answers,
    `${key}.assigneeInfo.name`,
  )?.trim()
  if (fromAssigneeInfo) return fromAssigneeInfo

  const members = getHouseholdMembersOver18ExcludingApplicant(application)
  const fromHousehold = members.find(
    (m) => normalizeKt(m.nationalId) === key,
  )?.name
  if (fromHousehold?.trim()) return fromHousehold.trim()

  const registry = application.externalData[
    `${key}.assigneeNationalRegistry`
  ] as { data?: { fullName?: string } } | undefined
  const fromRegistry = registry?.data?.fullName?.trim()
  if (fromRegistry) return fromRegistry

  return nationalId
}

/**
 * Assignees who approved external data and completed the assignee draft (signed).
 */
export const getAssigneesCompletedPrereqAndDraft = (
  application: Application,
): Array<{ nationalId: string; name: string }> => {
  const signed =
    getValueViaPath<string[]>(application.answers, 'signedAssignees') ?? []

  return signed
    .filter((id) => hasAssigneeRolePrereqOk(application, normalizeKt(id)))
    .map((nationalId) => ({
      nationalId: normalizeKt(nationalId),
      name: assigneeDisplayName(application, nationalId),
    }))
}

export const getRejectedAssigneeNationalIdSet = (
  application: Application,
): Set<string> =>
  new Set(
    getRejectedAssigneeNationalIds(application)
      .map((id) => normalizeKt(id))
      .filter(Boolean),
  )

const isRejectedAssignee = (
  application: Application,
  nationalId: string,
): boolean =>
  getRejectedAssigneeNationalIdSet(application).has(normalizeKt(nationalId))

/**
 * Repeater rows with rejected assignees removed (for persisting on state entry).
 */
export const getHouseholdTableRepeaterWithoutRejectedAssignees = (
  application: Application,
): HouseholdMemberRepeaterRow[] | undefined => {
  const rejectedKeys = getRejectedAssigneeNationalIdSet(application)
  const rows = getValueViaPath<HouseholdMemberRepeaterRow[]>(
    application.answers,
    'householdMembersTableRepeater',
  )
  if (!Array.isArray(rows)) return undefined
  if (rejectedKeys.size === 0) return rows

  return rows.filter((row) => {
    const natId = row.nationalIdWithName?.nationalId
    if (!natId) return true
    return !rejectedKeys.has(normalizeKt(natId))
  })
}

/**
 * `getStaticTableData` for the add-household-member screen (contract tenants).
 */
export const getAddHouseholdMemberStaticTableData = (
  application: Application,
): Record<string, string>[] => {
  const rejectedKeys = getRejectedAssigneeNationalIdSet(application)
  return getRentalAgreementTenantsForStaticTable(application).filter(
    (row) => !rejectedKeys.has(normalizeKt(row.nationalId)),
  )
}

/**
 * Pre-fills editable repeater rows: existing members minus rejected assignees,
 * or signed assignees who completed the assignee flow when nothing is stored yet.
 */
export const getAddHouseholdMemberTableRepeaterDefaultValue = (
  application: Application,
): Array<{
  nationalIdWithName: { name: string; nationalId: string }
}> => {
  const tenantKeys = new Set(
    getRentalAgreementTenantsFlat(application).map((t) =>
      normalizeKt(t.nationalId),
    ),
  )

  const existingRows = getValueViaPath<HouseholdMemberRepeaterRow[]>(
    application.answers,
    'householdMembersTableRepeater',
  )

  const fromExisting = (Array.isArray(existingRows) ? existingRows : [])
    .filter((row) => {
      if (row.isRemoved) return false
      const natId = row.nationalIdWithName?.nationalId
      if (!natId) return false
      return !isRejectedAssignee(application, natId)
    })
    .filter((row) => {
      const natId = row.nationalIdWithName?.nationalId ?? ''
      return !tenantKeys.has(normalizeKt(natId))
    })
    .map((row) => {
      const natId = normalizeKt(row.nationalIdWithName?.nationalId ?? '')
      const name =
        row.nationalIdWithName?.name?.trim() ||
        assigneeDisplayName(application, natId)
      return {
        nationalIdWithName: { name, nationalId: natId },
      }
    })

  if (fromExisting.length > 0) {
    return fromExisting
  }

  return getAssigneesCompletedPrereqAndDraft(application)
    .filter((m) => !tenantKeys.has(normalizeKt(m.nationalId)))
    .map((m) => ({
      nationalIdWithName: {
        name: m.name,
        nationalId: m.nationalId,
      },
    }))
}

/** Names of assignees removed from the table because they rejected (for UI copy). */
export const getRejectedAssigneeNamesForAddMemberScreen = (
  application: Application,
): string[] => getRejectedAssigneeNames(application)

export const rejectedAssigneesDescription = (application: Application) => {
  const names = getRejectedAssigneeNamesForAddMemberScreen(application)
  if (names.length === 0) {
    return m.addHouseholdMember.rejectedAssigneesEmpty
  }
  return {
    ...m.addHouseholdMember.rejectedAssigneesList,
    values: { names: names.join(' \n\n * ') },
  }
}

/**
 * True when the household table includes an over-18 member who has not yet signed or rejected.
 * Used after the add-household-member step to skip assignee re-approval when nothing new was added.
 */
export const hasNewHouseholdMembersNeedingApproval = (
  application: Application,
): boolean => {
  const completed = getCompletedAssigneeNationalIdSet(application)
  return getAssigneeNationalIds(application).some(
    (id) => !completed.has(normalizeKt(id)),
  )
}
