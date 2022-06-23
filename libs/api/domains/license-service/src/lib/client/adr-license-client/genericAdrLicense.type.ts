export interface FlattenedAdrDto {
  kennitala?: string | null
  fulltNafn?: string | null
  skirteinisNumer?: string | null
  faedingarDagur?: string | null
  rikisfang?: string | null
  gildirTil?: string | null
  adrRettindi?:
    | {
        flokkur?: string | null
        grunn?: boolean | null
        tankar?: boolean | null
        heiti?: string | null
      }[]
    | null
}
