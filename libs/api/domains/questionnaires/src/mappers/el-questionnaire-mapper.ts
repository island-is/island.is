import {
  AnswerOption,
  AnswerOptionType,
  Question,
  QuestionDisplayType,
} from '../models/question.model'
import {
  Questionnaire,
  QuestionnaireSection,
  QuestionnairesList,
  QuestionnairesStatusEnum,
} from '../models/questionnaires.model'

// Type definitions for the EL JSON structure
interface ElTrigger {
  triggerId: string
  targetId: string
  visible: boolean
  contains?: string[]
  type: string
}

interface ElItem {
  id: string
  label: string
  type: string
  htmlLabel?: string
  required?: boolean
  min?: number
  max?: number
  decimals?: boolean
  minDescription?: string
  maxDescription?: string
  displayClass?: string
  multiline?: boolean
  multiselect?: boolean
  minSelections?: number
  maxSelections?: number
  options?: Array<{
    id: string
    label: string
  }>
  values?: Array<{
    id: string
    label: string
  }>
}

interface ElGroup {
  title?: string
  items: ElItem[]
}

interface ElData {
  questionnaireId: string
  title: string
  numRepliesAllowed: number
  daysBetweenReplies: number
  canSubmit: boolean
  submissions: unknown[]
  hasDraft: boolean
  groups: ElGroup[]
  triggers: Record<string, ElTrigger[]>
  replies: unknown[]
}

// Map EL question type to the correct answer type
const createAnswerType = (elItem: ElItem): Record<string, unknown> => {
  const baseProps = {
    id: `${elItem.id}_type`,
    sublabel: elItem.htmlLabel || undefined,
    display: mapDisplayType(elItem.required || false),
  }

  switch (elItem.type) {
    case 'radio':
      return {
        type: AnswerOptionType.radio,
        ...baseProps,
        options: elItem.options?.map((option) => option.label) || [],
      }
    case 'checkbox':
      return {
        type: AnswerOptionType.checkbox,
        ...baseProps,
        options: elItem.options?.map((option) => option.label) || [],
      }
    case 'string':
      return {
        type: AnswerOptionType.text,
        ...baseProps,
        placeholder: undefined,
        maxLength: undefined,
        multiline: elItem.multiline || false,
      }
    case 'text':
      return {
        type: AnswerOptionType.label,
        ...baseProps,
      }
    case 'number':
      if (elItem.displayClass === 'thermometer') {
        return {
          type: AnswerOptionType.thermometer,
          ...baseProps,
          maxLabel: elItem.maxDescription || 'Max',
          minLabel: elItem.minDescription || 'Min',
          minValue: elItem.min || 0,
          maxValue: elItem.max || 10,
        }
      } else {
        return {
          type: AnswerOptionType.number,
          ...baseProps,
          placeholder: undefined,
          min: elItem.min || undefined,
          max: elItem.max || undefined,
        }
      }
    case 'bool':
      return {
        type: AnswerOptionType.radio,
        ...baseProps,
        options: ['Já', 'Nei'],
      }
    case 'list': {
      const listOptions = elItem.values || elItem.options || []
      if (elItem.multiselect) {
        return {
          type: AnswerOptionType.checkbox,
          ...baseProps,
          options: listOptions.map((option) => option.label),
        }
      } else {
        return {
          type: AnswerOptionType.radio,
          ...baseProps,
          options: listOptions.map((option) => option.label),
        }
      }
    }
    default:
      return {
        type: AnswerOptionType.text,
        ...baseProps,
        placeholder: undefined,
        maxLength: undefined,
      }
  }
}

const mapDisplayType = (required: boolean): QuestionDisplayType => {
  return required ? QuestionDisplayType.required : QuestionDisplayType.optional
}

// Find an item by its ID across all groups
const findItemById = (elData: ElData, itemId: string): ElItem | undefined => {
  for (const group of elData.groups) {
    for (const item of group.items) {
      if (item.id === itemId) {
        return item
      }
    }
  }
  return undefined
}

