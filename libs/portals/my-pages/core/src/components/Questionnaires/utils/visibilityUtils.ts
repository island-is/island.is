import { QuestionAnswer } from '../../../types/questionnaire'
import type { QuestionnaireVisibilityCondition } from '@island.is/api/schema'
import { QuestionnaireVisibilityOperator } from '@island.is/api/schema'

// Extended type to include mathematical operators
type ExtendedVisibilityOperator =
  | QuestionnaireVisibilityOperator
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'

interface ExtendedVisibilityCondition
  extends Omit<QuestionnaireVisibilityCondition, 'operator'> {
  operator: ExtendedVisibilityOperator
}

type StructuredVisibilityCondition = ExtendedVisibilityCondition

/* -------------------- Helper Functions -------------------- */

// Check if a question has a value matching expectedValue
const checkIsSelected = (
  expectedValue: string,
  questionId: string,
  answers: { [key: string]: QuestionAnswer },
): boolean => {
  const answer = answers[questionId]
  if (!answer || answer.value === undefined || answer.value === null)
    return false

  const value = answer.value

  if (Array.isArray(value)) return value.includes(expectedValue)
  if (typeof value === 'string') return value === expectedValue
  if (typeof value === 'number') return value.toString() === expectedValue

  return false
}

// Check mathematical comparison
const checkMathematicalComparison = (
  operator: string,
  questionId: string,
  expectedValue: string,
  answers: { [key: string]: QuestionAnswer },
): boolean => {
  const answer = answers[questionId]
  if (!answer || answer.value === undefined || answer.value === null)
    return false

  let actualValue: number
  if (typeof answer.value === 'number') {
    actualValue = answer.value
  } else if (typeof answer.value === 'string') {
    actualValue = parseFloat(answer.value)
    if (isNaN(actualValue)) return false
  } else {
    return false
  }

  const expected = parseFloat(expectedValue)
  if (isNaN(expected)) return false

  switch (operator) {
    case 'greaterThan':
      return actualValue > expected
    case 'greaterThanOrEqual':
      return actualValue >= expected
    case 'lessThan':
      return actualValue < expected
    case 'lessThanOrEqual':
      return actualValue <= expected
    default:
      return false
  }
}

// Check if a question has any answer
const checkQuestionHasAnswer = (
  questionId: string,
  answers: { [key: string]: QuestionAnswer },
): boolean => {
  const answer = answers[questionId]
  if (!answer || answer.value === undefined || answer.value === null)
    return false

  const value = answer.value
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'string') return value.trim() !== ''
  if (typeof value === 'number') return true

  return false
}

/* -------------------- Evaluate a Single Condition -------------------- */
const evaluateStructuredCondition = (
  condition: StructuredVisibilityCondition,
  answers: { [key: string]: QuestionAnswer },
): boolean => {
  const { questionId, operator, expectedValues, showWhenMatched } = condition
  let conditionMet = false

  switch (operator) {
    case QuestionnaireVisibilityOperator.equals:
    case QuestionnaireVisibilityOperator.contains:
      if (expectedValues && expectedValues.length > 0) {
        conditionMet = expectedValues.some((val) => {
          return checkIsSelected(val, questionId, answers)
        })
      }
      break
    case QuestionnaireVisibilityOperator.exists:
      conditionMet = checkQuestionHasAnswer(questionId, answers)
      break
    case QuestionnaireVisibilityOperator.isEmpty:
      conditionMet = !checkQuestionHasAnswer(questionId, answers)
      break
    // Handle mathematical operators
    case 'greaterThan':
    case 'greaterThanOrEqual':
    case 'lessThan':
    case 'lessThanOrEqual':
      if (expectedValues && expectedValues.length > 0) {
        conditionMet = checkMathematicalComparison(
          operator,
          questionId,
          expectedValues[0],
          answers,
        )
      }
      break
    default:
      return true
  }

  return showWhenMatched ? conditionMet : !conditionMet
}

/* -------------------- Evaluate Multiple Conditions (AND logic) -------------------- */
export const evaluateStructuredVisibilityConditions = (
  conditions: StructuredVisibilityCondition[] | undefined,
  answers: { [key: string]: QuestionAnswer },
): boolean => {
  if (!conditions || conditions.length === 0) return true
  return conditions.every((condition) => {
    return evaluateStructuredCondition(condition, answers)
  })
}

