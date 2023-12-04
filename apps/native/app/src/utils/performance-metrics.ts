import perf, { FirebasePerformanceTypes } from '@react-native-firebase/perf'

let appLaunchTrace: FirebasePerformanceTypes.Trace

export function performanceMetrics() {
  perf().setPerformanceCollectionEnabled(true)

  appLaunchTrace = perf().newTrace('rnn:app_launch')
  appLaunchTrace.start()
}

export function performanceMetricsAppLaunched() {
  if (!__DEV__ && appLaunchTrace) {
    appLaunchTrace.stop()
  }
}
