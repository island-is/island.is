import { QuestionType } from '@island.is/clients/lsh'
import { mapAnswerOptionType } from './mapAnswerOptionType'
import { AnswerOption, Question } from '../../../../models/question.model'
import { parseVisibility } from './parseVisibility'

// Map a raw LSH question into our internal Question model
export const mapQuestion = (q: QuestionType): Question => {
  // Parse visibility, taking both expression and dependsOn into account
  const visibilityConditions = parseVisibility(q.visible ?? '', q.dependsOn)

  // Normalize incoming LSH question type/slider into our answer type
  const answerType = mapAnswerOptionType(q.type ?? '', q.slider)

  // Build the answer configuration used by the questionnaire UI
  const answerOption: AnswerOption = {
    type: answerType,
    placeholder: undefined,
    options: q.options?.map((opt) => ({
      // Use value + label to get a stable, unique id for each option
      id: [opt.value, opt.label].join('-'),
      label: opt.label ?? '',
      value: opt.value ?? '',
    })),
    // Numeric constraints and formula are stored as strings for consistency
    min:
      q.minValue !== null && q.minValue !== undefined
        ? q.minValue.toString()
        : undefined,
    max:
      q.maxValue !== null && q.maxValue !== undefined
        ? q.maxValue.toString()
        : undefined,
    maxLength:
      q.maxLength !== null && q.maxLength !== undefined
        ? q.maxLength.toString()
        : undefined,
    formula: q.formula?.trim() || undefined,
  }

  // Extract dependencies from both visibility conditions and explicit dependsOn
  const visibilityDeps = visibilityConditions
    ? visibilityConditions.map((vc) => vc.questionId)
    : []
  const explicitDeps = Array.isArray(q.dependsOn) ? q.dependsOn : []
  // Merge and de-duplicate all dependencies into a single list
  const allDeps = [...new Set([...visibilityDeps, ...explicitDeps])]

  return {
    id: q.entryID ?? q.question ?? 'undefined-id',
    label: q.question ?? '',
    sublabel:
      [q.description?.trim(), q.instructions?.trim()]
        .filter(Boolean)
        .join('<br/> ') ?? undefined,
    answerOptions: answerOption,
    visibilityConditions,
    // Only include dependsOn when there are actual dependencies
    dependsOn: allDeps.length > 0 ? allDeps : undefined,
    required: q.required === true,
  }
}