/* -------------------- Extract dependencies from visibilityConditions -------------------- */
export const extractDependenciesFromStructuredConditions = (
  conditions: StructuredVisibilityCondition[] | undefined,
): string[] => {
  if (!conditions || conditions.length === 0) return []
  return [...new Set(conditions.map((c) => c.questionId))]
}

/* -------------------- Public helper to check question visibility -------------------- */
export const isQuestionVisibleWithStructuredConditions = (
  visibilityConditions: StructuredVisibilityCondition[] | undefined,
  answers: { [key: string]: QuestionAnswer },
): boolean => {
  return evaluateStructuredVisibilityConditions(visibilityConditions, answers)
}

// Safe expression evaluator for mathematical formulas
// Wrap in try-catch when calling this function
const evaluateExpression = (expression: string): number => {
  // Clean the expression - only allow numbers, operators, parentheses, and whitespace
  const cleanExpression = expression.replace(/[^0-9+\-*/().]/g, ' ').trim()

  // Validate the expression contains only allowed characters
  if (!cleanExpression || !/^[0-9+\-*/().\s]+$/.test(cleanExpression)) {
    throw new Error('Invalid expression')
  }

  const parseExpression = (expr: string): number => {
    // Remove whitespace
    expr = expr.replace(/\s/g, '')

    // Handle parentheses recursively
    while (expr.includes('(')) {
      const lastOpen = expr.lastIndexOf('(')
      const firstClose = expr.indexOf(')', lastOpen)

      if (firstClose === -1) {
        throw new Error('Mismatched parentheses')
      }

      const subExpr = expr.substring(lastOpen + 1, firstClose)
      const subResult = parseExpression(subExpr)
      expr =
        expr.substring(0, lastOpen) + subResult + expr.substring(firstClose + 1)
    }

    // Parse addition and subtraction (lowest precedence)
    const addSubMatch = expr.match(/^(.+?)([+-])(.+)$/)
    if (addSubMatch) {
      const left = parseExpression(addSubMatch[1])
      const operator = addSubMatch[2]
      const right = parseExpression(addSubMatch[3])
      return operator === '+' ? left + right : left - right
    }

    // Parse multiplication and division (higher precedence)
    const mulDivMatch = expr.match(/^(.+?)([*/])(.+)$/)
    if (mulDivMatch) {
      const left = parseExpression(mulDivMatch[1])
      const operator = mulDivMatch[2]
      const right = parseExpression(mulDivMatch[3])
      return operator === '*' ? left * right : left / right
    }

    // Parse number
    const num = parseFloat(expr)
    if (isNaN(num)) {
      throw new Error(`Invalid number: ${expr}`)
    }

    return num
  }

  return parseExpression(cleanExpression)
}

// Calculate LSH based questions formula value based on current answers
export const calculateFormula = (
  formula: string,
  answers: { [key: string]: QuestionAnswer },
): number | null => {
  let expression = formula.trim()

  // Replace all @@@QuestionId with actual values
  const questionRefs = expression.match(/@@@([a-zA-Z0-9_-]+)/g)
  if (questionRefs) {
    for (const ref of questionRefs) {
      const questionId = ref.replace('@@@', '')
      const answer = answers[questionId]
      let value = 0

      if (answer && answer.value !== undefined && answer.value !== null) {
        if (typeof answer.value === 'number') {
          value = answer.value
        } else if (typeof answer.value === 'string') {
          const parsed = parseFloat(answer.value)
          value = isNaN(parsed) ? 0 : parsed
        } else if (Array.isArray(answer.value)) {
          // For arrays, sum all numeric values
          value = answer.value.reduce((sum, val) => {
            const num = typeof val === 'number' ? val : parseFloat(String(val))
            return sum + (isNaN(num) ? 0 : num)
          }, 0)
        }
      }

      expression = expression.replace(ref, value.toString())
    }
  }

  try {
    const result = evaluateExpression(expression)
    return typeof result === 'number' ? result : 0
  } catch (error) {
    console.warn('Error evaluating formula:', formula, error)
    return 0
  }
}
