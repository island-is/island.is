import { push } from './push'

/**
 * Track a custom event.
 * @see https://matomo.org/docs/event-tracking/
 */
export const trackEvent = (
  category: string,
  action: string,
  name?: string,
  value?: number,
): void => {
  const args: unknown[] = ['trackEvent', category, action]
  if (name !== undefined) args.push(name)
  if (value !== undefined) args.push(value)
  push(args)
}

/**
 * Track a site search.
 * Matomo provides a dedicated "Site Search" report for this.
 * @see https://matomo.org/docs/site-search/
 */
export const trackSiteSearch = (
  keyword: string,
  category?: string | false,
  resultsCount?: number,
): void => {
  const args: unknown[] = ['trackSiteSearch', keyword]
  args.push(category ?? false)
  if (resultsCount !== undefined) args.push(resultsCount)
  push(args)
}

/**
 * Set a custom variable for the current visit or page.
 * @param index Slot index (1-5)
 * @param name Variable name
 * @param value Variable value
 * @param scope 'visit' or 'page'
 * @see https://matomo.org/docs/custom-variables/
 */
export const setCustomVariable = (
  index: number,
  name: string,
  value: string,
  scope: 'visit' | 'page' = 'visit',
): void => {
  push(['setCustomVariable', index, name, value, scope])
}
