export interface SelfAssessmentQuestionnaireQuestions {
  icfCode: string
  title: string
  description: string
  questionCode: string
}

export interface SelfAssessmentQuestionnaire {
  scaleMax: number
  scaleMin: number
  questions: SelfAssessmentQuestionnaireQuestions[]
  versionNumber: string
  questionnaireCode: string
  questionnaireName: string
}

export interface SelfAssessmentQuestionnaireAnswers {
  answer: string
  questionId: string
}
