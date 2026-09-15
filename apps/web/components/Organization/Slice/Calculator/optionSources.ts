import type { Locale } from '@island.is/shared/types'

/* Year and month fields carry no `options` of their own: the client's `year()`
 * and `month()` markers are deliberately unbounded, because RSK's spec asserts
 * no range. The lists below are transcribed from RSK's own withholding form and
 * applied to every calculator, so the floor is a guess for the others. */
const EARLIEST_INCOME_YEAR = 2004

const LOCALE_TAG: Record<Locale, string> = {
  is: 'is-IS',
  en: 'en-GB',
}

export interface CalculatorOption {
  label: string
  value: string
}

export const yearOptions = (): CalculatorOption[] => {
  const currentYear = new Date().getFullYear()
  const years: CalculatorOption[] = []

  for (let year = currentYear; year >= EARLIEST_INCOME_YEAR; year--) {
    years.push({ label: String(year), value: String(year) })
  }

  return years
}

/* Values are 1-based. RSK documents neither convention, so this is unverified
 * and only matters once a calculation is actually submitted. */
export const monthOptions = (locale: Locale): CalculatorOption[] => {
  const format = new Intl.DateTimeFormat(LOCALE_TAG[locale], { month: 'long' })

  return Array.from({ length: 12 }, (_, index) => ({
    label: format.format(new Date(Date.UTC(2024, index, 1))),
    value: String(index + 1),
  }))
}
