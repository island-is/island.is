import {
  VisibilityCondition,
  VisibilityOperator,
} from '../../../../models/question.model'
import {
  HealthDirectorateQuestionDto,
  HealthDirectorateQuestionTriggers,
} from '../types'

export const mapGroupTriggers = (
  allQuestions: HealthDirectorateQuestionDto[],
  triggers: Record<string, HealthDirectorateQuestionTriggers[]> | undefined,
  groupId: string,
): { dependsOn?: string[]; visibilityConditions?: VisibilityCondition[] } => {
  if (!triggers) return {}

  // Find all triggers where this groupId is the targetId
  const relevantTriggers: HealthDirectorateQuestionTriggers[] = []

  Object.entries(triggers).forEach(([_triggerKey, triggerList]) => {
    triggerList.forEach((trigger) => {
      if (trigger.targetId === groupId) {
        relevantTriggers.push(trigger)
      }
    })
  })

  if (relevantTriggers.length === 0) return {}

  const conditions: VisibilityCondition[] = []
  const dependsOnSet = new Set<string>()

  // Group triggers by triggerId
  const triggerGroups = new Map<string, HealthDirectorateQuestionTriggers[]>()

  relevantTriggers.forEach((trigger) => {
    dependsOnSet.add(trigger.triggerId)

    if (!triggerGroups.has(trigger.triggerId)) {
      triggerGroups.set(trigger.triggerId, [])
    }
    const group = triggerGroups.get(trigger.triggerId)
    if (group) {
      group.push(trigger)
    }
  })

  // Process each trigger group
  triggerGroups.forEach((triggers, triggerId) => {
    // Check if there's a default hidden trigger (visible: false with no conditions)
    const hasDefaultHidden = triggers.some(
      (t) =>
        t.visible === false &&
        !('value' in t) &&
        !('contains' in t && t.contains?.length),
    )

    // Find triggers with specific conditions
    const specificTriggers = triggers.filter(
      (t) =>
        t.visible === true &&
        (('value' in t && t.value !== undefined) ||
          ('contains' in t && t.contains?.length)),
    )

    if (hasDefaultHidden && specificTriggers.length > 0) {
      // Group is hidden by default, only show when specific conditions are met
      specificTriggers.forEach((trigger) => {
        if ('value' in trigger && trigger.value !== undefined) {
          // Boolean trigger
          conditions.push({
            questionId: triggerId,
            operator: VisibilityOperator.equals,
            expectedValues: [String(trigger.value)],
            showWhenMatched: true,
          })
        } else if ('contains' in trigger && trigger.contains?.length) {
          // List trigger
          const expectedValues = trigger.contains.map((containsId) => {
            const sourceQuestion = allQuestions.find((q) => q.id === triggerId)
            if (
              sourceQuestion &&
              'values' in sourceQuestion &&
              sourceQuestion.values
            ) {
              const option = sourceQuestion.values.find(
                (v) => v.id === String(containsId),
              )
              return option?.id || String(containsId)
            }
            return String(containsId)
          })

          conditions.push({
            questionId: triggerId,
            operator: VisibilityOperator.contains,
            expectedValues,
            showWhenMatched: true,
          })
        }
      })
    } else if (specificTriggers.length > 0) {
      // No default hidden, just use the specific triggers
      specificTriggers.forEach((trigger) => {
        if ('value' in trigger && trigger.value !== undefined) {
          conditions.push({
            questionId: triggerId,
            operator: VisibilityOperator.equals,
            expectedValues: [String(trigger.value)],
            showWhenMatched: true,
          })
        } else if ('contains' in trigger && trigger.contains?.length) {
          const expectedValues = trigger.contains.map(String)
          conditions.push({
            questionId: triggerId,
            operator: VisibilityOperator.contains,
            expectedValues,
            showWhenMatched: true,
          })
        }
      })
    }
  })

  return {
    dependsOn: Array.from(dependsOnSet),
    visibilityConditions: conditions.length > 0 ? conditions : undefined,
  }
}
