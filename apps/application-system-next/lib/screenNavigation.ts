export type HistoryAction = 'push' | 'replace' | 'none'

type HistoryInput =
  | {
      // The address bar already holds the screen id the client asked for (first
      // load, back/forward, language switch), so there is nothing to push.
      source: 'url'
      requestedId?: string
      responseId: string
    }
  | {
      // The user moved on: an action button or a link to another screen. The
      // address bar still shows the screen they were on.
      source: 'navigation'
      currentId: string
      responseId: string
      hasNotice: boolean
    }

/**
 * Decides how the address bar follows a screen the server returned.
 *
 * - `url`: replace when the server showed a different screen than the address
 *   bar names (the id was unknown or not available), otherwise leave it.
 * - `navigation`: replace when the response carries a notice (the claimed
 *   screen was not available, so no history entry should exist for it), push
 *   when the screen changed, otherwise leave it (e.g. validation errors on the
 *   same screen).
 */
export const getHistoryAction = (input: HistoryInput): HistoryAction => {
  if (input.source === 'url') {
    return input.responseId !== input.requestedId ? 'replace' : 'none'
  }
  if (input.hasNotice) {
    return 'replace'
  }
  return input.responseId !== input.currentId ? 'push' : 'none'
}

const SCREEN_PARAM = 'screen'

export const readScreenIdFromSearch = (search: string): string | undefined =>
  new URLSearchParams(search).get(SCREEN_PARAM) ?? undefined

/** Returns `href` as a path with `?screen=<screenId>`, keeping other params. */
export const buildScreenUrl = (href: string, screenId: string): string => {
  const url = new URL(href)
  url.searchParams.set(SCREEN_PARAM, screenId)
  return `${url.pathname}${url.search}${url.hash}`
}

/**
 * Updates the address bar with the History API directly rather than the Next
 * router, because the router would refetch the server component for a screen
 * the client has already loaded.
 */
export const writeScreenHistory = (
  action: Exclude<HistoryAction, 'none'>,
  screenId: string,
): void => {
  const url = buildScreenUrl(window.location.href, screenId)
  if (action === 'push') {
    window.history.pushState(null, '', url)
  } else {
    window.history.replaceState(null, '', url)
  }
}
