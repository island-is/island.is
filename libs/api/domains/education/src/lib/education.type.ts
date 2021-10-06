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
  familyIndex: number
}

interface Grade {
  grade?: string
  label: string
  weight?: number
}

interface GradeType {
  label: string
  serialGrade?: Grade
  elementaryGrade?: Grade
}

interface CourseGrade {
  label: string
  gradeSum?: GradeType
  competence: string
  competenceStatus: string
  progressText?: Grade
  grades: GradeType[]
  wordAndNumbers?: Grade
}

interface GradeResult {
  studentYear: string
  courses: CourseGrade[]
}

export interface ExamResult {
  id: string
  fullName: string
  grades: GradeResult[]
}
