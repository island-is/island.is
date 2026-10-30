import type { Locale } from '@island.is/shared/types'

/* Matches the first year offered by RSK's withholding calculator. */
const EARLIEST_INCOME_YEAR = 2004

export const LOCALE_TAG: Record<Locale, string> = {
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

export const monthOptions = (locale: Locale): CalculatorOption[] => {
  const format = new Intl.DateTimeFormat(LOCALE_TAG[locale], {
    month: 'long',
    timeZone: 'UTC',
  })

  return Array.from({ length: 12 }, (_, index) => ({
    label: format.format(new Date(Date.UTC(2024, index, 1))),
    value: String(index + 1),
  }))
}
