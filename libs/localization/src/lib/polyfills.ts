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

const maybePolyfillLocale = async () => {
  await import(
    /* webpackChunkName: "intl-locale" */ '@formatjs/intl-locale/polyfill'
  )
}

const maybePolyfillNumberFormat = async () => {
  await import(
    /* webpackChunkName: "intl-numberformat" */ '@formatjs/intl-numberformat/polyfill'
  )
}

const maybePolyfillDateTimeFormat = async () => {
  await import(
    /* webpackChunkName: "intl-datetimeformat" */ '@formatjs/intl-datetimeformat/polyfill'
  )
}

export async function polyfill(locale: Locale) {
  await Promise.all([
    maybePolyfillLocale(),
    maybePolyfillNumberFormat(),
    maybePolyfillDateTimeFormat(),
  ])

  const dataPolyfills = []

  if ((Intl as PolyfilledIntl).NumberFormat.polyfilled) {
    dataPolyfills.push(localeDataModules.numberFormat[locale]())
  }

  if ((Intl as PolyfilledIntl).DateTimeFormat.polyfilled) {
    dataPolyfills.push(
      import(
        /* webpackChunkName: "intl-datetimeformat" */ '@formatjs/intl-datetimeformat/add-all-tz'
      ),
    )

    dataPolyfills.push(localeDataModules.dateTimeFormat[locale]())
  }

  await Promise.all(dataPolyfills)
}
