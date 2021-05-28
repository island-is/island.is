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

// These two are similar - hopefully this all goes away with the
// opanapi generated client
export interface NewDrivingAssessmentDto {
  kennitala: string
  kennitalaOkukennara: string
  dagsetningMats: Date
}

export interface GetDrivingAssessmentResponse {
  kennitala: string
  kennitalaOkukennara: string
  dagsetningMats: Date
}

export interface EmbaettiDto {
  nr: number
  nafn: string
  postnumer: number
}

export interface NewDrivingLicenseDto {
  personIdNumber: string
  authorityNumber: number
  needsToPresentHealthCertificate: number
}

export type NewDrivingLicenseResponse = string | object | number
export type NewDrivingAssessmentResponse = void
