export interface DrivingLicenseResponse {
  id: number
  nafn: string
  kennitala: string
  faedingarstadur: string
  faedingarStadurHeiti: string
  utgafuDagsetning: string
  gildirTil: string
  nrUtgafustadur: number
  nafnUtgafustadur: string
  erBradabirgda: boolean
  rettindi: {
    id: number
    nr: string
    utgafuDags: string
    gildirTil: string
    aths: string
  }[]
  athugasemdir: {
    id: number
    nr: string
    athugasemd: string
  }[]
  myndId?: number
  undirskriftId?: number
  mynd: {
    id: number
    kennitala: string
    skrad: string
    mynd: string
    gaedi: number
    forrit: number
    tegund: number
  }
  undirskrift: {
    id: number
    kennitala: string
    skrad: string
    mynd: string
    gaedi: number
    forrit: number
    tegund: number
  } | null
  svipting: {
    dagsFra: string | null
    dagsTil: string | null
    skirteiniGlatad: number | null
    tegundSviptingarHeiti: string | null
    tegundSviptingar: number | null
    skirteiniUrGildi: number | null
    endurupptakaSkirteinis: number | null
  }
}

export interface DeprivationTypesResponse {
  id: number
  heiti: string
}

export interface EntitlementTypesResponse {
  nr: string
  heiti: string
}

export interface RemarkTypesResponse {
  nr: string
  heiti: string
  giltFyrir: string
  athugasemd: boolean
  lysing: string
}

export interface PenaltyPointStatusResponse {
  iLagi: boolean
}

export interface TeachingRightsResponse {
  value: number
}

export interface FinishedSchoolResponse {
  hefurLokidOkugerdi: number
}

export interface CanApplyForResponse {
  value: number
}

export interface DrivingAssessmentDto {
  kennitala: string
  kennitalaOkukennara: string
  dagsetningMats: Date
}

// TODO: these two are the same - should be refactored into containing rather than extending
export interface GetDrivingAssessmentResponse extends DrivingAssessmentDto {}

export interface NewDrivingAssessmentInput extends DrivingAssessmentDto {}

export interface NewDrivingAssessmentResponse {
  ok: boolean
}

export interface EmbaettiDto {
  nr: number
  nafn: string
  postnumer: number
}

export interface NewDrivingLicenseInput {
  personIdNumber: string
  authorityNumber: number
  needsToPresentHealthCertificate: number
}

export type NewDrivingLicenseResponse = string | object | number
