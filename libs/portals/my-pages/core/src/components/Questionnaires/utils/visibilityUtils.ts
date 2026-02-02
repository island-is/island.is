import type { QuestionnaireVisibilityCondition } from '@island.is/api/schema'
import { QuestionnaireVisibilityOperator } from '@island.is/api/schema'
import { QuestionAnswer } from '../../../types/questionnaire'

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
  if (!answer || answer.answers === undefined || answer.answers === null)
    return false

  const value = answer.answers

  for (const item of value) {
    if (item.value === expectedValue) return true
  }

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
  if (!answer || !answer.answers || answer.answers.length === 0) return false

  const firstValue = answer.answers[0].value
  let actualValue: number
  if (typeof firstValue === 'number') {
    actualValue = firstValue
  } else if (typeof firstValue === 'string') {
    actualValue = parseFloat(firstValue)
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
  if (!answer || !answer.answers || answer.answers.length === 0) return false

  // Check if any answer has a non-empty value
  return answer.answers.some((item) => {
    const value = item.value
    if (typeof value === 'string') return value.trim() !== ''
    return true
  })
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

export const isSectionVisible = (
  section: {
    visibilityConditions?:
      | StructuredVisibilityCondition[]
      | QuestionnaireVisibilityCondition[]
      | null
    dependsOn?: string[] | null
  },
  answers: { [key: string]: QuestionAnswer },
): boolean => {
  // If no visibility conditions, section is always visible
  if (
    !section.visibilityConditions ||
    section.visibilityConditions.length === 0
  ) {
    return true
  }

  // Evaluate all visibility conditions (AND logic)
  return evaluateStructuredVisibilityConditions(
    section.visibilityConditions as StructuredVisibilityCondition[],
    answers,
  )
}

// Safe expression evaluator for mathematical formulas
// Wrap in try-catch when calling this function
export const evaluateExpression = (expression: string): number => {
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

    // Find rightmost top-level '+' or '-' (lowest precedence, left-to-right associativity)
    let parenDepth = 0
    for (let i = expr.length - 1; i >= 0; i--) {
      const char = expr[i]
      if (char === ')') parenDepth++
      else if (char === '(') parenDepth--
      else if (parenDepth === 0 && (char === '+' || char === '-')) {
        // Skip if this is a leading minus sign
        if (i === 0) continue

        const left = expr.substring(0, i)
        const operator = char
        const right = expr.substring(i + 1)

        const leftValue = parseExpression(left)
        const rightValue = parseExpression(right)
        return operator === '+'
          ? leftValue + rightValue
          : leftValue - rightValue
      }
    }

    // Find rightmost top-level '*' or '/' (higher precedence, left-to-right associativity)
    parenDepth = 0
    for (let i = expr.length - 1; i >= 0; i--) {
      const char = expr[i]
      if (char === ')') parenDepth++
      else if (char === '(') parenDepth--
      else if (parenDepth === 0 && (char === '*' || char === '/')) {
        const left = expr.substring(0, i)
        const operator = char
        const right = expr.substring(i + 1)

        const leftValue = parseExpression(left)
        const rightValue = parseExpression(right)

        if (operator === '/') {
          if (rightValue === 0) {
            console.error('Division by zero')
            return 0
          }
          return leftValue / rightValue
        }

        return leftValue * rightValue
      }
    }

    // Parse number (or handle leading minus)
    const num = parseFloat(expr)
    if (isNaN(num)) {
      throw new Error(`Invalid number: ${expr}`)
    }

    return num
  }

  return parseExpression(cleanExpression)
}
