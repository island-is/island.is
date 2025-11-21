import { AnswerOptionType } from '../../../models/question.model'
import { QuestionnaireInput } from '../../dto/questionnaire.input'

// Type definitions matching the Health Directorate API
type StringReply = {
  questionId: string
  answer: string
}

type BooleanReply = {
  questionId: string
  answer: boolean
}

type DateReply = {
  questionId: string
  answer: string // Date in ISO format
}

type NumberReply = {
  questionId: string
  answer: number
}

type ListReply = {
  questionId: string
  values: Array<{
    id: string
    answer: string
  }>
}

type Reply = StringReply | BooleanReply | DateReply | NumberReply | ListReply

interface ELAnswer {
  replies: Reply[]
  isDraft: boolean
}

/**
 * Maps a QuestionnaireInput to the Health Directorate submission format
 */
export const mapToElAnswer = (input: QuestionnaireInput): ELAnswer => {
  const replies: Reply[] = input.entries.map((entry) => {
    const questionId = entry.entryID
    const answerValues = entry.answers.map((a) => a.values)

    // Handle multi-select / checkbox (ListReply)
    if (entry.type === AnswerOptionType.checkbox) {
      return {
        questionId,
        values: entry.answers.map((ans) => ({
          id: ans.values,
          answer: ans.label,
        })),
      } as ListReply
    }

    if (entry.type === AnswerOptionType.radio) {
      const firstAnswer = entry.answers[0]
      if (firstAnswer.values === 'true' || firstAnswer.values === 'false') {
        return {
          questionId,
          answer: firstAnswer.values === 'true',
        } as BooleanReply
      }
      return {
        questionId,
        values: [
          {
            id: firstAnswer.values,
            answer: firstAnswer.label || firstAnswer.values,
          },
        ],
      } as ListReply
    }

    // Handle date fields (DateReply)
    if (
      entry.type === AnswerOptionType.date ||
      entry.type === AnswerOptionType.datetime
    ) {
      return {
        questionId,
        answer: answerValues[0] || '', // Should be ISO date string
      } as DateReply
    }

    // Handle number fields (NumberReply)
    if (
      entry.type === AnswerOptionType.number ||
      entry.type === AnswerOptionType.scale ||
      entry.type === AnswerOptionType.thermometer
    ) {
      return {
        questionId,
        answer: parseFloat(answerValues[0]) || 0,
      } as NumberReply
    }

    // Handle boolean fields (BooleanReply)
    // Assuming boolean values are passed as string "true" or "false"
    const firstValue = answerValues[0]?.toLowerCase()
    if (firstValue === 'true' || firstValue === 'false') {
      return {
        questionId,
        answer: firstValue === 'true',
      } as BooleanReply
    }

    // Default to StringReply for text, textarea, etc.
    return {
      questionId,
      answer: answerValues[0] || '',
    } as StringReply
  })

  return {
    replies,
    isDraft: true,
  }
}
