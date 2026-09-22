import type { Locale } from '@island.is/shared/types'
import type { CalculatorLocalizedText } from '@island.is/tax-calculators'

export const CHROME_TEXT = {
  submit: { is: 'Reikna', en: 'Calculate' },
  loadError: {
    is: 'Ekki tókst að sækja reiknivélina',
    en: 'Could not load the calculator',
  },
  calculationError: {
    is: 'Ekki tókst að reikna',
    en: 'The calculation could not be completed',
  },
  emptyResult: {
    is: 'Engin niðurstaða fannst fyrir þessar forsendur',
    en: 'No result was found for these values',
  },
  invalidValue: { is: 'Ógilt gildi', en: 'Invalid value' },
  yes: { is: 'Já', en: 'Yes' },
  no: { is: 'Nei', en: 'No' },
} satisfies Record<string, CalculatorLocalizedText>

export interface CalculatorLabelledRow {
  key: string
  label?: CalculatorLocalizedText
}

export const localized = (
  value: CalculatorLocalizedText | undefined,
  locale: Locale,
): string | undefined => {
  if (!value) return undefined
  return locale === 'en' ? value.en || value.is : value.is
}
