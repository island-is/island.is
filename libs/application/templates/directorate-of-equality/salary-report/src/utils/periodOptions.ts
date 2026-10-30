import { messages } from '../lib/messages'

const MONTHS = [
  { value: '1', label: messages.aboutTheCompany.period.january },
  { value: '2', label: messages.aboutTheCompany.period.february },
  { value: '3', label: messages.aboutTheCompany.period.march },
  { value: '4', label: messages.aboutTheCompany.period.april },
  { value: '5', label: messages.aboutTheCompany.period.may },
  { value: '6', label: messages.aboutTheCompany.period.june },
  { value: '7', label: messages.aboutTheCompany.period.july },
  { value: '8', label: messages.aboutTheCompany.period.august },
  { value: '9', label: messages.aboutTheCompany.period.september },
  { value: '10', label: messages.aboutTheCompany.period.october },
  { value: '11', label: messages.aboutTheCompany.period.november },
  { value: '12', label: messages.aboutTheCompany.period.december },
]

// The applicant may pick any of the last 12 *completed* months. The month in
// progress is excluded: the API rejects a `salaryDataPeriod` naming a month
// that hasn't happened yet, and a part-month payroll isn't comparable to the
// twelve-month average anyway. E.g. in August 2026 the window runs from
// August 2025 through July 2026.
const getSelectableMonths = (year: number, now: Date) => {
  const currentYear = now.getFullYear()
  const monthInProgress = now.getMonth() + 1

  // Everything before the month in progress is complete.
  if (year === currentYear) {
    return MONTHS.filter((month) => Number(month.value) < monthInProgress)
  }
  // The tail of last year that keeps the window at 12 months. In January
  // nothing of the current year is complete yet, so this is all 12.
  if (year === currentYear - 1) {
    return MONTHS.filter((month) => Number(month.value) >= monthInProgress)
  }
  return []
}

export const getSalaryPeriodYearOptions = () => {
  const now = new Date()
  const currentYear = now.getFullYear()
  // Drop a year with no completed months in the window — in January the
  // current year has none, and offering it would strand the month select
  // with an empty option list.
  return [currentYear, currentYear - 1]
    .filter((year) => getSelectableMonths(year, now).length > 0)
    .map((year) => ({ value: String(year), label: String(year) }))
}

export const getSalaryPeriodMonthOptions = (selectedYear?: string) =>
  getSelectableMonths(Number(selectedYear), new Date())
