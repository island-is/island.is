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
  if (!date) return ''
  if (noYear) {
    return removeZeroInDate(format(new Date(date), 'dd.MM'))
  }
  return removeZeroInDate(format(new Date(date), 'dd.MM.yyyy'))
}

export function getDateBeginDateEnd(begin: string | Date, end: string | Date) {
  // u2013 is endash and u2014 is emdash
  const beginDate = new Date(begin)
  const endDate = new Date(end)
  const sameYear = beginDate.getFullYear() == endDate.getFullYear()
  const sameMonth = beginDate.getMonth() == endDate.getMonth()
  const formatstring = `dd.${!sameMonth ? 'MM.' : ''}${!sameYear ? 'yyyy' : ''}`
  return `${removeZeroInDate(
    format(new Date(begin), formatstring),
  )}\u2013${removeZeroInDate(format(new Date(end), 'dd.MM.yyyy'))} `
}

interface Props {
  Case: Case
}

export function getTimeLineDate({ Case }: Props) {
  switch (Case.statusName) {
    case 'Til umsagnar':
      return getDateBeginDateEnd(Case.processBegins, Case.processEnds)
    case 'Niðurstöður í vinnslu':
      return `frá ${getShortDate(Case.processEnds)}`
    case 'Niðurstöður birtar':
      return getShortDate(Case.summaryDate)
  }
}
export function getStatusEndDate(status: string, Case: Case) {
  const date = new Date(Case.processEnds)
  date.setDate(date.getDate() + 1)
  switch (status) {
    case 'Til umsagnar':
      return getDateBeginDateEnd(Case.processBegins, Case.processEnds)
    case 'Niðurstöður í vinnslu':
      return Case.statusName != 'Til umsagnar' ? `${getShortDate(date)}` : ''
    case 'Niðurstöður birtar':
      return getShortDate(Case.summaryDate)
  }
}

export function hasDatePassed(date: string | Date) {
  const dateFormatted = new Date(date)
  return dateFormatted < new Date()
}
