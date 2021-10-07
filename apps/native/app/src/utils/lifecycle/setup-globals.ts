import '../shim';

import * as Sentry from '@sentry/react-native'
import { LogBox, Settings } from 'react-native'
import { Platform } from 'react-native'
import KeyboardManager from 'react-native-keyboard-manager'
import messaging from '@react-native-firebase/messaging'
import perf from '@react-native-firebase/perf'
import { performanceMetrics } from '../performance-metrics'
import { config } from '../config'

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
import { setupQuickActions } from '../quick-actions'
import { ReactNativeNavigationInstrumentation } from '../../lib/react-native-navigation-instrumentation';
import { Navigation } from 'react-native-navigation'

if (__DEV__) {
  perf().setPerformanceCollectionEnabled(false)
  require('../devtools/index')
} else {
  const instrumentation = new ReactNativeNavigationInstrumentation(Navigation);

  // initialize sentry
  Sentry.init({
    dsn: config.sentryDsn,
    integrations: [
      new Sentry.ReactNativeTracing({
        tracingOrigins: ["localhost", "*.devland.is", "island.is", /^\//],
        routingInstrumentation: instrumentation,
        enableAppStartTracking: true,
        enableNativeFramesTracking: true,
      }),
    ],
    tracesSampleRate: 0.2
  })

  // enable performance metrics collection
  performanceMetrics()

  // register device for remote messages
  messaging().registerDeviceForRemoteMessages()
}

// ignore expo warnings
LogBox.ignoreLogs([
  /^Constants\./,
  /RCTRootView cancelTouches/,
  /toggling bottomTabs visibility is deprecated on iOS/,
  /Require cycle:/
])

// set default timezone
if (!!(global as any).HermesInternal) {
  if ('__setDefaultTimeZone' in Intl.DateTimeFormat) {
    ;(Intl.DateTimeFormat as any).__setDefaultTimeZone('Atlantic/Reykjavik')
  }
}

// overwrite global Intl
global.Intl = (global as any).IntlPolyfill
;(global.Intl as any).__disableRegExpRestore()

export function setupGlobals() {
  // keyboard manager
  if (Platform.OS === 'ios') {
    KeyboardManager.setEnable(true)
    KeyboardManager.setEnableAutoToolbar(true)
    KeyboardManager.setToolbarPreviousNextButtonEnable(true)

    // quick actions
    setupQuickActions()
  }

  // set NSUserDefaults
  if (Platform.OS === 'ios') {
    Settings.set({
      version_preference: config.constants.nativeAppVersion,
      build_preference: config.constants.nativeBuildVersion,
    })
  }
}
