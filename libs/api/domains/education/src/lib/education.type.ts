export interface License {
  id: string
  school: string
  programme: string
  date: string
}

export interface ExamOverview {
  nationalId: string
  name: string
  isChild: boolean
  organizationType: string
  organizationName: string
  yearInterval: string
}

interface Grade {
  grade: string
  weight: string
}

interface BaseGrade {
  grade: string
  competence: string
  competenceStatus: string
  progressText: string
}

interface MathGrade extends BaseGrade {
  calculation: Grade
  geometry: Grade
  ratiosAndPercentages: Grade
  algebra: Grade
  wordAndNumbers: string
}

interface LanguageGrade extends BaseGrade {
  readingGrade: Grade
  grammarGrade: Grade
}

export interface ExamResult {
  id: string
  studentYear: string
  englishGrade?: LanguageGrade
  icelandicGrade?: LanguageGrade
  mathGrade?: MathGrade
}
