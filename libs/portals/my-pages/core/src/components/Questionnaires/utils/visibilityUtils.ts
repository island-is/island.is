import { QuestionAnswer } from '../../../types/questionnaire'
import type { QuestionnaireVisibilityCondition } from '@island.is/api/schema'
import { QuestionnaireVisibilityOperator } from '@island.is/api/schema'

type StructuredVisibilityCondition = QuestionnaireVisibilityCondition

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
          if (questionId === 'Checklist21448')
            console.log(
              'checkIsSelected debug:',
              checkIsSelected(val, questionId, answers),
            )
          return checkIsSelected(val, questionId, answers)
        })
        if (questionId === 'Checklist21448') {
          console.log('Expected values:', expectedValues)
          console.log('Answers:', answers)
          console.log('Show when matched:', showWhenMatched)
          console.log('Condition met for equals/contains:', conditionMet)
        }
      }
      break
    case QuestionnaireVisibilityOperator.exists:
      conditionMet = checkQuestionHasAnswer(questionId, answers)
      break
    case QuestionnaireVisibilityOperator.isEmpty:
      conditionMet = !checkQuestionHasAnswer(questionId, answers)
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
    if (condition.questionId === 'Checklist21448') {
      console.log('Evaluating condition for Checklist21448:', condition)
    }
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
