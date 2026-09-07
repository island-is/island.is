import { createIntl } from 'react-intl'
import { m } from './messages'

// The residency-days line uses an ICU plural message. Icelandic CLDR puts every
// number ending in 1 *except* 11 into the `one` category (1, 21, 31, …, 181),
// so the `one` branch must still render the count (`# dag`) rather than a literal
// "einn dag" — otherwise 21 would render the literal "einn dag", dropping the
// real count. This guards that regression.
describe('m.localResidencyDaysSpent (Icelandic ICU plural)', () => {
  // `defaultLocale: 'is'` matters: the strings under test are Icelandic
  // `defaultMessage`s, and react-intl selects the plural category for a
  // defaultMessage using `defaultLocale` (the app's IntlProvider sets it to
  // the Icelandic `defaultLanguage`). Without it, English rules would apply
  // and 21 would wrongly fall to `other`.
  const intl = createIntl({
    locale: 'is',
    defaultLocale: 'is',
    messages: {},
    onError: () => undefined,
  })
  const format = (days: number) =>
    intl.formatMessage(m.localResidencyDaysSpent, { days })

  it.each([1, 21, 31, 181])(
    'keeps the count with the singular noun "dag" for n ending in 1: %i',
    (days) => {
      expect(format(days)).toBe(`Þú hefur aðeins búið á Íslandi í ${days} dag.`)
    },
  )

  it.each([5, 11, 22, 100])(
    'keeps the count with the plural noun "daga" otherwise: %i',
    (days) => {
      expect(format(days)).toBe(
        `Þú hefur aðeins búið á Íslandi í ${days} daga.`,
      )
    },
  )
})
