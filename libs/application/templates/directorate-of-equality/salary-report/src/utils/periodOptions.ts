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

// The applicant may pick any month within the last 12 months (inclusive of
// the current month) — e.g. if today is August 2026, the earliest selectable
// month is August 2025.
export const getSalaryPeriodYearOptions = () => {
  const currentYear = new Date().getFullYear()
  return [
    { value: String(currentYear), label: String(currentYear) },
    { value: String(currentYear - 1), label: String(currentYear - 1) },
  ]
}

export const getSalaryPeriodMonthOptions = (selectedYear?: string) => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  const year = Number(selectedYear)

  if (year === currentYear) {
    return MONTHS.filter((month) => Number(month.value) <= currentMonth)
  }
  if (year === currentYear - 1) {
    return MONTHS.filter((month) => Number(month.value) >= currentMonth)
  }
  return []
}
