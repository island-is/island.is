import { getValueViaPath } from '@island.is/application/core'
import {
  ApplicantChildCustodyInformationV3,
  Application,
  ApplicationStatus,
  ApplicationTypes,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import { BffUser } from '@island.is/shared/types'
import * as kennitala from 'kennitala'
import {
  getApplicantChildCustodyNationalIdSet,
  getNonCustodyMinorsMissingCustodyAgreementNationalIds,
  minorHasAnyUmgengnissamningurUploadAttached,
} from './utils'
import {
  getHouseholdMembersForTable,
  getRentalAgreementTenantsFlat,
} from './rentalAgreementUtils'
import { hasAssigneeRolePrereqOk } from './mapUserToRole'
import {
  getRejectedAssigneeNationalIds,
  getRejectedAssigneeNationalIdsFromAnswers,
} from './assigneeRejectionUtils'

export {
  getRejectedAssigneeNationalIds,
  getRejectedAssigneeNationalIdsFromAnswers,
  hasRejectedAssignees,
  hasRejectedAssigneesInAnswers,
} from './assigneeRejectionUtils'

const comparableNationalId = (nationalId: string): string =>
  kennitala.isValid(nationalId)
    ? kennitala.sanitize(nationalId)
    : nationalId.replace(/\D/g, '')

const normalizeKennitalaKey = (nationalId: string | undefined | null) => {
  if (!nationalId || typeof nationalId !== 'string') return ''
  const trimmed = nationalId.trim()
  if (!trimmed) return ''
  return kennitala.isValid(trimmed) ? kennitala.sanitize(trimmed) : trimmed
}

/**
 * Children in a given assignee's forsjá from stored external data (`{kt}.assigneeChildrenCustody`).
 * Empty set if the provider was never run or has no data.
 */
export const buildChildNationalIdSetFromAssigneeExternalData = (
  externalData: ExternalData,
  assigneeKennitala: string,
): Set<string> => {
  if (!assigneeKennitala?.trim()) return new Set()
  const kt = kennitala.isValid(assigneeKennitala)
    ? kennitala.sanitize(assigneeKennitala)
    : assigneeKennitala.trim()
  const entry = externalData[`${kt}.assigneeChildrenCustody`] as
    | { data?: ApplicantChildCustodyInformationV3[]; status?: string }
    | undefined
  const raw = entry?.data
  const set = new Set<string>()
  for (const child of Array.isArray(raw) ? raw : []) {
    const key = normalizeKennitalaKey(child.nationalId)
    if (key) set.add(key)
  }
  return set
}

export const applicationFromFormValue = (
  answers: FormValue,
  externalData: ExternalData,
): Application => {
  const raw =
    getValueViaPath<string>(answers, 'applicant.nationalId')?.trim() ?? ''
  const applicant = kennitala.isValid(raw) ? kennitala.sanitize(raw) : raw
  return {
    id: 'assignee-form-eval',
    state: 'assignee-approval',
    applicant,
    assignees: [],
    applicantActors: [],
    typeId: ApplicationTypes.HOUSING_BENEFITS,
    modified: new Date(),
    created: new Date(),
    answers,
    externalData,
    status: ApplicationStatus.IN_PROGRESS,
  } as Application
}

const assigneeHasCustodyExternalDataKey = (
  externalData: ExternalData,
  assigneeKennitala: string,
): boolean => {
  if (!assigneeKennitala?.trim()) return false
  const kt = kennitala.isValid(assigneeKennitala)
    ? kennitala.sanitize(assigneeKennitala)
    : assigneeKennitala.trim()
  return Object.prototype.hasOwnProperty.call(
    externalData,
    `${kt}.assigneeChildrenCustody`,
  )
}

/**
 * Gets household members over 18 (excluding applicant) who need to sign the application.
 * Contract tenants are always included; repeater rows add domicile/custody/extra people.
 * When the repeater has not been stored yet, falls back to the merged list from external data.
 */
export const getHouseholdMembersOver18ExcludingApplicant = (
  application: Application,
): Array<{ nationalId: string; name: string }> => {
  const applicantNationalId = application.applicant
  const tableRows = getValueViaPath<
    Array<{
      isRemoved?: boolean
      nationalIdWithName?: { nationalId?: string; name?: string }
    }>
  >(application.answers, 'householdMembersTableRepeater')

  let allMembers: Array<{ nationalId: string; name: string }> = []

  if (Array.isArray(tableRows)) {
    const contractTenants = getRentalAgreementTenantsFlat(application)
    const tenantKeySet = new Set(
      contractTenants
        .map((t) => comparableNationalId(t.nationalId))
        .filter(Boolean),
    )
    allMembers = [...contractTenants]
    for (const row of tableRows.filter((r) => !r.isRemoved)) {
      const natId = row.nationalIdWithName?.nationalId ?? ''
      const name = row.nationalIdWithName?.name ?? ''
      if (!natId) continue
      const key = comparableNationalId(natId)
      if (tenantKeySet.has(key)) continue
      if (allMembers.some((m) => comparableNationalId(m.nationalId) === key)) {
        continue
      }
      allMembers.push({ nationalId: natId, name })
    }
  } else {
    allMembers = getHouseholdMembersForTable(application)
      .filter((m) => m.nationalId)
      .map((m) => ({ nationalId: m.nationalId, name: m.name ?? '' }))
  }

  return allMembers.filter((m) => {
    if (!m.nationalId || m.nationalId === applicantNationalId) return false
    try {
      return (
        kennitala.isValid(m.nationalId) &&
        kennitala.info(m.nationalId).age >= 18
      )
    } catch {
      return false
    }
  })
}

/**
 * Whether the application needs household member approval (others over 18 must sign).
 */
export const needsHouseholdMemberApproval = (
  application: Application,
): boolean =>
  getHouseholdMembersOver18ExcludingApplicant(application).length > 0

/**
 * Whether the applicant is the only household member over 18.
 */
export const isApplicantOnlyHouseholdMemberOver18 = (
  application: Application,
): boolean => !needsHouseholdMemberApproval(application)

/**
 * Whether this assignee has finished the in-state prerequisite step (external data + confirm).
 */
export const hasAssigneeCompletedPrereq = (
  application: Application,
  nationalId: string,
): boolean => {
  const normalized = kennitala.isValid(nationalId)
    ? kennitala.sanitize(nationalId)
    : nationalId
  const completed = (application.answers?.assigneePrerequisitesCompleted ??
    []) as string[]
  return completed.some(
    (id) =>
      (kennitala.isValid(id) ? kennitala.sanitize(id) : id) === normalized,
  )
}

const normalizeNationalIdList = (ids: string[]): string[] =>
  ids.map((id) => (kennitala.isValid(id) ? kennitala.sanitize(id) : id))

/**
 * National IDs of assignees who finished approval (signed or rejected household membership).
 */
export const getCompletedAssigneeNationalIdSet = (
  application: Application,
): Set<string> => {
  const signed = normalizeNationalIdList(
    getValueViaPath<string[]>(application.answers, 'signedAssignees') ?? [],
  )
  const rejected = getRejectedAssigneeNationalIds(application)
  return new Set([...signed, ...rejected].map((id) => comparableNationalId(id)))
}

/**
 * Check if this is the last assignee to complete (all have signed or rejected).
 */
export const isLastAssigneeToSign = (
  completedNationalIds: string[],
  assignees: string[],
): boolean => new Set(completedNationalIds).size >= assignees.length

/**
 * Gets national IDs of household members over 18 (excluding applicant) for assignees.
 */
export const getAssigneeNationalIds = (application: Application): string[] =>
  getHouseholdMembersOver18ExcludingApplicant(application).map(
    (m) => m.nationalId,
  )

type AssigneeUmgengnissamningurTableRow = {
  nationalIdWithName?: { nationalId?: string; name?: string }
  file?: Array<{ key: string; name: string }>
  isRemoved?: boolean
}

export type AssigneeUmgengnissamningurChild = {
  nationalId: string
  name: string
}

const normalizeAssigneeNationalId = (id: string): string =>
  kennitala.isValid(id) ? kennitala.sanitize(id) : id

/**
 * Under-18 household members who still need an umgengnissamningur for this assignee
 * (same rules as the optional assignee umgengnissamningur screen).
 */
export const getAssigneeChildrenNeedingUmgengnissamningur = (
  answers: FormValue,
  externalData: ExternalData,
  assigneeNationalId: string,
): AssigneeUmgengnissamningurChild[] => {
  if (!assigneeNationalId || !kennitala.isValid(assigneeNationalId)) {
    return []
  }
  const currentKey = kennitala.sanitize(assigneeNationalId)

  const inApplicantCustody = getApplicantChildCustodyNationalIdSet(externalData)
  const currentAssigneeCustody =
    buildChildNationalIdSetFromAssigneeExternalData(
      externalData,
      assigneeNationalId,
    )
  const app = applicationFromFormValue(answers, externalData)
  const otherAssigneeIds = getAssigneeNationalIds(app).filter(
    (id) => comparableNationalId(id) !== currentKey,
  )

  const rows = getValueViaPath<AssigneeUmgengnissamningurTableRow[]>(
    answers,
    'householdMembersTableRepeater',
  )
  if (!Array.isArray(rows)) {
    return []
  }

  const out: AssigneeUmgengnissamningurChild[] = []

  for (const row of rows) {
    if (row.isRemoved) continue
    const nationalId = row.nationalIdWithName?.nationalId
    if (!nationalId || !kennitala.isValid(nationalId)) continue
    let age: number
    try {
      age = kennitala.info(nationalId).age
    } catch {
      continue
    }
    if (age >= 18) continue
    const childKey = normalizeKennitalaKey(nationalId)
    if (!childKey) continue
    if (inApplicantCustody.has(childKey)) continue
    const hasFile = Array.isArray(row.file) && row.file.length > 0
    if (hasFile) continue
    if (currentAssigneeCustody.has(childKey)) continue

    let coveredByOtherAssignee = false
    for (const otherId of otherAssigneeIds) {
      if (!assigneeHasCustodyExternalDataKey(externalData, otherId)) {
        continue
      }
      if (
        buildChildNationalIdSetFromAssigneeExternalData(
          externalData,
          otherId,
        ).has(childKey)
      ) {
        coveredByOtherAssignee = true
        break
      }
    }
    if (coveredByOtherAssignee) {
      continue
    }
    const name = row.nationalIdWithName?.name?.trim() || nationalId
    out.push({ nationalId, name })
  }
  return out
}

/**
 * Same as {@link getAssigneeChildrenNeedingUmgengnissamningur}, but excludes minors who already
 * have an umgengnissamningur anywhere (household row, main-form repeater, another assignee, etc.).
 */
export const getAssigneeChildrenStillMissingAnyAccessAgreementUpload = (
  answers: FormValue,
  externalData: ExternalData,
  assigneeNationalId: string,
): AssigneeUmgengnissamningurChild[] =>
  getAssigneeChildrenNeedingUmgengnissamningur(
    answers,
    externalData,
    assigneeNationalId,
  ).filter(
    (c) => !minorHasAnyUmgengnissamningurUploadAttached(answers, c.nationalId),
  )

/**
 * Identifies the assignee who is in the post-prerequisite draft (for resolving
 * per-assignee answer keys when the form does not have access to the session user).
 */
export const getCurrentDraftAssigneeNationalId = (
  application: Application,
): string | undefined => {
  const assignees = getAssigneeNationalIds(application)
  const completed = getCompletedAssigneeNationalIdSet(application)
  const unsigned = assignees.filter(
    (id) => !completed.has(normalizeAssigneeNationalId(id)),
  )
  const withPrereqDone = unsigned.filter((id) =>
    hasAssigneeRolePrereqOk(application, normalizeAssigneeNationalId(id)),
  )
  if (withPrereqDone.length >= 1) {
    return withPrereqDone[0]
  }
  if (unsigned.length === 1) {
    return unsigned[0]
  }
  return undefined
}

/**
 * Resolves which assignee’s umgengnissamningur fields apply (draft assignee, or the only
 * unsigned assignee as fallback for form options when inference is ambiguous).
 */
export const getAssigneeNationalIdForUmgengnissamningurForm = (
  application: Application,
): string | undefined => {
  const resolved = getCurrentDraftAssigneeNationalId(application)
  if (resolved) {
    return resolved
  }
  const assignees = getAssigneeNationalIds(application)
  const completed = getCompletedAssigneeNationalIdSet(application)
  const unsigned = assignees.filter(
    (id) => !completed.has(normalizeAssigneeNationalId(id)),
  )
  return unsigned.length === 1 ? unsigned[0] : undefined
}

/**
 * true when the assignee draft should show the optional umgengnissamningur step:
 * at least one under-18 household member matches the assignee umgengnissamningur rules and still
 * has no umgengnissamningur uploaded anywhere (household row, main-form repeater, etc.).
 */
export const shouldShowAssigneeUmgengnissamningurScreen = (
  answers: FormValue,
  externalData: ExternalData,
  user: BffUser | null,
): boolean => {
  const userNationalId = user?.profile?.nationalId
  if (!userNationalId || !kennitala.isValid(userNationalId)) {
    return false
  }
  return (
    getAssigneeChildrenStillMissingAnyAccessAgreementUpload(
      answers,
      externalData,
      userNationalId,
    ).length > 0
  )
}

/**
 * Gets names of people who have approved (applicant + signed assignees).
 */
export const getSignedApprovalNames = (application: Application): string[] => {
  const applicantName =
    getValueViaPath<string>(application.answers, 'applicant.name') ??
    getValueViaPath<string>(
      application.externalData,
      'nationalRegistry.data.fullName',
    ) ??
    ''
  const assigneeMembers =
    getHouseholdMembersOver18ExcludingApplicant(application)
  const signed = (getValueViaPath<string[]>(
    application.answers,
    'signedAssignees',
  ) ?? []) as string[]
  const signedNames = signed
    .map((natId) => {
      const member = assigneeMembers.find((m) => m.nationalId === natId)
      return member?.name ?? natId
    })
    .filter(Boolean)
  return applicantName ? [applicantName, ...signedNames] : signedNames
}

/**
 * Gets names of assignees who have yet to approve.
 */
export const getUnsignedApprovalNames = (
  application: Application,
): string[] => {
  const assigneeMembers =
    getHouseholdMembersOver18ExcludingApplicant(application)
  const completed = getCompletedAssigneeNationalIdSet(application)
  return assigneeMembers
    .filter((m) => !completed.has(comparableNationalId(m.nationalId)))
    .map((m) => m.name || m.nationalId)
}

const assigneeNameFromNationalId = (
  assigneeMembers: ReturnType<
    typeof getHouseholdMembersOver18ExcludingApplicant
  >,
  nationalId: string,
): string => {
  const normalized = normalizeAssigneeNationalId(nationalId)
  const member = assigneeMembers.find(
    (m) => normalizeAssigneeNationalId(m.nationalId) === normalized,
  )
  return member?.name ?? nationalId
}

/**
 * Gets names of assignees who signed (excluding the applicant).
 */
export const getSignedAssigneeNames = (application: Application): string[] => {
  const assigneeMembers =
    getHouseholdMembersOver18ExcludingApplicant(application)
  const signed = (getValueViaPath<string[]>(
    application.answers,
    'signedAssignees',
  ) ?? []) as string[]
  return signed
    .map((nationalId) =>
      assigneeNameFromNationalId(assigneeMembers, nationalId),
    )
    .filter(Boolean)
}

/**
 * Gets names of assignees who rejected the application.
 */
export const getRejectedAssigneeNames = (
  application: Application,
): string[] => {
  const assigneeMembers =
    getHouseholdMembersOver18ExcludingApplicant(application)
  return getRejectedAssigneeNationalIds(application)
    .map((nationalId) =>
      assigneeNameFromNationalId(assigneeMembers, nationalId),
    )
    .filter(Boolean)
}

const normalizeKt = (id: string): string =>
  kennitala.isValid(id) ? kennitala.sanitize(id) : id

/**
 * Display name for the person who triggered an assignee APPROVE (history subject national id).
 */
export const getAssigneeApproverDisplayName = (
  application: Application,
  subjectNationalId?: string | null,
): string => {
  if (!subjectNationalId?.trim()) {
    return ''
  }
  const normalizedSubject = normalizeKt(subjectNationalId.trim())

  const applicantKt = application.applicant
  const applicantNorm = applicantKt ? normalizeKt(applicantKt) : ''
  if (applicantNorm && normalizedSubject === applicantNorm) {
    return (
      getValueViaPath<string>(application.answers, 'applicant.name')?.trim() ??
      getValueViaPath<string>(
        application.externalData,
        'nationalRegistry.data.fullName',
      )?.trim() ??
      ''
    )
  }

  const members = getHouseholdMembersOver18ExcludingApplicant(application)
  const member = members.find(
    (m) => normalizeKt(m.nationalId) === normalizedSubject,
  )
  return member?.name?.trim() ?? ''
}

export const getNationalIdPrefix = (user: BffUser): string => {
  const nationalId = user.profile.nationalId
  return kennitala.isValid(nationalId)
    ? kennitala.sanitize(nationalId)
    : nationalId
}

export const nationalIdPreface = (
  _application: Application,
  user: BffUser,
  fieldKey: string,
) => {
  return `${getNationalIdPrefix(user)}.${fieldKey}`
}

export const findCurrentAssigneeBackId = (
  answers: FormValue,
  fieldSuffix: string,
): string | undefined => {
  const ans = answers as Record<string, any>
  const completed = new Set([
    ...(getValueViaPath<string[]>(answers, 'signedAssignees') ?? []).map(
      normalizeAssigneeNationalId,
    ),
    ...getRejectedAssigneeNationalIdsFromAnswers(answers).map(
      normalizeAssigneeNationalId,
    ),
  ])
  for (const key of Object.keys(ans)) {
    if (
      ans[key]?.[fieldSuffix] !== undefined &&
      !completed.has(normalizeAssigneeNationalId(key))
    ) {
      return `${key}.${fieldSuffix}`
    }
  }
  return undefined
}

/**
 * Finds the current assignee's national registry data from externalData.
 * External data is stored under dynamic keys: `<nationalId>.assigneeNationalRegistry`.
 */
export const getAssigneeNationalRegistryData = (
  application: Application,
): Record<string, unknown> | null => {
  for (const [key, value] of Object.entries(application.externalData)) {
    if (key.endsWith('.assigneeNationalRegistry') && value?.data) {
      return value.data as Record<string, unknown>
    }
  }
  return null
}

/**
 * Finds the current assignee's user profile data from externalData.
 * External data is stored under dynamic keys: `<nationalId>.assigneeUserProfile`.
 */
export const getAssigneeUserProfileData = (
  application: Application,
): Record<string, unknown> | null => {
  for (const [key, value] of Object.entries(application.externalData)) {
    if (key.endsWith('.assigneeUserProfile') && value?.data) {
      return value.data as Record<string, unknown>
    }
  }
  return null
}

type HouseholdMemberRepeaterRow = {
  nationalIdWithName?: { nationalId?: string; name?: string }
  file?: Array<{ key: string; name: string }>
  isRemoved?: boolean
}

const displayNameFromHouseholdRow = (
  row: HouseholdMemberRepeaterRow,
): string => {
  const nested = row.nationalIdWithName
  const name =
    typeof nested === 'object' && nested ? (nested.name ?? '').trim() : ''
  const id =
    typeof nested === 'object' && nested ? (nested.nationalId ?? '').trim() : ''
  if (name) return name
  if (id) return id
  return ''
}

/**
 * Collective minors who may still need an umgengnissamningur file (per assignee rules and the
 * applicant non-custody alert), excluding those already covered on the household table or in any
 * assignee / applicant-submit upload area.
 */
export const getApplicantSubmitMissingAccessAgreementChildren = (
  answers: FormValue,
  externalData: ExternalData,
): AssigneeUmgengnissamningurChild[] => {
  const app = applicationFromFormValue(answers, externalData)
  const candidateKeys = new Set<string>()

  for (const assigneeId of getAssigneeNationalIds(app)) {
    for (const c of getAssigneeChildrenNeedingUmgengnissamningur(
      answers,
      externalData,
      assigneeId,
    )) {
      candidateKeys.add(normalizeKennitalaKey(c.nationalId))
    }
  }

  for (const id of getNonCustodyMinorsMissingCustodyAgreementNationalIds(
    answers,
    externalData,
  )) {
    candidateKeys.add(normalizeKennitalaKey(id))
  }

  const rows = getValueViaPath<HouseholdMemberRepeaterRow[]>(
    answers,
    'householdMembersTableRepeater',
  )

  const out: AssigneeUmgengnissamningurChild[] = []
  for (const key of candidateKeys) {
    if (!key) continue
    if (minorHasAnyUmgengnissamningurUploadAttached(answers, key)) continue

    let nationalIdForRow = key
    let label = key
    if (Array.isArray(rows)) {
      for (const row of rows) {
        if (row.isRemoved) continue
        const nid = row.nationalIdWithName?.nationalId?.trim()
        if (!nid) continue
        if (normalizeKennitalaKey(nid) !== key) continue
        nationalIdForRow = kennitala.isValid(nid)
          ? kennitala.sanitize(nid)
          : nid
        label = displayNameFromHouseholdRow(row) || nationalIdForRow
        break
      }
    }

    out.push({ nationalId: nationalIdForRow, name: label })
  }

  return out
}

/**
 * True when at least one minor still has no umgengnissamningur from the applicant, any assignee,
 * or this applicant-submit upload step — so the extra screen should show.
 */
export const shouldShowApplicantSubmitAccessAgreementSection = (
  answers: FormValue,
  externalData: ExternalData,
): boolean =>
  getApplicantSubmitMissingAccessAgreementChildren(answers, externalData)
    .length > 0
