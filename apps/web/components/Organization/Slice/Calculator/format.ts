import { formatCurrency } from '@island.is/shared/utils'
import type { Locale } from '@island.is/shared/types'
import {
  TaxCalculatorOutputFieldSemantic,
  TaxCalculatorOutputFieldType,
} from '@island.is/web/graphql/schema'

import { LOCALE_TAG } from './optionSources'
import { CHROME_TEXT, localized } from './text'

/* The payload half of an output value, shared by a top-level value and by one
 * inside an array row -- the two differ only in their `__typename` and in the
 * top-level one's `arrayValue`, which is unwrapped before anything reaches
 * here. Declared structurally so both fit without a cast. */
export interface FormattableValue {
  type: TaxCalculatorOutputFieldType
  numberValue?: number | null
  stringValue?: string | null
  booleanValue?: boolean | null
}

/* Formatting derives from output metadata, not from config: the editor places
 * and labels a value, the contract says what it means. Returns undefined when
 * the payload the `type` points at is absent, which is how a row RSK returned
 * nothing for gets omitted rather than rendered blank. */
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

    /* `ARRAY` is in the enum because one type covers both levels, but a row's
     * values never nest -- so it is unreachable here rather than unhandled. */
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
    /* RSK returns whole ISK, so the flooring `formatCurrency` does by grouping
     * the integer part loses nothing. ` kr.` in both locales: the currency is
     * Icelandic whichever language the page is in. */
    case TaxCalculatorOutputFieldSemantic.Currency:
      return formatCurrency(Math.round(value))

    /* Whole percent by contract, in both directions -- the client's mappers
     * convert to and from RSK's 0-1 ratio, so nothing here scales. */
    case TaxCalculatorOutputFieldSemantic.Percentage:
      return `${formatPlainNumber(value, locale)}%`

    /* A year is an identifier, not a quantity: grouped, `2024` would read
     * `2.024`. */
    case TaxCalculatorOutputFieldSemantic.Year:
    case TaxCalculatorOutputFieldSemantic.Month:
      return String(value)

    case TaxCalculatorOutputFieldSemantic.Count:
      return formatPlainNumber(value, locale)

    /* Not closed with a `never` guard, unlike the switches above: a number
     * output carrying no semantic at all is a real case, not an unhandled one. */
    default:
      return formatPlainNumber(value, locale)
  }
}

const formatPlainNumber = (value: number, locale: Locale): string =>
  new Intl.NumberFormat(LOCALE_TAG[locale], {
    maximumFractionDigits: 2,
  }).format(value)

/* The contract states `yyyy-MM-dd`, so the string is split rather than handed
 * to `new Date(...)`, which would read it as UTC midnight and shift the day
 * backwards for any viewer west of Greenwich. */
const formatDate = (value: string, locale: Locale): string => {
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return value

  return new Intl.DateTimeFormat(LOCALE_TAG[locale], {
    dateStyle: 'medium',
  }).format(new Date(year, month - 1, day))
}
