import { shouldPolyfill as shouldPolyfillLocale } from '@formatjs/intl-locale/should-polyfill'
import { shouldPolyfill as shouldPolyfillNumberFormat } from '@formatjs/intl-numberformat/should-polyfill'
import { shouldPolyfill as shouldPolyfillDatetimeFormat } from '@formatjs/intl-datetimeformat/should-polyfill'
import areIntlLocalesSupported from 'intl-locales-supported'

import { Locale } from '@island.is/shared/types'

interface PolyfilledIntl {
  NumberFormat: {
    polyfilled?: boolean
  }
  DateTimeFormat: {
    polyfilled?: boolean
  }
}

// Don't bundle all locales.
const localeDataModules = {
  numberFormat: {
    is: () =>
      import(
        /* webpackChunkName: "intl" */ '@formatjs/intl-numberformat/locale-data/is'
      ),
    en: () =>
      import(
        /* webpackChunkName: "intl" */ '@formatjs/intl-numberformat/locale-data/en'
      ),
  },
  dateTimeFormat: {
    is: () =>
      import(
        /* webpackChunkName: "intl" */ '@formatjs/intl-datetimeformat/locale-data/is'
      ),
    en: () =>
      import(
        /* webpackChunkName: "intl" */ '@formatjs/intl-datetimeformat/locale-data/en'
      ),
  },
}

const maybePolyfillLocale = async (locale: Locale) => {
  if (!areIntlLocalesSupported(locale) || shouldPolyfillLocale()) {
    return await import(
      /* webpackChunkName: "intl" */ '@formatjs/intl-locale/polyfill-force'
    )
  }
}

const maybePolyfillNumberFormat = async (locale: Locale) => {
  if (!areIntlLocalesSupported(locale) || shouldPolyfillNumberFormat()) {
    return await import(
      /* webpackChunkName: "intl" */ '@formatjs/intl-numberformat/polyfill-force'
    )
  }
}

const maybePolyfillDateTimeFormat = async (locale: Locale) => {
  if (!areIntlLocalesSupported(locale) || shouldPolyfillDatetimeFormat()) {
    return await import(
      /* webpackChunkName: "intl" */ '@formatjs/intl-datetimeformat/polyfill-force'
    )
  }
}

export async function polyfill(locale: Locale) {
  await Promise.all([
    maybePolyfillLocale(locale),
    maybePolyfillNumberFormat(locale),
    maybePolyfillDateTimeFormat(locale),
  ])

  const dataPolyfills = []

  if ((Intl as PolyfilledIntl).NumberFormat.polyfilled) {
    dataPolyfills.push(localeDataModules.numberFormat[locale]())
  }

  if ((Intl as PolyfilledIntl).DateTimeFormat.polyfilled) {
    dataPolyfills.push(
      import(
        /* webpackChunkName: "intl" */ '@formatjs/intl-datetimeformat/add-all-tz'
      ),
    )

    dataPolyfills.push(localeDataModules.dateTimeFormat[locale]())
  }

  await Promise.all(dataPolyfills)
}
