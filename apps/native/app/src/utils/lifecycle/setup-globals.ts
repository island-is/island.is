// uncomment polyfills that are needed.
// make sure to add locales that are needed as well

import 'intl'
import 'intl/locale-data/jsonp/en'
import 'intl/locale-data/jsonp/is'

import '@formatjs/intl-locale/polyfill'
import '@formatjs/intl-getcanonicallocales/polyfill'

import '@formatjs/intl-pluralrules/polyfill'
import '@formatjs/intl-pluralrules/locale-data/en'
import '@formatjs/intl-pluralrules/locale-data/is'

import '@formatjs/intl-numberformat/polyfill'
import '@formatjs/intl-numberformat/locale-data/en'
import '@formatjs/intl-numberformat/locale-data/is'

import '@formatjs/intl-datetimeformat/polyfill'
import '@formatjs/intl-datetimeformat/locale-data/en'
import '@formatjs/intl-datetimeformat/locale-data/is'
import '@formatjs/intl-datetimeformat/add-golden-tz'

// import '@formatjs/intl-listformat/polyfill'
// import '@formatjs/intl-listformat/locale-data/en'
// import '@formatjs/intl-listformat/locale-data/is'

// import '@formatjs/intl-displaynames/polyfill'
// import '@formatjs/intl-displaynames/locale-data/en'
// import '@formatjs/intl-displaynames/locale-data/is'

import '@formatjs/intl-relativetimeformat/polyfill'
import '@formatjs/intl-relativetimeformat/locale-data/en'
import '@formatjs/intl-relativetimeformat/locale-data/is'

import { LogBox } from 'react-native'
import { Platform } from 'react-native'
import KeyboardManager from 'react-native-keyboard-manager'

LogBox.ignoreLogs([
  /^Constants\.manifest is null/
]);

if (!!(global as any).HermesInternal) {
  if ('__setDefaultTimeZone' in Intl.DateTimeFormat) {
    (Intl.DateTimeFormat as any).__setDefaultTimeZone('Atlantic/Reykjavik')
  }
}

global.Intl = (global as any).IntlPolyfill;
(global.Intl as any).__disableRegExpRestore()


export function setupGlobals() {
  if (Platform.OS === 'ios') {
    KeyboardManager.setEnable(true)
    KeyboardManager.setEnableAutoToolbar(true)
    KeyboardManager.setToolbarPreviousNextButtonEnable(true)
  }
}
