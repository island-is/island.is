import {
  VisibilityCondition,
  VisibilityOperator,
} from '../../../../models/question.model'
import {
  HealthDirectorateQuestionDto,
  HealthDirectorateQuestionTriggers,
} from '../types'

export const mapTriggers = (
  allQuestions: HealthDirectorateQuestionDto[],
  triggers: Record<string, HealthDirectorateQuestionTriggers[]> | undefined,
  itemId: string,
): { dependsOn?: string[]; visibilityConditions?: VisibilityCondition[] } => {
  if (!triggers) return {}

  // Find all triggers where this itemId is the targetId
  const relevantTriggers: HealthDirectorateQuestionTriggers[] = []

  Object.entries(triggers).forEach(([_triggerKey, triggerList]) => {
    triggerList.forEach((trigger) => {
      if (trigger.targetId === itemId) {
        relevantTriggers.push(trigger)
      }
    })
  })

  if (relevantTriggers.length === 0) return {}

  const conditions: VisibilityCondition[] = []
  const dependsOnSet = new Set<string>()

  // Group triggers by triggerId to handle show/hide logic correctly
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

  // Process each trigger group to create proper visibility conditions
  triggerGroups.forEach((triggers, triggerId) => {
    // Check for boolean triggers with specific value
    const boolTrigger = triggers.find(
      (t) => t.visible && 'value' in t && t.value !== undefined,
    )

    if (
      boolTrigger &&
      'value' in boolTrigger &&
      boolTrigger.value !== undefined
    ) {
      // Boolean trigger: show when specific true/false value is selected
      conditions.push({
        questionId: triggerId,
        operator: VisibilityOperator.equals,
        expectedValues: [String(boolTrigger.value)],
        showWhenMatched: true,
      })
      return
    }

    // Check for list triggers with specific contains values
    const showTrigger = triggers.find(
      (t) => t.visible && 'contains' in t && t.contains?.length,
    )

    if (
      showTrigger &&
      'contains' in showTrigger &&
      showTrigger.contains?.length
    ) {
      // Map the contains IDs to their actual option IDs (not labels)
      const expectedValues = showTrigger.contains.map((containsId) => {
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

      // Create a condition that shows the question only when specific values are selected
      conditions.push({
        questionId: triggerId,
        operator: VisibilityOperator.contains,
        expectedValues,
        showWhenMatched: true,
      })
    } else {
      // If no specific show condition, check for general visibility
      const visibleTrigger = triggers.find((t) => t.visible)
      if (visibleTrigger) {
        conditions.push({
          questionId: triggerId,
          operator: VisibilityOperator.exists,
          expectedValues: undefined,
          showWhenMatched: true,
        })
      }
    }
  })

  // Remove duplicate conditions (same questionId and expectedValues)
  const uniqueConditions = conditions.filter((condition, index, array) => {
    return (
      array.findIndex(
        (c) =>
          c.questionId === condition.questionId &&
          c.expectedValues === condition.expectedValues,
      ) === index
    )
  })

  return {
    dependsOn: Array.from(dependsOnSet),
    visibilityConditions:
      uniqueConditions.length > 0 ? uniqueConditions : undefined,
  }
}
