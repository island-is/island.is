import BaseEvent from './BaseEvent'
import { plausibleCustomEvent } from './plausibleEvent'

// User clicks on login button on /minarsidur/ page.
export const webLoginButtonSelect = (
  buttonType: string,
  callback?: () => void,
) => {
  const event: BaseEvent = {
    eventName: 'Login to /minarsidur',
    featureName: 'web',
    params: {
      buttonType,
    },
    callback: callback,
  }
  plausibleCustomEvent(event)
}

// Tracks Site Search from Web, ServiceWeb and other search inputs
export const trackSearchQuery = (query: string, source: string) => {
  const event: BaseEvent = {
    eventName: 'Search Query',
    featureName: 'web',
    params: {
      // lowercase to count "Query String" and "query string" as the same thing
      query: query.trim().toLowerCase(),
      source,
    },
  }
  plausibleCustomEvent(event)
}