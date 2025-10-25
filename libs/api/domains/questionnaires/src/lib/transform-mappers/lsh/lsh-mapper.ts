/* eslint-disable func-style */
/**
 * LSH Questionnaire Mapper - Transforms LSH Dev API Form objects into the internal Questionnaire format.
 */
import {
  AnswerOption,
  AnswerOptionType,
  Question,
  VisibilityCondition,
  VisibilityOperator,
} from '../../../models/question.model'
import { QuestionnaireSection } from '../../../models/questionnaire.model'
import {
  QuestionnairesList,
  QuestionnairesStatusEnum,
} from '../../../models/questionnaires.model'

export interface Form {
  formJSON: string
  caption?: string | null
  description?: string | null
  gUID?: string | null
  validToDateTime: string | null
  validFromDateTime: string | null
  answerDateTime?: string | null
  location?: string | null
  answersJSON?: string | null
}

/* -------------------- Helpers -------------------- */

// Safe ISO conversion
function toISOStringSafe(date?: Date | string | null): string | undefined {
  if (!date) return undefined
  const d = new Date(date)
  return isNaN(d.getTime()) ? undefined : d.toISOString()
}

// Enhanced visibility parsing with better pattern matching
function parseVisibility(
  expr: string | null,
): VisibilityCondition[] | undefined {
  if (!expr || expr.toLowerCase() === 'true') return undefined

  const conditions: VisibilityCondition[] = []

  try {
    // Reset the expression for multiple passes
    let remainingExpr = expr

    // Pattern 1: not(isSelected('value', @@@questionId)) - handle negation first
    const notIsSelectedPattern =
      /not\s*\(\s*isSelected\s*\(\s*['"]([^'"]+)['"]\s*,\s*@@@([a-zA-Z0-9_-]+)\s*\)\s*\)/g
    let match

    while ((match = notIsSelectedPattern.exec(remainingExpr)) !== null) {
      conditions.push({
        questionId: match[2],
        operator: VisibilityOperator.equals,
        expectedValues: [match[1]],
        showWhenMatched: false,
      })
      // Remove this match from remaining expression to avoid double processing
      remainingExpr = remainingExpr.replace(match[0], '')
    }

    // Pattern 2: isSelected('value', @@@questionId) - handle positive matches
    const isSelectedPattern =
      /isSelected\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]?@@@([a-zA-Z0-9_-]+)['"]?\s*\)/g

    while ((match = isSelectedPattern.exec(remainingExpr)) !== null) {
      conditions.push({
        questionId: match[2],
        operator: VisibilityOperator.equals,
        expectedValues: [match[1]],
        showWhenMatched: true,
      })
      // Remove this match from remaining expression
      remainingExpr = remainingExpr.replace(match[0], '')
    }

    // Pattern 3: Simple equality '@@@questionId' == 'value'
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
      // Pattern 5: Single mathematical comparisons '@@@questionId operator value'
      const mathPatterns = [
        {
          regex: /@@@([a-zA-Z0-9_-]+)\s*(>=|<=|>|<|==|!=)\s*(\d+(?:\.\d+)?)/g,
          op: 'comparison',
        },
        {
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
function mapAnswerOptionType(
  type: string,
  slider?: string | null,
): AnswerOptionType {
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

function mapQuestion(q: Record<string, unknown>): Question {
  const visibilityConditions = parseVisibility(q['Visible'] as string | null)
  const display = mapDisplayType(
    q['Required'] as boolean | string,
    q['Visible'] as string,
  )
  const answerType = mapAnswerOptionType(
    q['Type'] as string,
    q['Slider'] as string,
  )

  const answerOption: AnswerOption = {
    id: (q['EntryID'] as string) || 'undefined-answer-id',
    type: answerType,
    display,
    label: (q['Question'] as string) || 'Untitled Question',
    placeholder: (q['Instructions'] as string)?.trim() || undefined,
    maxLength: (q['MaxLength'] as number) || undefined,
    options: Array.isArray(q['Options'])
      ? (
          q['Options'] as Array<{ Label: string; Value: string; Id: string }>
        ).map((opt) => ({ label: opt.Label, value: opt.Value, id: opt.Id }))
      : undefined,
    min:
      q['MinValue'] !== null && q['MinValue'] !== undefined
        ? (q['MinValue'] as number).toString()
        : undefined,
    max:
      q['MaxValue'] !== null && q['MaxValue'] !== undefined
        ? (q['MaxValue'] as number).toString()
        : undefined,
    minLabel: (q['MinLabel'] as string)?.trim() || undefined,
    maxLabel: (q['MaxLabel'] as string)?.trim() || undefined,
    formula: (q['Formula'] as string)?.trim() || undefined,
  }

  // Extract dependencies from visibility conditions and explicit DependsOn
  const visibilityDeps = visibilityConditions
    ? visibilityConditions.map((vc) => vc.questionId)
    : []
  const explicitDeps = Array.isArray(q['DependsOn'])
    ? (q['DependsOn'] as string[])
    : []
  const allDeps = [...new Set([...visibilityDeps, ...explicitDeps])]

  return {
    id: (q['EntryID'] as string) || 'undefined-id',
    label: (q['Question'] as string) || 'Untitled Question',
    sublabel: (q['Description'] as string)?.trim() || undefined,
    answerOptions: answerOption,
    visibilityConditions,
    dependsOn: allDeps.length > 0 ? allDeps : undefined,
  }
}

function mapSection(section: Record<string, unknown>): QuestionnaireSection {
  return {
    title: section['Caption'] as string,
    questions: Array.isArray(section['Questions'])
      ? (section['Questions'] as Record<string, unknown>[]).map(mapQuestion)
      : [],
  }
}

function mapQuestionnaire(form: Form): Questionnaire {
  let parsed: Record<string, unknown> = {}
  try {
    parsed = JSON.parse(form.formJSON)
  } catch (err) {
    console.error('Failed to parse formJSON for form', form.gUID, err)
  }

  const now = new Date()
  const validToDate = toISOStringSafe(form.validToDateTime)
  const validTo = validToDate && new Date(validToDate)

  // Check if answerDateTime is a valid date/time value
  const answered =
    form.answerDateTime != null &&
    form.answerDateTime !== '' &&
    form.answerDateTime !== 'null' &&
    typeof form.answerDateTime === 'string'

  const status = answered
    ? QuestionnairesStatusEnum.answered
    : validTo && validTo < now
    ? QuestionnairesStatusEnum.expired
    : QuestionnairesStatusEnum.notAnswered

  return {
    id: form.gUID || 'undefined-id',
    formId: (parsed['FormID'] as string) || 'undefined-form-id',
    title: form.caption || (parsed['Header'] as string) || 'Untitled Form',
    description:
      form.description || (parsed['Description'] as string) || undefined,
    sentDate: toISOStringSafe(form.validFromDateTime) || now.toISOString(),
    status,
    organization: form.location || undefined,
    sections: Array.isArray(parsed['Sections'])
      ? (parsed['Sections'] as Record<string, unknown>[]).map(mapSection)
      : [],
  }
}

// Main mapper
export function mapFormsToQuestionnairesList(
  formsInput: unknown,
): QuestionnairesList {
  let formsArray: Form[] = []

  if (Array.isArray(formsInput)) {
    formsArray = formsInput
  } else if (
    formsInput &&
    typeof formsInput === 'object' &&
    'forms' in formsInput
  ) {
    const formsObj = formsInput as { forms: unknown }
    formsArray = Array.isArray(formsObj.forms)
      ? formsObj.forms
      : [formsObj.forms as Form]
  } else if (formsInput) {
    formsArray = [formsInput as Form]
  }

  const questionnaires = formsArray.map(mapQuestionnaire)
  return { questionnaires }
}
