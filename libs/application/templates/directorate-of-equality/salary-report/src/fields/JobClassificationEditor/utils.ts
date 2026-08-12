import type { ParsedCriterionDto } from '@island.is/clients/directorate-of-equality'
import type { Role, StepAssignment, SubCriterion } from '../../utils/types'

export type StepMeta = {
  steps: { order: number; score: number }[]
  totalSteps: number
  maxScore: number
  weight: number
  description: string
}

// The evaluation model scores each sub-criterion out of `weight × 10` — a fixed
// 1000-point total scale (the sub-criterion weights sum to 100). Each step is an
// equal fraction of that max: score(order) = order / stepCount × maxScore. This
// matches the scores the API returns exactly, but is derived purely from the
// weight + step count, both of which are always kept in answers.
const POINTS_PER_WEIGHT_PERCENT = 10

// Fallback for when the parsed criteria aren't on the client (external data can
// be stale/absent after import — see CriteriaEditor). Rebuilds the step metadata
// from the answers sub-criteria so the dropdowns AND the score totals work
// without external data. Computing from the live weights also means the scores
// reflect any weight edits the user makes on the sub-criteria screen.
export const buildStepMetaFromSubCriteria = (
  subCriteriaGroups: SubCriterion[][],
): Record<string, StepMeta> => {
  const map: Record<string, StepMeta> = {}
  const all = subCriteriaGroups.flat()
  all.forEach((sc) => {
    if (!sc?.title) return
    const count = sc.steps?.length || Number(sc.stepCount) || 0
    const weight = Number(sc.weight) || 0
    const maxScore = weight * POINTS_PER_WEIGHT_PERCENT
    const perStep = count > 0 ? maxScore / count : 0
    map[sc.title] = {
      steps: Array.from({ length: count }, (_, i) => ({
        order: i + 1,
        score: (i + 1) * perStep,
      })),
      totalSteps: count,
      maxScore,
      weight,
      description: sc.description ?? '',
    }
  })
  return map
}

// Step scores/weights live in the external (parsed) criteria — the saved
// sub-criteria answers don't carry them — so this lookup is built from
// externalData and used purely for read-only display + score totals.
export const buildStepMetaByTitle = (
  criteria: ParsedCriterionDto[],
): Record<string, StepMeta> => {
  const map: Record<string, StepMeta> = {}
  criteria.forEach((c) => {
    c.subCriteria.forEach((sc) => {
      const scores = sc.steps.map((s) => s.score)
      map[sc.title] = {
        steps: sc.steps.map((s) => ({ order: s.order, score: s.score })),
        totalSteps: sc.steps.length,
        maxScore: scores.length ? Math.max(...scores) : 0,
        weight: sc.weight,
        description: sc.description,
      }
    })
  })
  return map
}

// Combines the live sub-criteria (always has every current title, including
// ones added after an Excel import) with the imported external criteria
// (authoritative scores/weights, but frozen at import time) into a single
// lookup. Live data is the base so nothing is silently dropped; external
// values overlay it for titles present in both. Only pass the sub-criteria
// group relevant to the calling screen (job or personal factors) — mixing
// both groups risks title collisions between unrelated criteria.
export const buildMergedStepMetaByTitle = (
  externalCriteria: ParsedCriterionDto[],
  factorSubCriteria: SubCriterion[][],
): Record<string, StepMeta> => ({
  ...buildStepMetaFromSubCriteria(factorSubCriteria),
  ...buildStepMetaByTitle(externalCriteria),
})

// Merges newly-available default assignments into an existing assignment
// list without disturbing what's already there — used so criteria added
// after an Excel import still get a row for already-imported
// employees/roles, while preserving any stepOrder already chosen. Matches on
// the (criterionTitle, subTitle) pair rather than subTitle alone, since a
// sub-criterion title could in principle repeat across criteria groups.
export const mergeStepAssignments = (
  existing: StepAssignment[],
  defaultAssignments: StepAssignment[],
): StepAssignment[] => {
  const isPresent = (a: StepAssignment) =>
    existing.some(
      (e) =>
        e.criterionTitle === a.criterionTitle && e.subTitle === a.subTitle,
    )
  return [...existing, ...defaultAssignments.filter((a) => !isPresent(a))]
}

// Drops a single (criterionTitle, subTitle) entry — used when a sub-criterion
// itself is deleted, so already-assigned employees/roles don't keep a stale,
// unratable row for a sub-criterion that no longer exists. Generic over
// StepAssignment/EmployeeStepAssignment, which share this shape.
export const removeAssignment = <
  T extends { criterionTitle: string; subTitle: string },
>(
  assignments: T[],
  criterionTitle: string,
  subTitle: string,
): T[] =>
  assignments.filter(
    (a) => !(a.criterionTitle === criterionTitle && a.subTitle === subTitle),
  )

// Builds step assignments (one per sub-criterion, defaulted to the first step)
// from the manually-entered criteria/sub-criteria answers. Used both for
// deriving default roles and for seeding an employee's personal step
// assignments when no import ever populated them.
export const buildStepAssignmentsFromSubCriteria = (
  factorTitles: string[],
  subCriteriaGroups: SubCriterion[][],
): StepAssignment[] =>
  subCriteriaGroups.flatMap((group, i) =>
    (group ?? []).map((sc) => ({
      criterionTitle: factorTitles[i] ?? '',
      subTitle: sc.title,
      stepOrder: 1,
    })),
  )

// Fully manual entry never gets a "roles" answer from an Excel import — there
// is no dedicated UI for creating roles either, so derive them from the
// distinct job titles already entered on the employees screen, paired with
// the manually-entered job-factor sub-criteria.
export const buildRolesFromEmployees = (
  roleTitles: string[],
  jobFactorTitles: string[],
  subCriteriaJobFactors: SubCriterion[][],
): Role[] => {
  const stepAssignments = buildStepAssignmentsFromSubCriteria(
    jobFactorTitles,
    subCriteriaJobFactors,
  )
  const uniqueTitles = Array.from(new Set(roleTitles.filter(Boolean)))
  return uniqueTitles.map((title) => ({
    title,
    stepAssignments: stepAssignments.map((a) => ({ ...a })),
  }))
}

export const computeRoleScore = (
  assignments: StepAssignment[],
  metaByTitle: Record<string, StepMeta>,
): { score: number; max: number } => {
  let score = 0
  let max = 0
  assignments.forEach((a) => {
    const meta = metaByTitle[a.subTitle]
    if (!meta) return
    max += meta.maxScore
    const step = meta.steps.find((s) => s.order === Number(a.stepOrder))
    score += step?.score ?? 0
  })
  return { score: Math.round(score), max: Math.round(max) }
}

export type AssignmentGroup = {
  criterionTitle: string
  items: { assignment: StepAssignment; index: number }[]
}

// Group step assignments by criterion, preserving first-seen order
// (which follows the criteria order in the source data).
export const groupAssignmentsByCriterion = (
  assignments: StepAssignment[],
): AssignmentGroup[] => {
  const groups: AssignmentGroup[] = []
  assignments.forEach((assignment, index) => {
    let group = groups.find(
      (g) => g.criterionTitle === assignment.criterionTitle,
    )
    if (!group) {
      group = { criterionTitle: assignment.criterionTitle, items: [] }
      groups.push(group)
    }
    group.items.push({ assignment, index })
  })
  return groups
}
