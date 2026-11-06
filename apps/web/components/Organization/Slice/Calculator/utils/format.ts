import type { Locale } from '@island.is/shared/types'
import { formatCurrency } from '@island.is/shared/utils'
import {
  TaxCalculatorOutputFieldSemantic,
  TaxCalculatorOutputFieldType,
} from '@island.is/web/graphql/schema'

import { LOCALE_TAG } from './optionSources'
import { CALCULATOR_MESSAGES, localized } from './text'

export interface FormattableValue {
  type: TaxCalculatorOutputFieldType
  numberValue?: number | null
  stringValue?: string | null
  booleanValue?: boolean | null
  dateValue?: Date | null
}

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
            value.booleanValue
              ? CALCULATOR_MESSAGES.yes
              : CALCULATOR_MESSAGES.no,
            locale,
          )

    case TaxCalculatorOutputFieldType.Date:
      return value.dateValue ? formatDate(value.dateValue, locale) : undefined

    case TaxCalculatorOutputFieldType.String:
      return value.stringValue ?? undefined

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
    case TaxCalculatorOutputFieldSemantic.Currency:
      return formatCurrency(Math.round(value))

    case TaxCalculatorOutputFieldSemantic.Percentage:
      return `${formatPlainNumber(value, locale)}%`

    case TaxCalculatorOutputFieldSemantic.Year:
    case TaxCalculatorOutputFieldSemantic.Month:
      return String(value)

    case TaxCalculatorOutputFieldSemantic.Count:
      return formatPlainNumber(value, locale)

    default:
      return formatPlainNumber(value, locale)
  }
}

const formatPlainNumber = (value: number, locale: Locale): string =>
  new Intl.NumberFormat(LOCALE_TAG[locale], {
    maximumFractionDigits: 2,
  }).format(value)

/* Apollo delivers `DateTime` as an ISO string despite the generated `Date`
 * type. Dates travel as UTC midnight, so formatting in local time would shift
 * the day back west of Greenwich. */
const formatDate = (value: Date, locale: Locale): string =>
  new Intl.DateTimeFormat(LOCALE_TAG[locale], {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(value))