// Convert trigger contains IDs to actual option labels
const mapContainsToLabels = (
  elData: ElData,
  triggerId: string,
  contains: string[],
): string[] => {
  const triggerItem = findItemById(elData, triggerId)
  if (!triggerItem || (!triggerItem.options && !triggerItem.values)) {
    return contains // Return original if no mapping possible
  }

  // Use 'values' for list type or 'options' for other types
  const options = triggerItem.values || triggerItem.options || []

  return contains.map((containsId) => {
    const option = options.find((opt) => opt.id === containsId)
    return option ? option.label : containsId // Return label if found, otherwise original ID
  })
}

// Analyze triggers (dependencies) for a question
const analyzeTriggers = (
  elData: ElData,
  currentItemId: string,
): { dependsOn?: string[]; visibilityCondition?: string } => {
  // Find triggers that target this question
  const relevantTriggers: ElTrigger[] = []

  for (const [_triggerId, triggerList] of Object.entries(elData.triggers)) {
    for (const trigger of triggerList) {
      if (trigger.targetId === currentItemId) {
        relevantTriggers.push(trigger)
      }
    }
  }

  if (relevantTriggers.length === 0) {
    return {}
  }

  // For now, handle the first trigger (could be extended to handle multiple)
  const trigger = relevantTriggers[0]
  const dependsOn = [trigger.triggerId]

  // Build visibility condition
  let visibilityCondition = ''
  if (trigger.contains && trigger.contains.length > 0) {
    // Map contains IDs to labels
    const containsLabels = mapContainsToLabels(
      elData,
      trigger.triggerId,
      trigger.contains,
    )

    // Use new unified format
    const condition = {
      questionId: trigger.triggerId,
      operator: 'contains' as const,
      values: containsLabels,
    }
    visibilityCondition = JSON.stringify(condition)
  } else {
    // Simple visibility condition
    const condition = {
      questionId: trigger.triggerId,
      operator: 'visible' as const,
      value: trigger.visible,
    }
    visibilityCondition = JSON.stringify(condition)
  }

  return {
    dependsOn,
    visibilityCondition,
  }
}

const transformQuestion = (elData: ElData, elItem: ElItem): Question => {
  // Create the answer type
  const answerType = createAnswerType(elItem)

  // Create the answer option - spread all properties to avoid nested structure
  const answerOption: AnswerOption = {
    id: `${elItem.id}_answer`,
    value: undefined, // Can be set later when user provides an answer
    type: (answerType as { type: AnswerOptionType }).type,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(answerType as any),
  }

  // Analyze triggers for this item
  const triggerAnalysis = analyzeTriggers(elData, elItem.id)

  return {
    id: elItem.id,
    label: elItem.label,
    sublabel: elItem.htmlLabel || undefined,
    display: mapDisplayType(elItem.required || false),
    answerOptions: answerOption,
    dependsOn: triggerAnalysis.dependsOn,
    visibilityCondition: triggerAnalysis.visibilityCondition,
  }
}

const transformData = (elData: ElData): QuestionnairesList => {
  const sections: QuestionnaireSection[] = []

  // Process each group as a section
  elData.groups.forEach((group) => {
    const questions: Question[] = []

    group.items.forEach((item) => {
      const question = transformQuestion(elData, item)
      questions.push(question)
    })

    sections.push({
      sectionTitle: group.title,
      questions,
    })
  })

  const questionnaire: Questionnaire = {
    id: elData.questionnaireId,
    title: elData.title,
    description: undefined,
    sentDate: new Date().toISOString(),
    status: QuestionnairesStatusEnum.notAnswered,
    organization: 'Embætti landlæknis',
    sections,
  }

  return {
    questionnaires: [questionnaire],
  }
}

/**
 * Transform EL (Embætti landlæknis) questionnaire data to internal format
 * @param elData - The raw EL questionnaire data
 * @returns Transformed questionnaire data
 */
export const transformElQuestionnaire = (
  elData: ElData,
): QuestionnairesList => {
  return transformData(elData)
}

/**
 * Transform EL questionnaire from JSON string
 * @param jsonString - JSON string containing EL questionnaire data
 * @returns Transformed questionnaire data
 */
export const transformElQuestionnaireFromJson = (
  jsonString: string,
): QuestionnairesList => {
  const elData = JSON.parse(jsonString) as ElData
  return transformElQuestionnaire(elData)
}
