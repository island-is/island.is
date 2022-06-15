export interface GenericAdrLicenseResponse {
  id?: number
  kennitala?: string
  fulltNafn?: string
  skirteinisNumber?: number
  faedingardagur?: string
  rikisfang?: string
  gildirTil?: string
  adrRettindi?: {
    flokkur?: number
    grunn?: boolean
    tankar?: boolean
  }[]
}
