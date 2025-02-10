export type TestEnvironment = 'local' | 'dev' | 'staging' | 'prod'

export enum BaseAuthority {
  dev = 'beta.dev01.devland.is',
  staging = 'beta.staging01.devland.is',
  ads = 'loftbru.dev01.devland.is',
  judicialSystem = 'judicial-system.dev01.devland.is',
  prod = 'island.is',
  local = 'localhost',
}

export enum AuthUrl {
  dev = 'https://identity-server.dev01.devland.is',
  staging = 'https://identity-server.staging01.devland.is',
  prod = 'https://innskra.island.is',
  local = dev,
}

export const JUDICIAL_SYSTEM_HOME_URL = '/api/auth/login?nationalId=9999999999'
export const JUDICIAL_SYSTEM_JUDGE_HOME_URL =
  '/api/auth/login?nationalId=0000000000'
export const JUDICIAL_SYSTEM_COA_JUDGE_HOME_URL =
  '/api/auth/login?nationalId=0000000001'
export const JUDICIAL_SYSTEM_DEFENDER_HOME_URL =
  '/api/auth/login?nationalId=0909090909'

// This set of query params is used to hide the onboarding modal as well as force locale to Icelandic.
// Useful if you need to test something that is using Icelandic labels, for example.
const icelandicAndNoPopup = {
  locale: 'is',
  hide_onboarding_modal: 'true',
}

const localUrl = `http://${BaseAuthority.local}:${process.env.PORT ?? 4200}`

/**
 * Constructs the base URL for a given authority based on the environment.
 *
 * @param authority - The authority (domain) for which the base URL is constructed.
 * @returns The constructed base URL as a string.
 */
export const getEnvironmentBaseUrl = (authority: string) => {
  const baseUrlPrefix = process.env.BASE_URL_PREFIX ?? ''
  const prefix =
    baseUrlPrefix && baseUrlPrefix !== 'main' ? `${baseUrlPrefix}-` : ''
  return `https://${prefix}${authority}`
}

const envs: Record<
  TestEnvironment,
  {
    authUrl: string
    islandisBaseUrl: string
    adsBaseUrl: string
    judicialSystemBaseUrl: string
  }
> = {
  dev: {
    authUrl: AuthUrl.dev,
    islandisBaseUrl: getEnvironmentBaseUrl(BaseAuthority.dev),
    adsBaseUrl: getEnvironmentBaseUrl(BaseAuthority.ads),
    judicialSystemBaseUrl: getEnvironmentBaseUrl(BaseAuthority.judicialSystem),
  },
  staging: {
    authUrl: AuthUrl.staging,
    islandisBaseUrl: getEnvironmentBaseUrl(BaseAuthority.staging),
    adsBaseUrl: getEnvironmentBaseUrl('loftbru.staging01.devland.is'),
    judicialSystemBaseUrl: getEnvironmentBaseUrl(
      'judicial-system.staging01.devland.is',
    ),
  },
  prod: {
    authUrl: AuthUrl.prod,
    islandisBaseUrl: getEnvironmentBaseUrl(BaseAuthority.prod),
    adsBaseUrl: getEnvironmentBaseUrl('loftbru.island.is'),
    judicialSystemBaseUrl: getEnvironmentBaseUrl(BaseAuthority.prod),
  },
  local: {
    authUrl: AuthUrl.local,
    islandisBaseUrl: localUrl,
    adsBaseUrl: localUrl,
    judicialSystemBaseUrl: localUrl,
  },
}

export const env = (process.env.TEST_ENVIRONMENT ?? 'local') as TestEnvironment
const hotEnv = process.env.TEST_URL
  ? { islandisBaseUrl: process.env.TEST_URL }
  : {}
export const urls = { ...envs[env], ...hotEnv }

/**
 * Determines if the navigation to the given URL should be skipped.
 *
 * @param url - The URL to check.
 * @returns `true` if the URL is in the list of URLs to skip navigation for, otherwise `false`.
 */
export const shouldSkipNavigation = (url: string) =>
  [
    JUDICIAL_SYSTEM_COA_JUDGE_HOME_URL,
    JUDICIAL_SYSTEM_DEFENDER_HOME_URL,
    JUDICIAL_SYSTEM_HOME_URL,
    JUDICIAL_SYSTEM_JUDGE_HOME_URL,
  ].includes(url)

/**
 * Appends Icelandic language and no-popup query parameters to the given URL.
 *
 * @param url - The base URL to which the query parameters will be added.
 * @returns The URL with Icelandic language and no-popup query parameters appended.
 */
export const icelandicAndNoPopupUrl = (url: string) =>
  addQueryParameters(url, icelandicAndNoPopup)

/**
 * Adds query parameters to a given URL if they do not already exist.
 *
 * @param url - The URL to which the query parameters will be added.
 * @param parameters - An object containing key-value pairs of query parameters to add.
 * @returns The URL with the added query parameters.
 */
const addQueryParameters = (
  url: string,
  parameters: Record<string, string>,
): string => {
  const urlObject = new URL(url, 'http://dummyurl.com')

  // Check if each parameter already exists in the URL's query string
  for (const [key, value] of Object.entries(parameters)) {
    if (!urlObject.searchParams.has(key)) {
      urlObject.searchParams.set(key, value)
    }
  }

  return urlObject.toString().replace(/^http:\/\/dummyurl\.com/, '')
}
