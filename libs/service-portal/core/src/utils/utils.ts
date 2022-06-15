import { User } from '@island.is/shared/types'

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

export const checkDelegation = (user: User) => {
  return Boolean(user?.profile.actor)
}
