import { QuestionAnswer } from '../../../types/questionnaire'

/**
 * Evaluates LSH visibility conditions based on current answers
 * Supports formats like:
 * - "isSelected('Já',@@@RadioGroup36819)"
 * - "isSelected('Annað',@@@Checklist38491)"
 * - "'Já' == '@@@RadioGroup36824'"
 */
export const evaluateVisibilityCondition = (
  condition: string,
  answers: { [key: string]: QuestionAnswer },
): boolean => {
  if (!condition || condition.trim() === '') {
    return true // No condition means always visible
  }

  try {
    const cleanCondition = condition.trim()

    let isSelectedMatch = cleanCondition.match(
      /isSelected\('([^']+)',\s*'@@@([^']+)'\)/,
    )

    if (!isSelectedMatch) {
      isSelectedMatch = cleanCondition.match(
        /isSelected\('([^']+)',\s*@@@([^)]+)\)/,
      )
    }
    if (isSelectedMatch) {
      const [, expectedValue, questionId] = isSelectedMatch

      return checkIsSelected(expectedValue, questionId, answers)
    }

    const equalityMatch = cleanCondition.match(/'([^']+)'\s*==\s*'@@@([^']+)'/)
    if (equalityMatch) {
      const [, expectedValue, questionId] = equalityMatch

      return checkIsSelected(expectedValue, questionId, answers)
    }

    // If we can't parse the condition, default to visible
    return true
  } catch (error) {
    return true // Default to visible on error
  }
}

const checkIsSelected = (
  expectedValue: string,
  questionId: string,
  answers: { [key: string]: QuestionAnswer },
): boolean => {
  const answer = answers[questionId]

  if (!answer) {
    return false
  }
  const answerValue = answer.value

  if (Array.isArray(answerValue)) {
    const result = answerValue.includes(expectedValue)
    return result
  }

  if (typeof answerValue === 'string') {
    const result = answerValue === expectedValue
    return result
  }

  if (typeof answerValue === 'number') {
    const result = answerValue.toString() === expectedValue
    return result
  }

  return false
}

/**
 * Gets all question IDs that a question depends on based on its visibility condition
 */
export const extractDependenciesFromCondition = (
  condition: string,
): string[] => {
  if (!condition || condition.trim() === '') {
    return []
  }

  const dependencies: string[] = []

  const questionIdMatches = condition.match(/@@@([^)'\s]+)/g)
  if (questionIdMatches) {
    questionIdMatches.forEach((match) => {
      const questionId = match.replace('@@@', '')
      dependencies.push(questionId)
    })
  }

  return dependencies
}

/**
 * Determines if a question should be visible based on its dependencies and visibility condition
 */
export const isQuestionVisible = (
  questionId: string,
  dependsOn: string[] | undefined,
  visibilityCondition: string | undefined,
  answers: { [key: string]: QuestionAnswer },
): boolean => {
  // If no dependencies, always visible
  if (!dependsOn || dependsOn.length === 0) {
    return true
  }

  // If has dependencies but no visibility condition, check if dependencies are answered
  if (!visibilityCondition) {
    const result = dependsOn.every((depId) => answers[depId] !== undefined)

    return result
  }

  const result = evaluateVisibilityCondition(visibilityCondition, answers)
  return result
}
