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
  radeinkunn: GradeResult
  grunnskolaeinkunn: GradeResult
}

export interface BaseGrade {
  heiti: string
  dagsetning: string
  haefnieinkunn: string
  haefnieinkunnStada: string
  samtals: GradeTypeResult
  framfaraTexti: GradeResult
}

export interface MathGrade extends BaseGrade {
  reikningurOgAdgerdir: GradeTypeResult
  rumfraedi: GradeTypeResult
  algebra: GradeTypeResult
  hlutfollOgProsentur: GradeTypeResult
  tolurOgTalnaskilningur: GradeTypeResult
  ordOgTalnadaemi: GradeResult
}

export interface LanguageGrade extends BaseGrade {
  lesskilningur: GradeTypeResult
  malnotkun: GradeTypeResult
}

export interface Grade {
  bekkur: string
  enska?: LanguageGrade
  islenska?: LanguageGrade
  staerdfraedi?: MathGrade
}

export interface StudentAssessmentResponse {
  einkunnir: Grade[]
}
