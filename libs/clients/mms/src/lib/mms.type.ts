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
  radeinkunn: string
  vaegi?: string
}

export interface BaseGrade {
  dagsetning: string
  haefnieinkunn: string
  haefnieinkunnStada: string
  framfaraTexti: string
  samtals: GradeResult
}

export interface MathGrade extends BaseGrade {
  reikningurOgAdgerdir: GradeResult
  rumfraedi: GradeResult
  algebra: GradeResult
  hlutfollOgProsentur: GradeResult
  tolurOgTalnaskilningur: GradeResult
  ordOgTalnadaemi: string
}

export interface LanguageGrade extends BaseGrade {
  lesskilningur: GradeResult
  malnotkun: GradeResult
}

interface Grade {
  bekkur: string
  enska?: LanguageGrade
  islenska?: LanguageGrade
  staerdfraedi?: MathGrade
}

export interface StudentAssessmentResponse {
  einkunnir: Grade[]
}
