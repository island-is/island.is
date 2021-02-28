import { shouldPolyfill as shouldPolyfillNumberFormat } from '@formatjs/intl-numberformat/should-polyfill'
import areIntlLocalesSupported from 'intl-locales-supported'
import { Locale } from './LocaleContext'

declare namespace Intl {
  var NumberFormat: {
    polyfilled?: boolean
  }
  var DateTimeFormat: {
    polyfilled?: boolean
  }
}

// Don't bundle all locales.
const localeDataModules = {
  numberFormat: {
    is: () =>
      import(
        /* webpackChunkName: "intl-numberformat" */ '@formatjs/intl-numberformat/locale-data/is'
      ),
    en: () =>
      import(
        /* webpackChunkName: "intl-numberformat" */ '@formatjs/intl-numberformat/locale-data/en'
      ),
  },
  dateTimeFormat: {
    is: () =>
      import(
        /* webpackChunkName: "intl-datetimeformat" */ '@formatjs/intl-datetimeformat/locale-data/is'
      ),
    en: () =>
      import(
        /* webpackChunkName: "intl-datetimeformat" */ '@formatjs/intl-datetimeformat/locale-data/en'
      ),
  },
}

const maybePolyfillNumberFormat = (locale: Locale) => {
  // Polyfill Intl.NumberFormat if necessary
  if (!areIntlLocalesSupported(locale) || shouldPolyfillNumberFormat()) {
    return import(
      /* webpackChunkName: "intl-numberformat" */ '@formatjs/intl-numberformat/polyfill-force'
    )
  }
}

const maybePolyfillDateTimeFormat = (locale: Locale) => {
  // Polyfill Intl.DateTimeFormat if necessary
  if (!areIntlLocalesSupported(locale)) {
    return import(
      /* webpackChunkName: "intl-datetimeformat" */ '@formatjs/intl-datetimeformat/polyfill-force'
    )
  }
}

/**
 * Dynamically polyfill Intl API & its locale data
 * @param locale locale to polyfill
 */
export async function polyfill(locale: Locale) {
  await Promise.all([
    maybePolyfillNumberFormat(locale),
    maybePolyfillDateTimeFormat(locale),
  ])

  const dataPolyfills = []
  if (Intl.NumberFormat.polyfilled) {
    dataPolyfills.push(localeDataModules.numberFormat[locale]())
  }

  if (Intl.DateTimeFormat.polyfilled) {
    dataPolyfills.push(
      import(
        /* webpackChunkName: "intl-datetimeformat" */ '@formatjs/intl-datetimeformat/add-all-tz'
      ),
    )
    dataPolyfills.push(localeDataModules.dateTimeFormat[locale]())
  }

  await Promise.all(dataPolyfills)
}
