export interface GenericAdrLicenseResponse {
  id?: number
  kennitala?: string
  fulltNafn?: string
  skirteinisNumer?: number
  faedingarDagur?: string
  rikisfang?: string
  gildirTil?: string
  adrRettindi?: {
    flokkur?: number
    grunn?: boolean
    tankar?: boolean
    heiti?: {
      flokkur?: number
      heiti?: string
    }[]
  }[]
}
