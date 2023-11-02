import { useEffect, useRef } from 'react'

/**
 * Normally with remix, you'd update the params via useSearchParams from react-router-dom
 * and updating the search params will trigger the search to update for you.
 * However, it also triggers a navigation to the new url, which will trigger
 * the loader to run which we do not want because all our data is already
 * on the client, and we're just doing client-side state change on data we
 * already have. So we manually call `window.history.pushState` to avoid
 * the router from triggering the loader.
 *
 * Based on: https://github.com/kentcdodds/kentcdodds.com/blob/c756b74fc42682fc4de12b72a060e866fb966a89/app/utils/misc.tsx#L296-L323
 */
export function useSyncedQueryStringValueWithoutNavigation(
  queryKey: string,
  queryValue: string,
  ignoreInitialValue = false,
) {
  const firstValue = useRef<string | undefined>(queryValue)
  useEffect(() => {
    const currentSearchParams = new URLSearchParams(window.location.search)
    const oldQuery = currentSearchParams.get(queryKey) ?? ''
    if (queryValue === oldQuery) {
      return
    }
    if (ignoreInitialValue && queryValue === firstValue.current) {
      return
    }
    firstValue.current = undefined

    if (queryValue) {
      currentSearchParams.set(queryKey, queryValue)
    } else {
      currentSearchParams.delete(queryKey)
    }
    const newUrl = [window.location.pathname, currentSearchParams.toString()]
      .filter(Boolean)
      .join('?')

    window.history.replaceState(null, '', newUrl)
  }, [queryKey, queryValue, ignoreInitialValue])
}
