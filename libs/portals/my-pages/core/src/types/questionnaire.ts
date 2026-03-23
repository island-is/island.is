import { QuestionnaireAnswerOptionType } from '@island.is/api/schema'

// Answer storage interface
export interface QuestionAnswer {
  questionId: string
  question: string
  answers: Array<{
    label?: string | undefined
    value: string
  }>
  type: QuestionnaireAnswerOptionType
}
