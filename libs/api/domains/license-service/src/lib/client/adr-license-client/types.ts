export interface AdrLicense {
  id?: number
  kennitala?: string
  fulltNafn?: string
  skirteinisNumer?: number
  faedingarDagur?: string
  rikisfang?: string
  gildirTil?: string
  adrRettindi?: {
    flokkur?: string
    grunn?: boolean
    tankar?: boolean
    heiti?: {
      flokkur?: string
      heiti?: string
    }[]
  }[]
}
