export interface GenericMachineLicenseResponse {
  id?: number
  kennitala?: string
  fulltNafn?: string
  skirteinisNumer?: number
  fyrstiUtgafuDagur?: number
  utgafuStadur?: string
  utgafuLand?: string
  okuskirteinisNumer?: string
  vinnuvelaRettindi?: {
    flokkur?: string
    stjorna?: string
    kenna?: string
    fulltHeiti?: string
    stuttHeiti?: string
  }[]
}
