export const getNameAbbreviation = (name: string) => {
  const names = name.split(' ')
  let initials = names[0].substring(0, 1).toUpperCase()

  if (names.length > 1)
    initials += names[names.length - 1].substring(0, 1).toUpperCase()

  return initials
}

export const formatNationalId = (nationalId: string): string => {
  if (nationalId?.length === 10) {
    return `${nationalId.slice(0, 6)}-${nationalId.slice(6)}`
  } else {
    return nationalId
  }
}

export const tableStyles = {
  padding: '16px',
}
type DrivingLicenseSuspended = {
  /* ANY because response was null */
  dagsFra?: any
  dagsTil?: any
  skirteiniGlatad?: any
  tegundSviptingarHeiti?: any
  tegundSviptinar?: any
  skirteiniUrGildi?: any
  endurupptakaSkirteinis?: any
}

type DrivingLicenseCategoryType = {
  id: number
  nr: string
  utgafuDags: string
  gildirTil: string
  aths: string
}

export type DrivingLicenseType = {
  id: number
  nafn: string
  kennitala: string
  faedingarstadur: string
  faedingarStadurHeiti: string
  utgafuDagsetning: string
  gildirTil: string
  nrUtgafustadur: string
  nafnUtgafustadur: string
  rettindi: Array<DrivingLicenseCategoryType>
  athugasemdir?: []
  mynd: string
  undirskrift: string
  svipting: Array<DrivingLicenseSuspended>
}

export type MachineLicenseCategoryType = {
  flokkur?: string
  stjorna: string
  kenna?: string
  fulltHeiti?: string
  stuttHeiti?: string
}

export type MachineLicenseType = {
  id?: number
  kennitala?: string
  fulltNafn?: string
  skirteinisNumer?: number
  fyrstiUtgafuDagur?: string
  utgafuStadur?: string
  utgafuLand?: string
  okuskirteinisNumer?: number
  vinnuvelaRettindi?: Array<MachineLicenseCategoryType>
}

export type AdrLicenseCategoryType = {
  flokkur?: number
  grunn?: boolean
  tankar?: boolean
  heiti?: string
}

export type AdrLicenseType = {
  id?: number
  kennitala?: string
  fulltNafn?: string
  skirteinisNumer?: number
  faedingardagur?: string
  rikisfang?: string
  gildirTil?: string
  adrRettindi?: Array<AdrLicenseCategoryType>
}
