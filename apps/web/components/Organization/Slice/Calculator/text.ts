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
} satisfies Record<string, CalculatorLocalizedText>

export const localized = (
  value: CalculatorLocalizedText | undefined,
  locale: Locale,
): string | undefined => {
  if (!value) return undefined
  return locale === 'en' ? value.en || value.is : value.is
}
