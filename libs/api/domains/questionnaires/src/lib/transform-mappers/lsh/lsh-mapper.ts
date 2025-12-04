/* eslint-disable func-style */
/**
 * LSH Questionnaire Mapper - Transforms LSH Dev API Form objects into the internal Questionnaire format.
 */
import {
  QuestionnaireBody,
  QuestionType,
  Section,
} from '@island.is/clients/lsh'
import {
  AnswerOption,
  AnswerOptionType,
  Question,
  VisibilityCondition,
  VisibilityOperator,
} from '../../../models/question.model'
import {
  Questionnaire,
  QuestionnaireSection,
} from '../../../models/questionnaire.model'
import { QuestionnairesOrganizationEnum } from '../../../models/questionnaires.model'

// Enhanced visibility parsing with better pattern matching
const parseVisibility = (
  expr: string | null,
  dependsOn?: string[] | null,
): VisibilityCondition[] | undefined => {
  // If empty expression but has dependencies, create existence conditions
  if (!expr || expr.toLowerCase() === 'true' || expr.trim() === '') {
    if (dependsOn && dependsOn.length > 0) {
      return dependsOn.map((questionId) => ({
        questionId,
        operator: VisibilityOperator.exists,
        expectedValues: undefined,
        showWhenMatched: true,
      }))
    }
    return undefined
  }

  const conditions: VisibilityCondition[] = []

  try {
    // Reset the expression for multiple passes
    let remainingExpr = expr

    // Pattern 1: not(isSelected('value', @@@questionId)) or not(isSelected(number, @@@questionId))
    // Handle negation - question should be HIDDEN when value is selected
    // Handle single-quoted strings (can contain parentheses)
    const notIsSelectedQuotedPattern =
      /not\s*\(\s*isSelected\s*\(\s*'([^']+)'\s*,\s*@@@([a-zA-Z0-9_-]+)\s*\)\s*\)/g
    let match

    while ((match = notIsSelectedQuotedPattern.exec(remainingExpr)) !== null) {
      const expectedValue = match[1].trim()
      conditions.push({
        questionId: match[2],
        operator: VisibilityOperator.equals,
        expectedValues: [expectedValue],
        showWhenMatched: false, // This means: hide when the value matches
      })
      remainingExpr = remainingExpr.replace(match[0], '')
    }

    // Handle double-quoted strings
    const notIsSelectedDoubleQuotedPattern =
      /not\s*\(\s*isSelected\s*\(\s*"([^"]+)"\s*,\s*@@@([a-zA-Z0-9_-]+)\s*\)\s*\)/g

    while (
      (match = notIsSelectedDoubleQuotedPattern.exec(remainingExpr)) !== null
    ) {
      const expectedValue = match[1].trim()
      conditions.push({
        questionId: match[2],
        operator: VisibilityOperator.equals,
        expectedValues: [expectedValue],
        showWhenMatched: false,
      })
      remainingExpr = remainingExpr.replace(match[0], '')
    }

    // Fallback for unquoted values (typically numbers)
    const notIsSelectedUnquotedPattern =
      /not\s*\(\s*isSelected\s*\(\s*([^'",\s)]+)\s*,\s*@@@([a-zA-Z0-9_-]+)\s*\)\s*\)/g

    while (
      (match = notIsSelectedUnquotedPattern.exec(remainingExpr)) !== null
    ) {
      const expectedValue = match[1].trim()
      conditions.push({
        questionId: match[2],
        operator: VisibilityOperator.equals,
        expectedValues: [expectedValue],
        showWhenMatched: false,
      })
      remainingExpr = remainingExpr.replace(match[0], '')
    }

    // Pattern 2: isSelected('value', @@@questionId) or isSelected(number, @@@questionId)
    // This handles both string and numeric values
    // First try quoted string pattern (handles values with parentheses inside)
    const isSelectedQuotedPattern =
      /isSelected\s*\(\s*'([^']+)'\s*,\s*['"]?@@@([a-zA-Z0-9_-]+)['"]?\s*\)/g

    while ((match = isSelectedQuotedPattern.exec(remainingExpr)) !== null) {
      const expectedValue = match[1].trim()
      conditions.push({
        questionId: match[2],
        operator: VisibilityOperator.equals,
        expectedValues: [expectedValue],
        showWhenMatched: true,
      })
      // Remove this match from remaining expression
      remainingExpr = remainingExpr.replace(match[0], '')
    }

    // Also handle double-quoted strings
    const isSelectedDoubleQuotedPattern =
      /isSelected\s*\(\s*"([^"]+)"\s*,\s*['"]?@@@([a-zA-Z0-9_-]+)['"]?\s*\)/g

    while (
      (match = isSelectedDoubleQuotedPattern.exec(remainingExpr)) !== null
    ) {
      const expectedValue = match[1].trim()
      conditions.push({
        questionId: match[2],
        operator: VisibilityOperator.equals,
        expectedValues: [expectedValue],
        showWhenMatched: true,
      })
      // Remove this match from remaining expression
      remainingExpr = remainingExpr.replace(match[0], '')
    }

    // Fallback for unquoted numeric values: isSelected(123, @@@questionId)
    const isSelectedUnquotedPattern =
      /isSelected\s*\(\s*([^'",\s)]+)\s*,\s*['"]?@@@([a-zA-Z0-9_-]+)['"]?\s*\)/g

    while ((match = isSelectedUnquotedPattern.exec(remainingExpr)) !== null) {
      const expectedValue = match[1].trim()
      conditions.push({
        questionId: match[2],
        operator: VisibilityOperator.equals,
        expectedValues: [expectedValue],
        showWhenMatched: true,
      })
      // Remove this match from remaining expression
      remainingExpr = remainingExpr.replace(match[0], '')
    }

    // Pattern 3: Simple equality '@@@questionId' == 'value' or 'value' == '@@@questionId'
    const equalityPattern =
      /['"]?@@@([a-zA-Z0-9_-]+)['"]?\s*==\s*['"]([^'"]+)['"]/g

    while ((match = equalityPattern.exec(remainingExpr)) !== null) {
      conditions.push({
        questionId: match[1],
        operator: VisibilityOperator.equals,
        expectedValues: [match[2]],
        showWhenMatched: true,
      })
      remainingExpr = remainingExpr.replace(match[0], '')
    }

    // Pattern 3b: Reverse equality 'value' == '@@@questionId'
    const reverseEqualityPattern =
      /['"]([^'"]+)['"]\s*==\s*['"]?@@@([a-zA-Z0-9_-]+)['"]?/g

    while ((match = reverseEqualityPattern.exec(remainingExpr)) !== null) {
      conditions.push({
        questionId: match[2],
        operator: VisibilityOperator.equals,
        expectedValues: [match[1]],
        showWhenMatched: true,
      })
      remainingExpr = remainingExpr.replace(match[0], '')
    }

    // Pattern 4: Handle complex logical expressions with && and ||
    // Example: "@@@Totalscore >=20 && @@@Totalscore <=24"
    const complexLogicalPattern = /(.+?)\s*(&&|\|\|)\s*(.+)/
    const complexMatch = complexLogicalPattern.exec(remainingExpr)

    if (complexMatch) {
      const leftExpr = complexMatch[1].trim()
      const logicalOp = complexMatch[2]
      const rightExpr = complexMatch[3].trim()

      // Parse left and right expressions separately
      const leftConditions = parseVisibility(leftExpr) || []
      const rightConditions = parseVisibility(rightExpr) || []

      // For && operations, we need ALL conditions to be true (AND logic)
      // For || operations, we need ANY condition to be true (OR logic)
      // Since our current system uses AND logic by default, we can combine them
      if (logicalOp === '&&') {
        conditions.push(...leftConditions, ...rightConditions)
      } else if (logicalOp === '||') {
        // For OR logic, we'd need a different approach
        // For now, let's treat it as AND since that's what our evaluation supports
        conditions.push(...leftConditions, ...rightConditions)
      }

      // Clear the remaining expression since we processed the whole thing
      remainingExpr = ''
    } else {
      // Pattern 5: Single mathematical comparisons - handle quoted and unquoted forms
      // Matches: '@@@Q6'>'4', @@@Q6>4, '@@@Q6'>='4', @@@Q6>=4, etc.
      const mathPatterns = [
        {
          // Quoted form: '@@@questionId' operator 'value'
          regex:
            /['"]@@@([a-zA-Z0-9_-]+)['"]\s*(>=|<=|>|<|==|!=)\s*['"](\d+(?:\.\d+)?)['"]/g,
          op: 'comparison',
        },
        {
          // Unquoted form: @@@questionId operator value
          regex: /@@@([a-zA-Z0-9_-]+)\s*(>=|<=|>|<|==|!=)\s*(\d+(?:\.\d+)?)/g,
          op: 'comparison',
        },
        {
          // Variable comparison (unquoted): @@@questionId operator @@@otherQuestionId
          regex:
            /@@@([a-zA-Z0-9_-]+)\s*(>=|<=|>|<|==|!=)\s*@@@([a-zA-Z0-9_-]+)/g,
          op: 'variable_comparison',
        },
      ]

      for (const pattern of mathPatterns) {
        let mathMatch
        while ((mathMatch = pattern.regex.exec(remainingExpr)) !== null) {
          const operator = mathMatch[2]
          const value =
            pattern.op === 'variable_comparison' ? mathMatch[3] : mathMatch[3]

          // Map operators to our visibility operators
          let visibilityOp = VisibilityOperator.equals
          const expectedVal = value
          let showWhen = true

          switch (operator) {
            case '>':
              visibilityOp = VisibilityOperator.greaterThan
              break
            case '>=':
              visibilityOp = VisibilityOperator.greaterThanOrEqual
              break
            case '<':
              visibilityOp = VisibilityOperator.lessThan
              break
            case '<=':
              visibilityOp = VisibilityOperator.lessThanOrEqual
              break
            case '==':
              visibilityOp = VisibilityOperator.equals
              break
            case '!=':
              visibilityOp = VisibilityOperator.equals
              showWhen = false
              break
          }

          conditions.push({
            questionId: mathMatch[1],
            operator: visibilityOp,
            expectedValues: [expectedVal],
            showWhenMatched: showWhen,
          })

          remainingExpr = remainingExpr.replace(mathMatch[0], '')
        }
      }
    }

    // Pattern 6: Existence check - only if no specific patterns matched and has unprocessed @@@
    if (conditions.length === 0 && remainingExpr.includes('@@@')) {
      const dependencyPattern = /@@@([a-zA-Z0-9_-]+)/g
      let depMatch
      while ((depMatch = dependencyPattern.exec(remainingExpr)) !== null) {
        conditions.push({
          questionId: depMatch[1],
          operator: VisibilityOperator.exists,
          expectedValues: undefined,
          showWhenMatched: true,
        })
      }
    }
  } catch (error) {
    console.warn('Error parsing visibility expression:', expr, error)
  }

  // Add explicit dependencies from dependsOn array if not already captured
  if (dependsOn && dependsOn.length > 0) {
    const existingQuestionIds = new Set(conditions.map((c) => c.questionId))

    dependsOn.forEach((questionId) => {
      if (!existingQuestionIds.has(questionId)) {
        conditions.push({
          questionId,
          operator: VisibilityOperator.exists,
          expectedValues: undefined,
          showWhenMatched: true,
        })
      }
    })
  }

  // Deduplicate conditions based on questionId, operator, and expectedValues
  const uniqueConditions = conditions.filter((condition, index, self) => {
    return (
      index ===
      self.findIndex(
        (c) =>
          c.questionId === condition.questionId &&
          c.operator === condition.operator &&
          JSON.stringify(c.expectedValues) ===
            JSON.stringify(condition.expectedValues) &&
          c.showWhenMatched === condition.showWhenMatched,
      )
    )
  })

  return uniqueConditions.length > 0 ? uniqueConditions : undefined
}

// Map question type
const mapAnswerOptionType = (
  type: string,
  slider?: string | null,
): AnswerOptionType => {
  switch (type) {
    case 'String':
      return AnswerOptionType.text
    case 'Label':
      return AnswerOptionType.label
    case 'Text':
      return AnswerOptionType.text
    case 'SingleSelect':
      return AnswerOptionType.radio
    case 'MultiSelect':
      return AnswerOptionType.checkbox
    case 'Number':
      if (slider && slider === '1') {
        return AnswerOptionType.scale
      }
      return AnswerOptionType.number
    case 'Date':
      return AnswerOptionType.date
    case 'DateTime':
      return AnswerOptionType.datetime
    case 'Slider':
      return AnswerOptionType.thermometer
    default:
      return AnswerOptionType.text
  }
}

/* -------------------- Core Mapping -------------------- */

const mapQuestion = (q: QuestionType): Question => {
  // Parse visibility with dependsOn array for better dependency tracking
  const visibilityConditions = parseVisibility(
    q.visible as string,
    q.dependsOn as string[] | null,
  )

  const answerType = mapAnswerOptionType(q.type as string, q.slider as string)

  const answerOption: AnswerOption = {
    type: answerType,
    placeholder: (q.instructions as string)?.trim() || undefined,
    options: q.options?.map((opt) => ({
      id: ((opt.value ?? '') + (opt.label ?? '')) as string,
      label: (opt.label ?? '') as string,
      value: (opt.value ?? '') as string,
    })),
    min:
      q.minValue !== null && q.minValue !== undefined
        ? (q.minValue as number).toString()
        : undefined,
    max:
      q.maxValue !== null && q.maxValue !== undefined
        ? (q.maxValue as number).toString()
        : undefined,
    maxLength:
      q.maxLength !== null && q.maxLength !== undefined
        ? q.maxLength.toString()
        : undefined,
    formula: (q.formula as string)?.trim() || undefined,
  }

  // Extract dependencies from visibility conditions and explicit DependsOn
  const visibilityDeps = visibilityConditions
    ? visibilityConditions.map((vc) => vc.questionId)
    : []
  const explicitDeps = Array.isArray(q.dependsOn)
    ? (q.dependsOn as string[])
    : []
  const allDeps = [...new Set([...visibilityDeps, ...explicitDeps])]

  return {
    id: (q.entryID as string) || 'undefined-id',
    label: (q.question as string) || '',
    sublabel: (q.description as string)?.trim() || undefined,
    answerOptions: answerOption,
    visibilityConditions,
    dependsOn: allDeps.length > 0 ? allDeps : undefined,
    required: q.required === true,
  }
}

const mapSection = (section: Section): QuestionnaireSection => {
  return {
    title: section.caption || '',
    questions: Array.isArray(section.questions)
      ? section.questions.map(mapQuestion)
      : [],
  }
}

export const mapLshQuestionnaire = (form: QuestionnaireBody): Questionnaire => {
  const data = {
    baseInformation: {
      id: form.gUID || 'undefined-id',
      formId: form.formID || 'undefined-form-id',
      title: form.header || '',
      description: form.description || undefined,
      organization: QuestionnairesOrganizationEnum.LSH,
      sentDate: '',
    },
    sections: form.sections ? form.sections.map(mapSection) : [],
  }
  return data
}
