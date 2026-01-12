import { theme } from '@island.is/island-ui/theme'
import get from 'lodash/get'

export { formatNationalId } from '@island.is/portals/core'

export const getNameAbbreviation = (name: string) => {
  const names = name.split(' ')
  let initials = names[0].substring(0, 1).toUpperCase()

  if (names.length > 1)
    initials += names[names.length - 1].substring(0, 1).toUpperCase()

  return initials
}

export const sanitizeSheetName = (
  sheetName: string,
  uncapNameLength?: boolean,
) => {
  const name = sheetName.replace(/[:\\/?*[\]]/g, '_').trim()

  return uncapNameLength ? name : name.substring(0, 31) // Max length for a sheet name.
}

export const tableStyles = {
  padding: '16px',
}
export const headingTableStyles = {
  background: theme.color.blue100,
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

export type ExcludesFalse = <T>(
  x: T | null | undefined | false | '' | 0,
) => x is T

export type RecordObject<T = unknown> = Record<string, T>

export function getErrorViaPath(obj: RecordObject, path: string): string {
  return get(obj, path) as string
}

export const ellipsis = (text: string, length: number) => {
  return text.length > length ? `${text.substring(0, length)}...` : text
}
