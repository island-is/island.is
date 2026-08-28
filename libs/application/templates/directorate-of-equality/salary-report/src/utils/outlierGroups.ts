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

// A newly created group, with every text field explicitly blank.
//
// The blanks are not decoration: react-hook-form resolves a registered input's
// initial value from `_formValues` and falls back to `_defaultValues` AT THE
// SAME ARRAY INDEX for any key the value is missing. Both forms that hold these
// groups have defaults (the draft form from useSeedOnce's reset, the ambient one
// from application.answers), so appending a group that omits `reason` put the
// *deleted* group N's reason into the new group N — and wrote it back into the
// form values. Declaring every key keeps the fallback from ever being reached.
//
// Keep this in step with OutlierGroupAnswer: a text field added there without
// being added here is silently re-exposed to that fallback.
export const emptyOutlierGroupAnswer = (
  employeeOrdinals: number[],
  // Draft mode tracks groups by a stable client-minted id so sync commands are
  // attributed by id rather than array position; POSTPONED mode has no sync.
  id?: string,
): OutlierGroupAnswer => ({
  id,
  name: '',
  reason: '',
  action: '',
  signatureName: '',
  signatureRole: '',
  employeeOrdinals,
})

// An empty group (all its members freed by a removal) has nothing to explain,
// so it's vacuously complete — same exemption dataSchema's superRefine makes.
//
// `signatureName` is deliberately absent: the responsible party's name is
// optional (nullable on the draft sync contract), so requiring it here would
// block "Continue" on a field the form marks as not required. Keep this list
// and dataSchema's superRefine in step — the button gates on this rule while
// the schema produces the field errors.
export const isOutlierGroupComplete = (group: OutlierGroupAnswer): boolean =>
  group.employeeOrdinals.length === 0 ||
  Boolean(
    group.reason?.trim() && group.action?.trim() && group.signatureRole?.trim(),
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

// A group with no members has nothing to explain, so it never reaches DMR: one
// created and emptied in the same session is simply dropped, and one the draft
// already holds diffs as a removal (buildOutlierSyncCommands frees its recorded
// members in the same batch, exactly as "Fjarlægja hóp" does).
//
// Applied by the caller before withFallbackOutlierGroupNames so the auto-names
// stay contiguous, and mirroring the identical filter editOutliers applies
// before PUTting the POSTPONED plan — both phases agree on what a group needs
// in order to exist.
export const outlierGroupsWithMembers = (
  groups: OutlierGroupAnswer[],
): OutlierGroupAnswer[] =>
  groups.filter((group) => group.employeeOrdinals.length > 0)

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

// Postponing the improvement plan discards the grouping work: DMR's submit
// drops the draft's outlier groups, and its group-delete guard rejects a group
// that still holds members ("still has N member(s); reassign or remove them
// first"), so submitting a postponed report while groups are populated 409s.
//
// Both collections go out in ONE sync: the endpoint applies a batch in
// dependency order under a single transaction, clearing membership before
// processing removals, which is what lets a group be emptied and removed
// together. buildOutlierSyncCommands relies on the same ordering every time
// "Fjarlægja hóp" removes a populated group, so splitting these into two
// awaited calls would only trade the all-or-nothing batch for a window where
// the members are freed and the groups still stand.
export const buildOutlierClearCommands = (content: {
  outlierGroups: DraftOutlierGroupDto[]
}): { employees: SyncCommand[]; outlierGroups: SyncCommand[] } => ({
  employees: content.outlierGroups.flatMap((group) =>
    group.memberEmployeeIds.map((employeeId) => ({
      method: SyncMethodEnum.UPDATE,
      id: employeeId,
      data: { outlierGroupId: null },
    })),
  ),
  outlierGroups: content.outlierGroups.map((group) => ({
    method: SyncMethodEnum.REMOVE,
    id: group.id,
  })),
})
