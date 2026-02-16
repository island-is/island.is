// Import order matters
import 'intl'
import 'intl/locale-data/jsonp/en'
import 'intl/locale-data/jsonp/is'

import '@formatjs/intl-getcanonicallocales/polyfill-force'
import '@formatjs/intl-locale/polyfill-force'

import '@formatjs/intl-pluralrules/polyfill-force'
import '@formatjs/intl-pluralrules/locale-data/en'
import '@formatjs/intl-pluralrules/locale-data/is'

import '@formatjs/intl-numberformat/polyfill-force'
import '@formatjs/intl-numberformat/locale-data/en'
import '@formatjs/intl-numberformat/locale-data/is'

import '@formatjs/intl-relativetimeformat/polyfill-force'
import '@formatjs/intl-relativetimeformat/locale-data/en'
import '@formatjs/intl-relativetimeformat/locale-data/is'

import { isIos } from './devices'

async function polyfillDateTimeFormat() {
  // Load the polyfill 1st BEFORE loading data
  await import('@formatjs/intl-datetimeformat/polyfill-force')

  // Parallelize data loading
  const dataPolyfills = [
    import('@formatjs/intl-datetimeformat/add-golden-tz'),
    import('@formatjs/intl-datetimeformat/locale-data/is'),
    import('@formatjs/intl-datetimeformat/locale-data/en'),
  ]

  await Promise.all(dataPolyfills)
}

async function initialize() {
  // set default timezone
  if (typeof HermesInternal === 'object' && HermesInternal !== null) {
    if ('__setDefaultTimeZone' in Intl.DateTimeFormat) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(Intl.DateTimeFormat as any).__setDefaultTimeZone('UTC')
    }
  }

  // overwrite global Intl with proper error handling
  if (isIos) {
    await polyfillDateTimeFormat()

    // overwrite global Intl
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.Intl = (global as any).IntlPolyfill
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global.Intl as any).__disableRegExpRestore()
  }
}

initialize()
