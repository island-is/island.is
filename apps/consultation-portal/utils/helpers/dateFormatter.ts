import format from 'date-fns/format'

export function getShortDate(date: string | Date, noYear?: boolean) {
  if (noYear) {
    return format(new Date(date), 'dd.MM')
  }
  return format(new Date(date), 'dd.MM.yyyy')
}

export function getDateBeginDateEnd(begin: string | Date, end: string | Date) {
  const beginDate = new Date(begin)
  const endDate = new Date(end)
  const sameYear = beginDate.getFullYear() == endDate.getFullYear()
  const sameMonth = beginDate.getMonth() == endDate.getMonth()
  const formatstring = `dd.${!sameMonth ? 'MM.' : ''}${!sameYear ? 'yyyy' : ''}`
  return `${format(new Date(begin), formatstring)} - ${format(
    new Date(end),
    'dd.MM.yyyy',
  )} `
}
