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
  grade?: string
  label: string
  weight?: number
}

interface GradeType {
  serialGrade: Grade
  elementaryGrade: Grade
}

interface BaseGrade {
  label: string
  grade: GradeType
  competence: string
  competenceStatus: string
  progressText: Grade
}

interface MathGrade extends BaseGrade {
  calculation: GradeType
  geometry: GradeType
  ratiosAndPercentages: GradeType
  algebra: GradeType
  numberComprehension: GradeType
  wordAndNumbers: Grade
}

interface LanguageGrade extends BaseGrade {
  reading: GradeType
  grammar: GradeType
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
