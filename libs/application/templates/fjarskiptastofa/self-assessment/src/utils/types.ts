import { AssessmentAnswer } from './constants'

// Mirrors QuestionCategoryResponse from the Fjarskiptastofa client.
export interface AssessmentCategory {
  id: number
  label: string
  shortLabel: string
}

// Mirrors QuestionResponse from the Fjarskiptastofa client.
export interface AssessmentQuestion {
  id: number
  categoryId: number
  questionText: string
  tooltip: string
}

// Shape stored in externalData by the questions data provider.
export interface AssessmentQuestionsData {
  categories: AssessmentCategory[]
  questions: AssessmentQuestion[]
}

// A single stored answer, keyed by question id in the application answers.
export interface AssessmentAnswerValue {
  answerValue: AssessmentAnswer
  remark?: string
}

export type AssessmentAnswers = Record<string, AssessmentAnswerValue>

// Mirrors AnswerCategoryScore from the Fjarskiptastofa client.
export interface AssessmentCategoryScore {
  categoryId: number
  score: number
}

// Mirrors AnswersResponse from the Fjarskiptastofa client: the preliminary
// scoring returned when the self-assessment is submitted.
export interface SelfAssessmentResult {
  averageOverallScore: number
  categoryScores: AssessmentCategoryScore[]
}
