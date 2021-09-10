export interface LicenseResponse {
  id: string
  issued: string
  nationalId: string
  type: string
  fullName: string
  dokobitToken: string | null
  issuer: string
  country: string
  created: string
  modified: string
}

export interface GradeResult {
  einkunn?: string
  heiti: string
  vaegi?: number
}

export interface GradeTypeResult {
  heiti: string
  radeinkunn?: GradeResult
  grunnskolaeinkunn?: GradeResult
}

export interface Grade {
  heiti: string
  dagsetning: string
  haefnieinkunn: string
  haefnieinkunnStada: string
  samtals?: GradeTypeResult
  framfaraTexti?: GradeResult
  einkunnir: GradeTypeResult[]
  ordOgTalnadaemi?: GradeResult
}

export interface CourseGrade {
  bekkur: string
  namsgreinar: Grade[]
}

export interface StudentAssessmentResponse {
  einkunnir: CourseGrade[]
}
