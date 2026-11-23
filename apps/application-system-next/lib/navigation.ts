/**
 * Leaves the page for `url` without adding a history entry. A function of its
 * own so tests can replace it: browsers do not let a test stub
 * `window.location`.
 */
export const replaceLocation = (url: string): void => {
  window.location.replace(url)
}
