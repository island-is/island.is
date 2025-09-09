import { QuestionAnswer } from '../../../types/questionnaire'

interface VisibilityCondition {
  questionId: string
  operator: 'equals' | 'contains' | 'notEquals' | 'notContains'
  value: string | string[]
  visible?: boolean
}

/**
 * Evaluates visibility conditions based on current answers
 *
 * Unified format:
 * - {"questionId":"RadioGroup36819","operator":"equals","value":"Já"}
 * - {"questionId":"Checklist36819","operator":"contains","value":["Annan"]}
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

    // Try to parse as JSON (both legacy EL format and new unified format)
    if (cleanCondition.startsWith('{')) {
      return evaluateJsonCondition(cleanCondition, answers)
    }

    // Handle legacy function format
    return evaluateFunctionCondition(cleanCondition, answers)
  } catch (error) {
    console.warn('Error evaluating visibility condition:', error)
    return true // Default to visible on error
  }
}

/**
 * Evaluates JSON-based visibility conditions
 */
const evaluateJsonCondition = (
  condition: string,
  answers: { [key: string]: QuestionAnswer },
): boolean => {
  const parsed = JSON.parse(condition)

  if (parsed.questionId && parsed.operator) {
    const condition = parsed as VisibilityCondition
    return evaluateUnifiedCondition(condition, answers)
  }

  // Unknown format, default to visible
  return true
}

/**
 * Evaluates the condition format
 */
const evaluateUnifiedCondition = (
  condition: VisibilityCondition,
  answers: { [key: string]: QuestionAnswer },
): boolean => {
  const { questionId, operator, value, visible = true } = condition

  let isMatch = false

  switch (operator) {
    case 'equals':
      isMatch = checkIsSelected(value as string, questionId, answers)
      break
    case 'notEquals':
      isMatch = !checkIsSelected(value as string, questionId, answers)
      break
    case 'contains':
      if (Array.isArray(value)) {
        isMatch = value.some((val) => checkIsSelected(val, questionId, answers))
      } else {
        isMatch = checkIsSelected(value, questionId, answers)
      }
      break
    case 'notContains':
      if (Array.isArray(value)) {
        isMatch = !value.some((val) =>
          checkIsSelected(val, questionId, answers),
        )
      } else {
        isMatch = !checkIsSelected(value, questionId, answers)
      }
      break
    default:
      return true
  }

  return visible ? isMatch : !isMatch
}

/**
 * Evaluates legacy function-based visibility conditions
 */
const evaluateFunctionCondition = (
  condition: string,
  answers: { [key: string]: QuestionAnswer },
): boolean => {
  let isSelectedMatch = condition.match(
    /isSelected\('([^']+)',\s*'@@@([^']+)'\)/,
  )

  if (!isSelectedMatch) {
    isSelectedMatch = condition.match(/isSelected\('([^']+)',\s*@@@([^)]+)\)/)
  }

  if (isSelectedMatch) {
    const [, expectedValue, questionId] = isSelectedMatch
    return checkIsSelected(expectedValue, questionId, answers)
  }

  const equalityMatch = condition.match(/'([^']+)'\s*==\s*'@@@([^']+)'/)
  if (equalityMatch) {
    const [, expectedValue, questionId] = equalityMatch
    return checkIsSelected(expectedValue, questionId, answers)
  }

  // If we can't parse the condition, default to visible
  return true
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

  try {
    const cleanCondition = condition.trim()

    // Try to parse as JSON
    if (cleanCondition.startsWith('{')) {
      const parsed = JSON.parse(cleanCondition)

      if (parsed.questionId) {
        dependencies.push(parsed.questionId)
      }

      return dependencies
    }
  } catch (error) {
    console.warn('Error extracting dependencies from condition:', error)
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
