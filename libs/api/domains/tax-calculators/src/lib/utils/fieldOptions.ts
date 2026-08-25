export const buildYearOptions = (years: number[]) =>
  years.map((year) => ({ value: String(year), label: String(year) }))

export const buildCountOptions = (max: number) =>
  Array.from({ length: max + 1 }, (_, count) => ({
    value: String(count),
    label: String(count),
  }))

const CURRENT_YEAR = new Date().getFullYear()

// The current year and the two years before it. `years[0]` becomes the
// field's default selection (see `CalculatorFieldInput` in the web slice,
// which defaults a SELECT field to its first option).
export const currentYearIncomeYearOptions = buildYearOptions([
  CURRENT_YEAR,
  CURRENT_YEAR - 1,
  CURRENT_YEAR - 2,
])

// Several benefits are calculated from the previous year's income, so the
// previous year is the sensible default.
export const previousYearIncomeYearOptions = buildYearOptions([
  CURRENT_YEAR - 1,
  CURRENT_YEAR,
  CURRENT_YEAR - 2,
])
