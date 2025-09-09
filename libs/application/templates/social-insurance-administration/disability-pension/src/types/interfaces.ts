export interface EducationLevels {
  code: string
  description: string
}

export interface MaritalStatus {
  value: number
  label: string
}

export interface Residence {
  value: number
  label: string
}

export interface EmploymentStatusResponse {
  languageCode: string
  employmentStatuses: EmploymentStatus[]
}

export interface EmploymentStatus {
  value: number
  displayName: string
}

export interface Country {
  code: string
  name: string
  nameIcelandic: string
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

export interface SelfAssessmentQuestion {
  questionCode: string
  questionTitle: string
  explanationText: string
  question: string
  icfCode: string
}
