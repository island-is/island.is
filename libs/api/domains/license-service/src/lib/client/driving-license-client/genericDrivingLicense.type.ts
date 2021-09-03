export interface GenericDrivingLicenseResponse {
  id?: number
  nafn?: string
  kennitala?: string
  faedingarstadur?: string
  faedingarStadurHeiti?: string
  utgafuDagsetning?: string
  gildirTil?: string
  nrUtgafustadur?: number
  nafnUtgafustadur?: string
  erBradabirgda?: boolean
  rettindi?: {
    id?: number
    nr?: string
    utgafuDags?: string
    gildirTil?: string
    aths?: string
  }[]
  athugasemdir?: {
    id?: number
    nr?: string
    athugasemd?: string
  }[]
  myndId?: number
  undirskriftId?: number
  mynd?: {
    id?: number
    kennitala?: string
    skrad?: string
    mynd?: string
    gaedi?: number
    forrit?: number
    tegund?: number
  }
  undirskrift?: {
    id?: number
    kennitala?: string
    skrad?: string
    mynd?: string
    gaedi?: number
    forrit?: number
    tegund?: number
  } | null
  svipting?: {
    dagsFra?: string | null
    dagsTil?: string | null
    skirteiniGlatad?: number | null
    tegundSviptingarHeiti?: string | null
    tegundSviptingar?: number | null
    skirteiniUrGildi?: number | null
    endurupptakaSkirteinis?: number | null
  }
}

export interface PkPassServiceTokenResponse {
  status?: number
  message?: string
  data?: {
    ACCESS_TOKEN: string
    GENERATED_ON: {
      date: string
      timezone_type: number
      timezone: string
    }
    EXPIRED_ON: string
  }
}

export interface PkPassServiceDriversLicenseResponse {
  message: string
  data?: {
    pass_url: string
    pass_qrcode: string
  }
  status: number
}

export interface PkPassServiceErrorResponse {
  message?: string
  status?: number
  data?: unknown
}

export interface PkPassServiceVerifyDriversLicenseResponse {
  message: string
  data?: {
    kennitala?: string
  }
  status: number
}

export interface PkPassVerifyError {
  statusCode: number
  serviceError?: PkPassServiceErrorResponse
}

export interface PkPassVerifyResult {
  valid: boolean
  error?: PkPassVerifyError
  nationalId?: string
}
