export interface EducationLicense {
  id: string
  school: string
  programme: string
  date: string
}

export interface ExamFamilyOverview {
  nationalId: string
  name: string
  isChild: boolean
  organizationType: string
  organizationName: string
  yearInterval: string
}

interface Grade {
  grade: string
  weight?: string
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
  numberComprehension: Grade
  wordAndNumbers: string
}

interface LanguageGrade extends BaseGrade {
  reading: Grade
  grammar: Grade
}

interface GradeResult {
  studentYear: string
  englishGrade?: LanguageGrade
  icelandicGrade?: LanguageGrade
  mathGrade?: MathGrade
}

export interface ExamResult {
  id: string
  fullName: string
  grades: GradeResult[]
}
