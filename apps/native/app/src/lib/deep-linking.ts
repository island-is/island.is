import { router } from 'expo-router'
import {
  GenericLicenseType,
  NotificationMessage,
} from '../graphql/types/schema'

// Map between island.is web paths and native app routes
const urlMapping: Record<string, string> = {
  '/minarsidur/postholf/:id': '/inbox/:id',
  '/minarsidur/postholf': '/inbox',
  '/minarsidur/min-gogn/stillingar': '/settings',
  '/minarsidur/skirteini': '/wallet',
  '/minarsidur/skirteini/:provider/vegabref/:id': `/wallet/${GenericLicenseType.Passport}/:id`,
  '/minarsidur/skirteini/:provider/ehic/:id': `/wallet/${GenericLicenseType.Ehic}/:id`,
  '/minarsidur/skirteini/:provider/veidikort/:id': `/wallet/${GenericLicenseType.HuntingLicense}/default`,
  '/minarsidur/skirteini/:provider/pkort/:id': `/wallet/${GenericLicenseType.PCard}/default`,
  '/minarsidur/skirteini/:provider/okurettindi/:id': `/wallet/${GenericLicenseType.DriversLicense}/default`,
  '/minarsidur/skirteini/:provider/adrrettindi/:id': `/wallet/${GenericLicenseType.AdrLicense}/default`,
  '/minarsidur/skirteini/:provider/vinnuvelarettindi/:id': `/wallet/${GenericLicenseType.MachineLicense}/default`,
  '/minarsidur/skirteini/:provider/skotvopnaleyfi/:id': `/wallet/${GenericLicenseType.FirearmLicense}/default`,
  '/minarsidur/skirteini/:provider/ororkuskirteini/:id': `/wallet/${GenericLicenseType.DisabilityLicense}/default`,
  '/minarsidur/skirteini/:provider/nafnskirteini/:id': `/wallet/${GenericLicenseType.IdentityDocument}/:id`,
  '/minarsidur/eignir/fasteignir': '/more/assets',
  '/minarsidur/eignir/fasteignir/:id': '/more/assets/:id',
  '/minarsidur/fjarmal/stada': '/more/finance',
  '/minarsidur/eignir/okutaeki/min-okutaeki': '/more/vehicles',
  '/minarsidur/eignir/okutaeki/min-okutaeki/:id': '/more/vehicles/:id',
  '/minarsidur/eignir/okutaeki/min-okutaeki/:id/kilometrastada':
    '/more/vehicles/mileage/:id',
  '/minarsidur/loftbru': '/more/air-discount',
}

function matchPattern(
  pattern: string,
  path: string,
): Record<string, string> | null {
  const patternParts = pattern.split('/')
  const pathParts = path.split('/')

  if (patternParts.length !== pathParts.length) return null

  const params: Record<string, string> = {}

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i])
    } else if (patternParts[i] !== pathParts[i]) {
      return null
    }
  }

  return params
}

function applyParams(
  template: string,
  params: Record<string, string>,
): string {
  let result = template
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`:${key}`, encodeURIComponent(value))
  }
  return result
}

/**
 * Find a matching native route for a universal link URL.
 * Handles both full URLs (https://island.is/...) and path-only (/minarsidur/...).
 * Returns the mapped expo-router path, or null if no match.
 */
export function findRoute(url: string): string | null {
  // Remove trailing slash and spaces
  const cleanLink = url.replace(/\/\s*$/, '')
  // Remove domain if present
  const pathWithQuery = cleanLink.replace(/https?:\/\/[^/]+/, '')
  // Remove query string and hash
  const path = pathWithQuery.replace(/[?#].*$/, '')

  for (const [pattern, routeTemplate] of Object.entries(urlMapping)) {
    const params = matchPattern(pattern, path)
    if (params) {
      return applyParams(routeTemplate, params)
    }
  }

  return null
}

/**
 * No-op — expo-router handles URL-based routing via its linking configuration.
 * Kept for backward compatibility with setup-event-handlers and handle-initial-url.
 * @deprecated
 */
export function evaluateUrl(_url: string, _extraProps: any = {}) {
  return false
}

const navigateTimeMap = new Map<string, number>()
const NAVIGATE_TIMEOUT = 500

/**
 * Navigate to a specific url within the app.
 * Includes a 500ms throttle to prevent duplicate navigations from double-taps.
 * @param url Navigating url (ex. /inbox, /inbox/my-document-id, /wallet etc.)
 */
export function navigateTo(
  url: string,
  extraProps: Record<string, any> = {},
) {
  const now = Date.now()
  const lastNavigate = navigateTimeMap.get(url)

  if (lastNavigate && now - lastNavigate <= NAVIGATE_TIMEOUT) {
    return
  }

  navigateTimeMap.set(url, now)

  if (Object.keys(extraProps).length > 0) {
    router.navigate({ pathname: url as any, params: extraProps })
  } else {
    router.navigate(url as any)
  }
}

/**
 * Navigate to a universal link. If our mapping returns a valid native screen,
 * navigate there directly. Otherwise, open in the in-app browser.
 */
export function navigateToUniversalLink({
  link,
  openBrowser,
}: {
  link?: NotificationMessage['link']['url']
  openBrowser?: (link: string) => void
}) {
  if (!link) return

  const appRoute = findRoute(link)

  if (appRoute) {
    navigateTo(appRoute)
    return
  }

  // No matching native route — open in browser
  if (openBrowser) {
    openBrowser(link)
  }
}
