export interface AdrLicense {
  id?: number
  kennitala?: string | null
  fulltNafn?: string | null
  skirteinisNumer?: string | null
  faedingarDagur?: string | null
  rikisfang?: string | null
  gildirTil?: string | null
  adrRettindi?:
    | {
        flokkur?: string | null
        grunn?: boolean
        tankar?: boolean
        heiti?:
          | {
              flokkur?: string | null
              heiti?: string | null
            }[]
          | null
      }[]
    | null
}

export interface MachineLicense {
  id?: number
  kennitala?: string | null
  fulltNafn?: string | null
  skirteinisNumer?: string | null
  fyrstiUtgafuDagur?: string | null
  utgafuStadur?: string | null
  utgafuLand?: string | null
  okuskirteinisNumer?: string | null
  vinnuvelaRettindi?:
    | {
        flokkur?: string | null
        stjorna?: string | null
        kenna?: string | null
        fulltHeiti?: string | null
        stuttHeiti?: string | null
      }[]
    | null
}
