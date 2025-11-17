/* eslint-disable func-style */
/**
 * Health Directorate Draft Mapper - Converts draft replies from Health Directorate API
 * into the answer format expected by the frontend questionnaire UI.
 */

import {
  AttachmentQuestionDto,
  BooleanQuestionDto,
  DateQuestionDto,
  ListQuestionDto,
  NumberQuestionDto,
  QuestionnaireDetailDto,
  StringQuestionDto,
  TableQuestionDto,
} from '@island.is/clients/health-directorate'
import { AnswerOptionType } from '../../../models/question.model'

type HealthDirectorateQuestionDto =
  | BooleanQuestionDto
  | StringQuestionDto
  | DateQuestionDto
  | NumberQuestionDto
  | ListQuestionDto
  | AttachmentQuestionDto
  | TableQuestionDto

export interface QuestionAnswer {
  questionId: string
  answers: Array<{ label?: string; value: string }>
  type: string
}

/**
 * Maps the answer type from Health Directorate question type to our internal type
 */
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

/**
 * Converts Health Directorate draft replies to frontend answer format
 */
export const mapDraftRepliesToAnswers = (
  questionnaire: QuestionnaireDetailDto,
): { [key: string]: QuestionAnswer } => {
  if (!questionnaire.replies || questionnaire.replies.length === 0) {
    return {}
  }

  const answers: { [key: string]: QuestionAnswer } = {}
  const allQuestions = questionnaire.groups.flatMap((g) => g.items)

  questionnaire.replies.forEach((reply) => {
    const question = allQuestions.find((q) => q.id === reply.questionId)
    if (!question) return

    const answerType = mapAnswerType(question.type, question)

    // Helper to get option label for list questions
    const getOptionLabel = (value: string): string | undefined => {
      if ('values' in question && question.values) {
        const option = question.values.find((v) => v.id === value)
        return option?.label
      }
      return undefined
    }

    let answerValue: Array<{ label?: string; value: string }>

    // Handle different reply types
    if ('values' in reply && Array.isArray(reply.values)) {
      // ListReplyDto (checkbox/multi-select)
      // The reply.values array contains objects with { id: optionId, answer: labelText }
      answerValue = reply.values.map((v) => ({
        label: v.answer, // The answer property already contains the label text
        value: v.id, // The id property contains the option ID/value
      }))
    } else if ('answer' in reply) {
      // Single value replies (String, Number, Boolean, Date)
      const value = String(reply.answer)
      answerValue = [
        {
          label: getOptionLabel(value),
          value: value,
        },
      ]
    } else {
      // Skip invalid or unsupported replies (e.g., Attachment, Table)
      return
    }

    answers[reply.questionId] = {
      questionId: reply.questionId,
      answers: answerValue,
      type: answerType,
    }
  })

  return answers
}
