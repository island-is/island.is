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
    featureName: '', // intentionally left empty to match plausible Goal legacy settings
    params: {
      // lowercase to count "Query String" and "query string" as the same thing
      query: query.trim().toLowerCase(),
      source,
    },
  }
  plausibleCustomEvent(event)
}

// User opens the main site navigation. Preserves the legacy 'web Menu button'
// goal — fires on every open (not first-open-per-session) so before/after
// redesign counts remain directly comparable. `surface` distinguishes the
// desktop per-section dropdowns from the mobile fullscreen panel; `section`
// (desktop only) lets us see which section drives engagement.
export const webMenuButtonClicked = (
  params: {
    surface?: 'desktop' | 'mobile'
    section?: 'organizations' | 'categories' | 'lifeEvents'
    trigger?: 'menu' | 'search'
  } = {},
) => {
  const event: BaseEvent = {
    eventName: 'Menu button',
    featureName: 'web',
    params,
  }
  plausibleCustomEvent(event)
}

export const haskolanamFilterClicked = (category: string, value: string) => {
  const event: BaseEvent = {
    eventName: `haskolanam.filter`,
    featureName: '',
    params: {
      query: `${category}-${value}`,
    },
  }
  plausibleCustomEvent(event)
}

export const haskolanamTrackSearchQuery = (query: string) => {
  const event: BaseEvent = {
    eventName: `haskolanam.search`,
    featureName: '',
    params: {
      query: query.trim().toLowerCase(),
    },
  }
  plausibleCustomEvent(event)
}

export const haskolanamApplyButtonClicked = (
  university: string,
  program: string,
  id: string,
) => {
  const shortenedId = id.split('-')[0]
  const event: BaseEvent = {
    eventName: `haskolanam.apply.button`,
    featureName: '',
    params: {
      query: `${university}-${program}-${shortenedId}`,
    },
  }
  plausibleCustomEvent(event)
}

export const haskolanamCardClicked = (
  university: string,
  program: string,
  id: string,
) => {
  const shortenedId = id.split('-')[0]
  const event: BaseEvent = {
    eventName: `haskolanam.card.clicked`,
    featureName: '',
    params: {
      query: `${university}-${program}-${shortenedId}`,
    },
  }
  plausibleCustomEvent(event)
}
