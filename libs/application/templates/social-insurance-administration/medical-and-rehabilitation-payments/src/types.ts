export interface SelfAssessmentQuestionnaireQuestions {
  questionCode: string
  questionTitle: string
  explanationText: string
  question: string
  icfCode: string
}

export interface SelfAssessmentQuestionnaireScaleOption {
  value: number
  display: string
  order: number
}

export interface SelfAssessmentQuestionnaire {
  questionnaireName: string
  questionnaireCode: string
  versionNumber: string
  scale: SelfAssessmentQuestionnaireScaleOption[]
  questions: SelfAssessmentQuestionnaireQuestions[]
  language: string
}

export interface SelfAssessmentQuestionnaireAnswers {
  answer: string
  questionId: string
}

export interface EctsUnits {
  description: string
  value: string
}

export interface Countries {
  country: string
  nationalId: string
}

export interface EducationLevels {
  code: string
  description: string
}

export interface CurrentEmploymentStatus {
  displayName: string
  value: string
}

export interface CurrentEmploymentStatusLang {
  languageCode: string
  employmentStatuses: CurrentEmploymentStatus[]
}
