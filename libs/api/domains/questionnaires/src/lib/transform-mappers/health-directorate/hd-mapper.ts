/* eslint-disable func-style */
/**
 * Health Directorate Questionnaire Mapper - Transforms Health Directorate API Form objects into the internal Questionnaire format.
 */

import {
  AttachmentQuestionDto,
  BooleanQuestionDto,
  BooleanTriggerDto,
  DateQuestionDto,
  ListQuestionDto,
  ListTriggerDto,
  NumberQuestionDto,
  NumberTriggerDto,
  QuestionGroupDto,
  QuestionnaireBaseDto,
  QuestionnaireDetailDto,
  StringQuestionDto,
  TableQuestionDto,
} from '@island.is/clients/health-directorate'
import {
  AnswerOptionType,
  Question,
  VisibilityCondition,
  VisibilityOperator,
} from '../../../models/question.model'
import {
  Questionnaire,
  QuestionnaireSection,
} from '../../../models/questionnaire.model'
import {
  QuestionnairesOrganizationEnum,
  QuestionnairesStatusEnum,
} from '../../../models/questionnaires.model'
import { mapDraftRepliesToAnswers } from './hd-draft-mapper'

type HealthDirectorateQuestionDto =
  | BooleanQuestionDto
  | StringQuestionDto
  | DateQuestionDto
  | NumberQuestionDto
  | ListQuestionDto
  | AttachmentQuestionDto
  | TableQuestionDto

type HealthDirectorateQuestionTriggers =
  | NumberTriggerDto
  | ListTriggerDto
  | BooleanTriggerDto

/* -------------------- Helper Functions -------------------- */

const mapAnswerType = (
  type: string,
  item: HealthDirectorateQuestionDto,
): AnswerOptionType => {
  switch (type) {
    case 'text':
      return AnswerOptionType.label
    case 'string':
      if ('multiline' in item && item.multiline) {
        return AnswerOptionType.textarea
      }
      return AnswerOptionType.text
    case 'number':
      if ('displayClass' in item && item.displayClass === 'thermometer')
        return AnswerOptionType.thermometer
      return AnswerOptionType.number
    case 'bool':
      // Boolean questions are typically yes/no radio buttons
      return AnswerOptionType.radio
    case 'list':
      return 'multiselect' in item && item.multiselect
        ? AnswerOptionType.checkbox
        : 'displayClass' in item && item.displayClass === 'slider'
        ? AnswerOptionType.slider
        : AnswerOptionType.radio
    case 'thermometer':
      return AnswerOptionType.thermometer
    case 'date':
      return AnswerOptionType.date
    case 'datetime':
      return AnswerOptionType.datetime
    case 'table':
      return AnswerOptionType.scale
    default:
      return AnswerOptionType.text
  }
}

const mapTriggers = (
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
    // Find the trigger with specific contains values (the positive condition)
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
        operator: VisibilityOperator.equals,
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
          JSON.stringify(c.expectedValues) ===
            JSON.stringify(condition.expectedValues),
      ) === index
    )
  })

  return {
    dependsOn: Array.from(dependsOnSet),
    visibilityConditions:
      uniqueConditions.length > 0 ? uniqueConditions : undefined,
  }
}

const mapItemToQuestion = (
  item: HealthDirectorateQuestionDto,
  allQuestions: HealthDirectorateQuestionDto[],
  locale: 'is' | 'en',
  triggers?: Record<string, HealthDirectorateQuestionTriggers[]>,
): Question => {
  const answerType = mapAnswerType(item.type, item)
  const triggerDeps = mapTriggers(allQuestions, triggers, item.id)

  // Handle options based on question type
  let options: Array<{ label: string; value: string; id: string }> | undefined

  if (item.type === 'bool') {
    // Boolean questions get Yes/No options
    options = [
      { label: locale === 'is' ? 'Já' : 'Yes', value: 'true', id: 'true' },
      { label: locale === 'is' ? 'Nei' : 'No', value: 'false', id: 'false' },
    ]
  } else if ('values' in item && item.values) {
    // List questions use provided values
    options = item.values.map((v) => ({
      label: v.label,
      value: v.id,
      id: v.id,
    }))
  }

  const answerOptions = {
    id: item.id,
    type: answerType,
    label: undefined,
    options,
    placeholder: item.hint,
    maxLength: 'maxLength' in item ? item.maxLength?.toString() : '',
    min: 'min' in item && item.min !== undefined ? item.min.toString() : '',
    max: 'max' in item && item.max !== undefined ? item.max.toString() : '',
    minLabel:
      'minDescription' in item &&
      item.minDescription &&
      typeof item.minDescription === 'string'
        ? item.minDescription
        : '',
    maxLabel:
      'maxDescription' in item &&
      item.maxDescription &&
      typeof item.maxDescription === 'string'
        ? item.maxDescription
        : '',
    multiline: 'multiline' in item && item.multiline,
    decimal: 'decimals' in item && item.decimals ? true : false,
  }

  return {
    id: item.id,
    label: item.label,
    htmlLabel: item.htmlLabel,
    sublabel: item.hint,
    required: 'required' in item ? item.required : false,
    answerOptions,
    ...triggerDeps,
  }
}

const mapGroupToSection = (
  group: QuestionGroupDto,
  allQuestions: HealthDirectorateQuestionDto[],
  locale: 'is' | 'en',
  triggers?: Record<string, HealthDirectorateQuestionTriggers[]>,
): QuestionnaireSection => {
  return {
    title: group.title,
    questions: group.items.map((item) =>
      mapItemToQuestion(item, allQuestions, locale, triggers),
    ),
  }
}

/* -------------------- Core Mapper -------------------- */

export const mapExternalQuestionnaireToGraphQL = (
  q: QuestionnaireDetailDto | QuestionnaireBaseDto,
  locale: 'is' | 'en',
): Questionnaire => {
  const isDetailed = 'groups' in q && 'triggers' in q
  let allQuestions: HealthDirectorateQuestionDto[] = []
  if (isDetailed) {
    allQuestions = q.groups.flatMap((g) => g.items)
  }

  // Get draft answers if available
  const draftAnswersMap =
    isDetailed && q.replies?.length ? mapDraftRepliesToAnswers(q) : undefined

  // Convert draft answers map to array for GraphQL
  const draftAnswers = draftAnswersMap
    ? Object.values(draftAnswersMap)
    : undefined

  return {
    baseInformation: {
      id: q.questionnaireId,
      title: q.title ?? q.questionnaireId,
      sentDate: new Date().toISOString(),
      status: isDetailed
        ? q.submissions.length > 0
          ? QuestionnairesStatusEnum.answered
          : QuestionnairesStatusEnum.notAnswered
        : q.numSubmissions > 0
        ? QuestionnairesStatusEnum.answered
        : QuestionnairesStatusEnum.notAnswered,
      description: isDetailed ? q.message ?? undefined : q.message || undefined,
      formId: q.questionnaireId,
      organization: QuestionnairesOrganizationEnum.EL, // TODO: ask if this is correct
    },
    expirationDate: isDetailed ? q.expiryDate ?? undefined : undefined,
    canSubmit: isDetailed ? q.canSubmit : undefined,
    submissions: isDetailed
      ? q.submissions.map((sub) => ({
          id: sub.id,
          createdAt: sub.createdDate ?? undefined,
          isDraft: sub.isDraft,
          lastUpdated: sub.lastUpdatedDate ?? undefined,
        }))
      : undefined,
    sections: isDetailed
      ? q.groups.map((g) =>
          mapGroupToSection(g, allQuestions, locale, q.triggers),
        )
      : undefined,
    draftAnswers,
  }
}
