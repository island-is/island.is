import type { ParsedCriterionDto } from '@island.is/clients/directorate-of-equality'
import type { StepAssignment } from '../../lib/constants'

export type StepMeta = {
  steps: { order: number; score: number }[]
  totalSteps: number
  maxScore: number
  weight: number
  description: string
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
    let group = groups.find((g) => g.criterionTitle === assignment.criterionTitle)
    if (!group) {
      group = { criterionTitle: assignment.criterionTitle, items: [] }
      groups.push(group)
    }
    group.items.push({ assignment, index })
  })
  return groups
}
