import type {
  AssignmentGroup,
  DisplayAssignment,
  DraftCriterionWithSubCriteriaDto,
  StepMeta,
} from '../../utils/types'

// { subCriterionId: StepMeta } lookup for dropdown options + score display;
// callers must pre-filter to the criteria group they care about (job vs. personal).
export const buildStepMetaBySubCriterionId = (
  criteria: DraftCriterionWithSubCriteriaDto[],
): Record<string, StepMeta> => {
  const map: Record<string, StepMeta> = {}
  criteria.forEach((criterion) => {
    criterion.subCriteria.forEach((sc) => {
      const steps = sc.steps.slice().sort((a, b) => a.order - b.order)
      const maxScore = steps.length ? Math.max(...steps.map((s) => s.score)) : 0
      map[sc.id] = {
        steps: steps.map((s) => ({ order: s.order, score: s.score })),
        totalSteps: steps.length,
        maxScore,
        weight: sc.weight,
        description: sc.description,
      }
    })
  })
  return map
}

// Every (role|employee, sub-criterion) pair gets a row, defaulted to step 1 unless already in `assignedStepIds`.
export const buildDisplayAssignments = (
  criteria: DraftCriterionWithSubCriteriaDto[],
  assignedStepIds: string[],
): DisplayAssignment[] => {
  const assignedSet = new Set(assignedStepIds)
  const assignments: DisplayAssignment[] = []
  criteria.forEach((criterion) => {
    criterion.subCriteria.forEach((sc) => {
      const steps = sc.steps.slice().sort((a, b) => a.order - b.order)
      const assignedStep = steps.find((s) => assignedSet.has(s.id))
      assignments.push({
        criterionId: criterion.id,
        criterionTitle: criterion.title,
        subCriterionId: sc.id,
        subTitle: sc.title,
        stepOrder: assignedStep?.order ?? steps[0]?.order ?? 1,
      })
    })
  })
  return assignments
}

// Resolves each assignment's stepOrder back to the step's real id — the shape the draft's `stepIds` (replace-all) wants.
export const resolveStepIds = (
  criteria: DraftCriterionWithSubCriteriaDto[],
  assignments: DisplayAssignment[],
): string[] => {
  const stepsBySubCriterionId: Record<string, { id: string; order: number }[]> =
    {}
  criteria.forEach((criterion) => {
    criterion.subCriteria.forEach((sc) => {
      stepsBySubCriterionId[sc.id] = sc.steps
    })
  })

  return assignments
    .map((a) => {
      const steps = stepsBySubCriterionId[a.subCriterionId] ?? []
      return steps.find((s) => s.order === Number(a.stepOrder))?.id
    })
    .filter((id): id is string => Boolean(id))
}

export const computeAssignmentScore = (
  assignments: DisplayAssignment[],
  metaBySubCriterionId: Record<string, StepMeta>,
): { score: number; max: number } => {
  let score = 0
  let max = 0
  assignments.forEach((a) => {
    const meta = metaBySubCriterionId[a.subCriterionId]
    if (!meta) return
    max += meta.maxScore
    const step = meta.steps.find((s) => s.order === Number(a.stepOrder))
    score += step?.score ?? 0
  })
  return { score: Math.round(score), max: Math.round(max) }
}

// Groups by criterion, preserving first-seen order.
export const groupAssignmentsByCriterion = (
  assignments: DisplayAssignment[],
): AssignmentGroup[] => {
  const groups: AssignmentGroup[] = []
  assignments.forEach((assignment, index) => {
    let group = groups.find((g) => g.criterionId === assignment.criterionId)
    if (!group) {
      group = {
        criterionId: assignment.criterionId,
        criterionTitle: assignment.criterionTitle,
        items: [],
      }
      groups.push(group)
    }
    group.items.push({ assignment, index })
  })
  return groups
}
