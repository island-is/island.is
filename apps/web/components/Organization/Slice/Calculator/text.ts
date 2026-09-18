import type { Locale } from '@island.is/shared/types'
import type { CalculatorLocalizedText } from '@island.is/tax-calculators'

/* The slice's own chrome. Every field label, placeholder, section title and
 * toggle label is editor-authored in `configJson` instead.
 *
 * Not react-intl: no slice on an organization page sits inside an
 * `IntlProvider`, and this component already picks a language by hand for the
 * authored text, so the two are kept consistent. */
export const CHROME_TEXT = {
  submit: { is: 'Reikna', en: 'Calculate' },
  loadError: {
    is: 'Ekki tókst að sækja reiknivélina',
    en: 'Could not load the calculator',
  },
  results: { is: 'Niðurstaða', en: 'Result' },
  /* RSK was unreachable, or answered with something that is not a result. */
  calculationError: {
    is: 'Ekki tókst að reikna',
    en: 'The calculation could not be completed',
  },
  /* The calculation ran but produced nothing to place in the output sections --
   * either an empty result from RSK, or a config that places no value the
   * calculation returned. */
  emptyResult: {
    is: 'Engin niðurstaða fannst fyrir þessar forsendur',
    en: 'No result was found for these values',
  },
  /* Every field-level validation code collapses to this: the codes distinguish
   * why a value is unacceptable in terms the visitor has no way to act on
   * differently. */
  invalidValue: { is: 'Ógilt gildi', en: 'Invalid value' },
  yes: { is: 'Já', en: 'Yes' },
  no: { is: 'Nei', en: 'No' },
} satisfies Record<string, CalculatorLocalizedText>

/* Anything editor-authored that carries an optional label: an input section
 * field, an output section field, or an output array item field. Declared here
 * because `localized` is what decides whether such a label exists at all. */
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
