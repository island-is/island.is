import { YesOrNo } from '@island.is/application/core'

export interface EducationLevels {
  code: string
  description: string
}

export interface Country {
  country: string
  abroadNationalId: string
}

export interface MaritalStatus {
  value: number
  label: string
}

export interface PreviousEmployment {
  hasEmployment: YesOrNo
  when: number
  job: string
  field: string
}

export interface SelfAssessmentQuestionnaireAnswers {
  answer: number
  id: string
}

export interface LivedAbroad {
  country: string
  abroadNationalId?: string
  periodStart: string
  periodEnd: string
}

export interface Residence {
  value: number
  label: string
}

export interface EmploymentStatusResponse {
  languageCode: string
  employmentStatuses: EmploymentStatusItem[]
}

export interface EmploymentStatusItem {
  value: number
  displayName: string
}

export interface Language {
  code: string
  nameEn: string
  nameIs: string
}

export interface SelfAssessmentQuestionnaire {
  questionnaireName: string
  questionnaireCode: string
  versionNumber: string
  scale: Array<{
    value: number
    display: string
    order: number
  }>
  questions: SelfAssessmentQuestion[]
  language: string
}

export interface CountryValue {
  label: string
  value: string
}

export interface SelfAssessmentQuestion {
  questionCode: string
  questionTitle: string
  explanationText: string
  question: string
  icfCode: string
}
