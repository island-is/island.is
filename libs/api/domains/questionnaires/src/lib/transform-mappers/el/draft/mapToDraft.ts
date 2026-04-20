/* eslint-disable func-style */
/**
 * Health Directorate Draft Mapper - Converts draft replies from Health Directorate API
 * into the answer format expected by the frontend questionnaire UI.
 */

import { QuestionnaireDetailDto } from '@island.is/clients/health-directorate'
import { FormatMessage } from '@island.is/cms-translations'
import { AnswerOptionType } from '../../../../models/question.model'
import { m } from '../../../utils/messages'
import { mapAnswerOptionType } from '../display/mapAnswerOptionType'

interface Answer {
  label?: string | undefined
  value: string
}
export interface QuestionAnswer {
  questionId: string
  question: string
  answers: Array<Answer>
  type: AnswerOptionType
}

/**
 * Converts Health Directorate draft replies to frontend answer format
 */
export const mapDraftRepliesToAnswers = (
  questionnaire: QuestionnaireDetailDto,
  formatMessage: FormatMessage,
): { [key: string]: QuestionAnswer } => {
  if (!questionnaire.replies || questionnaire.replies.length === 0) {
    return {}
  }
  const answers: { [key: string]: QuestionAnswer } = {}
  const allQuestions = questionnaire.groups.flatMap((g) => g.items)

  questionnaire.replies.forEach((reply) => {
    const question = allQuestions.find((q) => q.id === reply.questionId)
    if (!question) return

    const answerType = mapAnswerOptionType(question.type, question)
    const label = question.label ?? formatMessage(m.noLabel)
    // Helper to get option label for list questions
    const getOptionLabel = (value: string): string | undefined => {
      // Handle boolean questions specially - they don't have values array
      if (question.type === 'bool') {
        if (value === 'true') return formatMessage(m.yes)
        if (value === 'false') return formatMessage(m.no)
        return undefined
      }

      if ('values' in question && question.values) {
        const option = question.values.find((v) => v.id === value)
        return option?.label
      }
      return undefined
    }

    let answerValue: Array<Answer>

    // Handle different reply types
    if ('rows' in reply && Array.isArray(reply.rows)) {
      // TableReplyDto - convert rows to "columnId:type:value" format
      answerValue = []

      // Get column information from the table question
      const tableQuestion = question
      const columns = 'items' in tableQuestion ? tableQuestion.items : []

      reply.rows.forEach((row) => {
        row.forEach((cell) => {
          // Find the column definition for this cell
          const column = columns?.find((col) => col.id === cell.questionId)
          if (!column) return

          // Determine the type based on the answer value type
          let cellType = 'string'
          let cellValue = ''

          // Handle different cell reply types based on the structure
          if ('answer' in cell) {
            const cellAnswer = cell.answer

            if (typeof cellAnswer === 'boolean') {
              cellType = 'boolean'
              cellValue = String(cellAnswer)
            } else if (typeof cellAnswer === 'number') {
              cellType = 'number'
              cellValue = String(cellAnswer)
            } else if (column.type === 'date') {
              cellType = 'date'
              // Format date as YYYY-MM-DD
              if (cellAnswer instanceof Date) {
                cellValue = cellAnswer.toISOString().split('T')[0]
              } else if (typeof cellAnswer === 'string' && cellAnswer) {
                try {
                  const date = new Date(cellAnswer)
                  cellValue = date.toISOString().split('T')[0]
                } catch {
                  cellValue = String(cellAnswer)
                }
              } else {
                cellValue = cellAnswer ? String(cellAnswer) : ''
              }
            } else {
              // String type
              cellValue = cellAnswer ? String(cellAnswer) : ''
            }
          }

          answerValue.push({
            label: column.label,
            value: `${cell.questionId}:${cellType}:${cellValue}`,
          })
        })
      })
    } else if ('values' in reply && Array.isArray(reply.values)) {
      // ListReplyDto (checkbox/multi-select)
      // The reply.values array contains objects with { id: optionId, answer: labelText }
      answerValue = reply.values.map((v) => ({
        label: v.answer, // The answer property already contains the label text
        value: v.id, // The id property contains the option ID/value
      }))
    } else if ('answer' in reply) {
      // Single value replies (String, Number, Boolean, Date)
      let value: string

      // Handle date formatting specifically
      if (question.type === 'date' && reply.answer instanceof Date) {
        // Format date as YYYY-MM-DD for DatePicker
        value = reply.answer.toISOString().split('T')[0]
      } else if (question.type === 'date' && typeof reply.answer === 'string') {
        // If it's already a string, ensure it's in ISO format
        try {
          const date = new Date(reply.answer)
          value = date.toISOString().split('T')[0]
        } catch {
          value = String(reply.answer)
        }
      } else {
        value = String(reply.answer)
      }

      answerValue = [
        {
          label: getOptionLabel(value),
          value: value,
        },
      ]
    } else {
      // Skip invalid or unsupported replies (e.g., Attachment)
      return
    }

    answers[reply.questionId] = {
      questionId: reply.questionId,
      question: label,
      answers: answerValue,
      type: answerType,
    }
  })

  return answers
}
