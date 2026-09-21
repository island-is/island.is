import { DdRum } from '@datadog/mobile-react-native'
import { useSegments } from 'expo-router'
import { useEffect, useRef } from 'react'

/**
 * Maps expo-router segments to a Datadog RUM view name. Uses the route
 * segment template (e.g. inbox/[id]) rather than the resolved pathname so
 * dynamic params like document IDs don't leak into Datadog.
 *
 * Returns null while the router hasn't resolved a real route yet (the
 * transient '/' state on launch) — that's not a screen the user sees, so
 * no view is reported for it.
 */
const getViewName = (segments: string[]): string | null => {
  const path = segments.filter((segment) => !segment.startsWith('(')).join('/')

  if (!path) {
    return null
  }

  // The home tab lives in an index folder, so its template is just 'index'.
  if (path === 'index' || path === 'index/index') {
    return 'home'
  }

  // inbox/[id] -> inbox/:id, matching Datadog's web view-name convention.
  return path.replace(/\[(\w+)\]/g, ':$1')
}

/**
 * Reports the currently focused route to Datadog RUM as a view.
 *
 * The 'ApplicationLaunch' view preceding the first real view is created by
 * the Datadog SDK itself and can't be suppressed here — exclude it in
 * dashboards with -@view.name:ApplicationLaunch if it's noise.
 */
export const useDatadogViewTracking = () => {
  const segments = useSegments()
  const viewName = getViewName(segments)
  const previousViewRef = useRef<string | null>(null)

  useEffect(() => {
    if (__DEV__ || !viewName) {
      return
    }

    const previous = previousViewRef.current
    if (previous && previous !== viewName) {
      DdRum.stopView(previous).catch(() => {
        // noop
      })
    }
    DdRum.startView(viewName, viewName).catch(() => {
      // noop
    })
    previousViewRef.current = viewName
  }, [viewName])
}
