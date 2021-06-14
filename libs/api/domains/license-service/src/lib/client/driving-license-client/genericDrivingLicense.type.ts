// Copied from DrivingLicenseResponse and all fields set as optional,
// since you never know with 3rd party APIs...
// TODO move to a shared type?
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
