export interface SelfAssessmentQuestionnaireQuestions {
  icfCode: string
  questionTitle: string
  question: string
  questionCode: string
}

export interface SelfAssessmentQuestionnaire {
  scaleMax: number
  scaleMin: number
  questions: SelfAssessmentQuestionnaireQuestions[]
  versionNumber: string
  questionnaireCode: string
  questionnaireName: string
  language: string
}

export interface SelfAssessmentQuestionnaireAnswers {
  answer: string
  questionId: string
}
