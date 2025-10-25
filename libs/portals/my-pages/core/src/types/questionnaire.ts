import { QuestionnaireAnswerOptionType } from '@island.is/api/schema'

// Answer storage interface
export interface QuestionAnswer {
  questionId: string
  value: string | string[] | number
  type: QuestionnaireAnswerOptionType
}
