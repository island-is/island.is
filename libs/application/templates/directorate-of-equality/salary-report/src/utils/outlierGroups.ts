// The outlier-group answer shape and its completeness rule live here because
// two screens-worth of components depend on them: SalaryAnalysisResults gates
// "Continue" on the rule, OutlierEditor renders the matching inline warning.
// Declared in both places they could drift, and the button would then block on
// a condition the warning never showed.
//
// `employeeOrdinals` is required, matching `outlierGroup` in dataSchema.ts —
// groups are only ever created with their members, so a group without the key
// is not a state the form can produce.
export type OutlierGroupAnswer = {
  // Draft-phase only: the group's client-minted DMR id, carried through
  // useFieldArray so append/remove track identity by id rather than by
  // array position — removing group #1 of 3 must not misattribute group
  // #2's sync commands to group #1's id. Absent/unused in POSTPONED mode.
  id?: string
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
