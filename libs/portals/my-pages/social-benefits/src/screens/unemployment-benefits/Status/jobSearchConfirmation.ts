import { Locale } from '@island.is/shared/types'

export const getJobSearchConfirmationDateRange = (locale: Locale): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getDate() > 25 ? now.getMonth() + 1 : now.getMonth()
  const start = new Date(year, month, 20)
  const end = new Date(year, month, 25)

  const dateLocale = locale === 'is' ? 'is-IS' : 'en-GB'
  const fmt = (d: Date) =>
    `${d.getDate()}.${d.toLocaleString(dateLocale, { month: 'short' })}`

  return `${fmt(start)}-${fmt(end)}`
}
