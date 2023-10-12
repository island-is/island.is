import { Case } from '../../types/interfaces'
import format from 'date-fns/format'
import { CaseStatuses } from '../../types/enums'

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
    case CaseStatuses.forReview:
      return getDateBeginDateEnd(Case.processBegins, Case.processEnds)
    case CaseStatuses.inProgress:
      return `frá ${getShortDate(Case.processEnds)}`
    case CaseStatuses.published:
      return getShortDate(Case.summaryDate)
  }
}
export function getStatusEndDate(status: string, Case: Case) {
  const forReviewBegins = new Date(Case.processEnds)
  forReviewBegins.setDate(forReviewBegins.getDate() + 1)
  const forReviewEnds = new Date(Case.summaryDate)
  forReviewEnds.setDate(forReviewEnds.getDate() - 1)

  switch (status) {
    case CaseStatuses.forReview:
      return getDateBeginDateEnd(Case.processBegins, Case.processEnds)
    case CaseStatuses.inProgress:
      return Case.statusName !== CaseStatuses.forReview
        ? Case.statusName === CaseStatuses.inProgress
          ? `${getShortDate(forReviewBegins)}\u2013`
          : getDateBeginDateEnd(forReviewBegins, forReviewEnds)
        : ``
    case CaseStatuses.published:
      return getShortDate(Case.summaryDate)
  }
}

export function hasDatePassed(date: string | Date) {
  const dateFormatted = new Date(date)
  return dateFormatted < new Date()
}

export function getDateForComparison(date: Date | string) {
  try {
    return new Date(date).getTime()
  } catch (e) {
    console.error(e)
    return null
  }
}
