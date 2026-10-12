import type { Locale } from '@island.is/shared/types'
import type { CalculatorLocalizedText } from '@island.is/tax-calculators'

export const CALCULATOR_MESSAGES: Record<string, CalculatorLocalizedText> = {
  submit: { is: 'Reikna', en: 'Calculate' },
  recalculate: { is: 'Endurreikna', en: 'Recalculate' },
  calculating: { is: 'Reiknar…', en: 'Calculating…' },
  resultReady: { is: 'Niðurstöður reiknaðar', en: 'Results calculated' },
  staleResult: {
    is: 'Niðurstöður eru úreltar, reiknaðu aftur',
    en: 'These results are out of date, recalculate',
  },
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
}

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
