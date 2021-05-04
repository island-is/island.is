import 'intl';
import 'intl/locale-data/jsonp/is';
import 'intl/locale-data/jsonp/en';
import { Platform } from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';


// in your index.js file
if (!!(global as any).HermesInternal) {
  // require('@formatjs/intl-datetimeformat/polyfill')
  // require('@formatjs/intl-datetimeformat/locale-data/is')
  // require('@formatjs/intl-datetimeformat/locale-data/en')
  // require('@formatjs/intl-datetimeformat/add-all-tz')
  // require('@formatjs/intl-locale/polyfill')

  if ('__setDefaultTimeZone' in Intl.DateTimeFormat) {
    (Intl.DateTimeFormat as any).__setDefaultTimeZone('GMT');
  }
}


global.Intl = (global as any).IntlPolyfill;
(global.Intl as any).__disableRegExpRestore();

export function setupGlobals() {
  if (Platform.OS === 'ios') {
    KeyboardManager.setEnable(true);
    KeyboardManager.setEnableAutoToolbar(true);
    KeyboardManager.setToolbarPreviousNextButtonEnable(true);
  }
}
