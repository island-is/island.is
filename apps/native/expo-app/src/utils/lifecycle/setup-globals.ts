/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DdRum,
  DdSdkReactNative,
  DatadogProviderConfiguration,
  TrackingConsent,
  // DdSdkReactNativeConfiguration,
} from '@datadog/mobile-react-native'
import messaging from '@react-native-firebase/messaging'
import { initializePerformance } from '@react-native-firebase/perf'
import {
  DynamicColorIOS,
  ImageStyle,
  LogBox,
  Settings,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native'
import * as Application from 'expo-application';
import KeyboardManager from 'react-native-keyboard-manager'
import { Navigation } from 'react-native-navigation'
import { getConfig } from '../../config'
import { isIos } from '../devices'
import { performanceMetrics } from '../performance-metrics'
import { app } from '../../lib/firebase'

type PatchedStyleSheet = typeof StyleSheet & {
  _create: typeof StyleSheet.create
}

export function applyDynamicColorSupport() {
  if ((StyleSheet as PatchedStyleSheet)._create) {
    return
  }

  // Persist original StyleSheet.create function
  ;(StyleSheet as PatchedStyleSheet)._create = StyleSheet.create

  function parseDynamicStyleValues(props: ViewStyle | TextStyle | ImageStyle) {
    for (const key in props) {
      const value = (props as Record<string, unknown>)[key]
      if (typeof value === 'string') {
        const matches = value.match(/color\(DynamicColor, '(.*)'\)/)
        if (matches && matches[1]) {
          try {
            const tuple = JSON.parse(matches[1])
            ;(props as Record<string, unknown>)[key] = DynamicColorIOS(tuple)
          } catch (err) {
            console.warn('failed to parse DynamicColor', value, err)
          }
        }
      }
    }
    return props
  }

  // We take advantage of the create function to parse DynamicColorIOS tuples
  // passed to the style prop of a component, as emotion and styled-components
  // uses this function in the final step of processing styles.
  StyleSheet.create = (style) => {
    if ('generated' in style) {
      ;(style as { generated: any }).generated = parseDynamicStyleValues(
        style.generated,
      )
    }
    return (StyleSheet as PatchedStyleSheet)._create(style)
  }
}

applyDynamicColorSupport()

if (__DEV__) {
  initializePerformance(app)
} else {
  // datadog rum config
  // @todo migration
  const ddconfig = new DatadogProviderConfiguration(
    getConfig().datadog ?? '',
    'production',
    TrackingConsent.NOT_GRANTED,
    {
      site: 'EU',
      service: 'mobile-app',
      rumConfiguration: {
        applicationId: '2736367a-a841-492d-adef-6f5a509d6ec2',
        trackInteractions: false, // do not track User interactions (e.g.: Tap on buttons.)
        trackResources: true, // track XHR Resources
        trackErrors: true, // track Errors
        sessionSampleRate: 10,
        nativeCrashReportEnabled: true,
      }
    },
  )

  // initialize datadog rum
  DdSdkReactNative.initialize(ddconfig)

  Navigation.events().registerComponentWillAppearListener(
    ({ componentId, componentName }) => {
      // Start a view with a unique view identifier, a custom view url, and an object to attach additional attributes to the view
      DdRum.startView(componentId, componentName)
    },
  )

  Navigation.events().registerComponentDidDisappearListener(
    ({ componentId }) => {
      // Stops a previously started view with the same unique view identifier, and an object to attach additional attributes to the view
      DdRum.stopView(componentId)
    },
  )

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
  /Require cycle:/,
  /new NativeEventEmitter/,
])

export function setupGlobals() {
  // keyboard manager
  if (isIos) {
    KeyboardManager.setEnable(true)
    KeyboardManager.setEnableAutoToolbar(true)
    KeyboardManager.setToolbarPreviousNextButtonEnable(true)
  }

  // set NSUserDefaults
  if (isIos) {
    Settings.set({
      version_preference: Application.nativeApplicationVersion,
      build_preference: Application.nativeBuildVersion,
    })
  }
}
