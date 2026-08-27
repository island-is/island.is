import type {
  DraftOutlierGroupDto,
  ReportEmployeeDto,
  SyncCommand,
} from './types'
import { SyncMethodEnum } from './constants'
import { buildUpsertRemoveCommands } from './syncCommands'

// The outlier-group answer shape and its completeness rule live here because
// two screens-worth of components depend on them: SalaryImprovementPlan gates
// "Continue" on the rule, OutlierEditor renders the matching inline warning.
// Declared in both places they could drift, and the button would then block on
// a condition the warning never showed.
//
// `employeeOrdinals` is required, matching `outlierGroup` in dataSchema.ts —
// groups are only ever created with their members, so a group without the key
// is not a state the form can produce.
export type OutlierGroupAnswer = {
  // Draft-phase id, tracked through useFieldArray so remove/append don't
  // misattribute sync commands by array position. Unused in POSTPONED mode.
  id?: string
  name?: string
  reason?: string
  action?: string
  signatureName?: string
  signatureRole?: string
  employeeOrdinals: number[]
}

// An empty group (all its members freed by a removal) has nothing to explain,
// so it's vacuously complete — same exemption dataSchema's superRefine makes.
export const isOutlierGroupComplete = (group: OutlierGroupAnswer): boolean =>
  group.employeeOrdinals.length === 0 ||
  Boolean(
    group.reason?.trim() &&
      group.action?.trim() &&
      group.signatureName?.trim() &&
      group.signatureRole?.trim(),
  )

export const unassignedOutlierOrdinals = (
  outliers: { employeeOrdinal: number }[],
  groups: Pick<OutlierGroupAnswer, 'employeeOrdinals'>[],
): number[] => {
  const assignedOrdinals = new Set(
    groups.flatMap((group) => group.employeeOrdinals),
  )
  return outliers
    .map((outlier) => outlier.employeeOrdinal)
    .filter((ordinal) => !assignedOrdinals.has(ordinal))
}

export const withFallbackOutlierGroupNames = (
  groups: OutlierGroupAnswer[],
  fallbackName: (index: number) => string,
): OutlierGroupAnswer[] =>
  groups.map((group, index) =>
    group.name?.trim()
      ? group
      : {
          ...group,
          name: fallbackName(index),
        },
  )

export type PayStatus = 'UNDERPAID' | 'OVERPAID' | 'ON_LINE'

// Which prompt a group gets. A listed employee can be named for being paid
// ABOVE what their starfsmatsstig imply — such an employee carries the gap just
// as an underpaid one on the other side does — and the applicant composes
// groups freely, so one group can hold both directions.
//
// The two directions are genuinely different questions: the likeliest honest
// answer to "why is this pay above the stig" is that the job evaluation
// understates the role, in which case the correction is to the evaluation and
// nobody's pay moves. A shared prompt hides that.
//
// 'onLine' is a fourth case rather than a fold into 'mixed': mixed's copy
// asserts both directions are present, which would be false for an empty group
// (reachable — isOutlierGroupComplete treats one as vacuously complete) or one
// whose members are all ON_LINE.
export type GroupDirection = 'below' | 'above' | 'mixed' | 'onLine'

export const foldGroupDirection = (statuses: PayStatus[]): GroupDirection => {
  const hasBelow = statuses.includes('UNDERPAID')
  const hasAbove = statuses.includes('OVERPAID')
  if (hasBelow && hasAbove) return 'mixed'
  if (hasBelow) return 'below'
  if (hasAbove) return 'above'
  return 'onLine'
}

// Diffs the draft's current outlier groups against the edited form values and
// builds the CREATE/UPDATE/REMOVE sync commands for both the groups and the
// employees whose membership changed as a result.
export const buildOutlierSyncCommands = (
  content: {
    outlierGroups: DraftOutlierGroupDto[]
    employees: ReportEmployeeDto[]
  },
  finalGroups: OutlierGroupAnswer[],
): { outlierGroups: SyncCommand[]; employees: SyncCommand[] } => {
  const employeeIdByOrdinal: Record<number, string> = Object.fromEntries(
    content.employees.map((e) => [e.ordinal, e.id]),
  )
  const originalGroupIds = new Set(content.outlierGroups.map((g) => g.id))
  // Groups are tracked by id (from OutlierEditor's handleCreateGroup), not
  // array position, so removals don't misattribute commands.
  const groupIds = finalGroups.map((g) => g.id ?? crypto.randomUUID())

  const outlierGroupCommands = buildUpsertRemoveCommands(
    originalGroupIds,
    finalGroups.map((g, i) => ({
      id: groupIds[i],
      data: {
        // Unlike its siblings, the generated `name` field isn't nullable —
        // omit it on blank rather than sending null. In practice this is
        // already backfilled by SalaryImprovementPlan before submission
        // before finalGroups reaches here.
        name: g.name || undefined,
        reason: g.reason || null,
        action: g.action || null,
        signatureName: g.signatureName || null,
        signatureRole: g.signatureRole || null,
      },
    })),
  )

  const memberOfGroup = new Map<string, string>()
  finalGroups.forEach((g, i) => {
    g.employeeOrdinals.forEach((ordinal) => {
      const employeeId = employeeIdByOrdinal[ordinal]
      if (employeeId) memberOfGroup.set(employeeId, groupIds[i])
    })
  })
  // Members of a removed/changed group with no surviving group get cleared.
  const employeeCommands: SyncCommand[] = content.outlierGroups.flatMap((g) =>
    g.memberEmployeeIds.map((employeeId) => ({
      method: SyncMethodEnum.UPDATE,
      id: employeeId,
      data: { outlierGroupId: memberOfGroup.get(employeeId) ?? null },
    })),
  )
  memberOfGroup.forEach((groupId, employeeId) => {
    if (!employeeCommands.some((c) => c.id === employeeId)) {
      employeeCommands.push({
        method: SyncMethodEnum.UPDATE,
        id: employeeId,
        data: { outlierGroupId: groupId },
      })
    }
  })

  return {
    outlierGroups: outlierGroupCommands,
    employees: employeeCommands,
  }
}
