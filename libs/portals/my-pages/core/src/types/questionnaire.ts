import { QuestionnaireAnswerOptionType } from '@island.is/api/schema'

// Answer storage interface
export interface QuestionAnswer {
  questionId: string
  answers: Array<{
    label?: string | undefined
    values: string
  }>
  type: QuestionnaireAnswerOptionType
}
