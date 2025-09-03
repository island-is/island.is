// GraphQL-based interfaces for dynamic questionnaire rendering

export interface HealthQuestionnaireAnswerOption {
  id: string
  label: string
  type: string
  value: {
    extraQuestions?: HealthQuestionnaireQuestion[]
  }
}

export interface HealthQuestionnaireQuestion {
  __typename: string
  id: string
  label: string
  sublabel?: string
  display: string
  maxLabel?: string // For thermometer and scale questions
  minLabel?: string // For thermometer and scale questions
  answerOptions?: HealthQuestionnaireAnswerOption[]
  min?: number // For number questions
  max?: number // For number questions
  step?: number // For number questions
  unit?: string // For number questions (e.g., "cm", "kg")
  dependsOn?: string[] // Questions this question depends on
  visibilityCondition?: string // Condition for when this question should be visible
}

export interface HealthQuestionnaire {
  __typename: string
  org: string
  id: string
  title: string
  guid: string
  description: string
  questions: HealthQuestionnaireQuestion[]
}

export interface QuestionnaireResponse {
  healthQuestionnaires: HealthQuestionnaire[]
}

// Answer storage interface
export interface QuestionAnswer {
  questionId: string
  value: string | string[] | number
  extraAnswers?: { [key: string]: QuestionAnswer }
}
