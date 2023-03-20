import { Case } from '../../types/interfaces'
import format from 'date-fns/format'

export function removeZeroInDate(date: string) {
  let updatedDate = date.replace('.0', '.')
  if (date.indexOf('0') == 0) {
    updatedDate = updatedDate.substring(1)
  }
  return updatedDate
}
export function getShortDate(date: string | Date, noYear?: boolean) {
  if (noYear) {
    return removeZeroInDate(format(new Date(date), 'dd.MM'))
  }
  return removeZeroInDate(format(new Date(date), 'dd.MM.yyyy'))
}

export function getDateBeginDateEnd(begin: string | Date, end: string | Date) {
  const beginDate = new Date(begin)
  const endDate = new Date(end)
  const sameYear = beginDate.getFullYear() == endDate.getFullYear()
  const sameMonth = beginDate.getMonth() == endDate.getMonth()
  const formatstring = `dd.${!sameMonth ? 'MM.' : ''}${!sameYear ? 'yyyy' : ''}`
  return `${removeZeroInDate(
    format(new Date(begin), formatstring),
  )} - ${removeZeroInDate(format(new Date(end), 'dd.MM.yyyy'))} `
}

export function getTimeLineDate(Case: Case) {
  switch (Case.statusName) {
    case 'Til umsagnar':
      return getDateBeginDateEnd(Case.processBegins, Case.processEnds)
    case 'Niðurstöður í vinnslu':
      return `frá ${getShortDate(Case.processEnds)}`
    case 'Niðurstöður birtar':
      return getShortDate(Case.summaryDate)
  }
}
