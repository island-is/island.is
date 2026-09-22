import { formatCurrency } from '@island.is/shared/utils'
import type { Locale } from '@island.is/shared/types'
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
      return value.stringValue
        ? formatDate(value.stringValue, locale)
        : undefined

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

/* Split rather than handed to `new Date(...)`, which reads `yyyy-MM-dd` as UTC
 * midnight and shifts the day back west of Greenwich. */
const formatDate = (value: string, locale: Locale): string => {
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return value

  return new Intl.DateTimeFormat(LOCALE_TAG[locale], {
    dateStyle: 'medium',
  }).format(new Date(year, month - 1, day))
}
