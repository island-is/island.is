import { formatCurrency } from '@island.is/shared/utils'
import type { Locale } from '@island.is/shared/types'
import {
  TaxCalculatorOutputFieldSemantic,
  TaxCalculatorOutputFieldType,
} from '@island.is/web/graphql/schema'

import { LOCALE_TAG } from './optionSources'
import { CHROME_TEXT, localized } from './text'

/* Shared by a top-level value and one inside an array row; declared
 * structurally so both fit without a cast. */
export interface FormattableValue {
  type: TaxCalculatorOutputFieldType
  numberValue?: number | null
  stringValue?: string | null
  booleanValue?: boolean | null
}

/* Derived from output metadata, not config: the editor places and labels a
 * value, the contract says what it means. */
export const formatOutputValue = (
  value: FormattableValue,
  semantic: TaxCalculatorOutputFieldSemantic | undefined,
  locale: Locale,
): string | undefined => {
  switch (value.type) {
    case TaxCalculatorOutputFieldType.Number:
      return value.numberValue === null || value.numberValue === undefined
        ? undefined
        : formatNumber(value.numberValue, semantic, locale)

    case TaxCalculatorOutputFieldType.Boolean:
      return value.booleanValue === null || value.booleanValue === undefined
        ? undefined
        : localized(
            value.booleanValue ? CHROME_TEXT.yes : CHROME_TEXT.no,
            locale,
          )

    case TaxCalculatorOutputFieldType.Date:
      return value.stringValue
        ? formatDate(value.stringValue, locale)
        : undefined

    case TaxCalculatorOutputFieldType.String:
      return value.stringValue ?? undefined

    /* One enum covers both levels, but a row's values never nest. */
    case TaxCalculatorOutputFieldType.Array:
      return undefined

    default: {
      const unhandled: never = value.type
      return unhandled
    }
  }
}

const formatNumber = (
  value: number,
  semantic: TaxCalculatorOutputFieldSemantic | undefined,
  locale: Locale,
): string => {
  switch (semantic) {
    /* ` kr.` in both locales: the currency is Icelandic whichever language the
     * page is in. */
    case TaxCalculatorOutputFieldSemantic.Currency:
      return formatCurrency(Math.round(value))

    /* Whole percent by contract -- the client's mappers already converted from
     * RSK's 0-1 ratio. */
    case TaxCalculatorOutputFieldSemantic.Percentage:
      return `${formatPlainNumber(value, locale)}%`

    /* Grouped, `2024` would read `2.024`. */
    case TaxCalculatorOutputFieldSemantic.Year:
    case TaxCalculatorOutputFieldSemantic.Month:
      return String(value)

    case TaxCalculatorOutputFieldSemantic.Count:
      return formatPlainNumber(value, locale)

    /* No `never` guard: a number output with no semantic is a real case. */
    default:
      return formatPlainNumber(value, locale)
  }
}

const formatPlainNumber = (value: number, locale: Locale): string =>
  new Intl.NumberFormat(LOCALE_TAG[locale], {
    maximumFractionDigits: 2,
  }).format(value)

/* Split rather than handed to `new Date(...)`, which reads `yyyy-MM-dd` as UTC
 * midnight and shifts the day back west of Greenwich. */
const formatDate = (value: string, locale: Locale): string => {
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return value

  return new Intl.DateTimeFormat(LOCALE_TAG[locale], {
    dateStyle: 'medium',
  }).format(new Date(year, month - 1, day))
}
