import { Href, router } from 'expo-router'
import {
  GenericLicenseType,
  NotificationMessage,
} from '../graphql/types/schema'

type MapTemplate = Href | ((params: Record<string, string>) => Href)

const minarSidurMap: Record<string, MapTemplate> = {
  // Inbox
  '/minarsidur/postholf': '/inbox',
  '/minarsidur/postholf/:id': ({ id }) => ({
    pathname: '/inbox/[id]',
    params: { id },
  }),
  // Wallet
  '/minarsidur/skirteini': '/wallet',
  '/minarsidur/skirteini/:provider/:type/:id': ({ id, type }) => ({
    pathname: '/wallet/[licenseType]/[id]',
    params: {
      id,
      licenseType:
        {
          vegabref: GenericLicenseType.Passport,
          ehic: GenericLicenseType.Ehic,
          veidikort: GenericLicenseType.HuntingLicense,
          pkort: GenericLicenseType.PCard,
          okurettindi: GenericLicenseType.DriversLicense,
          adrrettindi: GenericLicenseType.AdrLicense,
          vinnuvelarettindi: GenericLicenseType.MachineLicense,
          skotvopnaleyfi: GenericLicenseType.FirearmLicense,
          ororkuskirteini: GenericLicenseType.DisabilityLicense,
          nafnskirteini: GenericLicenseType.IdentityDocument,
        }[type] || type,
    },
  }),
  // Health
  '/minarsidur/heilsa/grunnupplysingar/yfirlit': '/health',
  '/minarsidur/heilsa/bolusetningar': '/health/vaccinations',
  '/minarsidur/heilsa/spurningalistar': '/health/questionnaires',
  '/minarsidur/heilsa/lyf/lyfjaskirteini': '/health/medicine/prescriptions',
  '/minarsidur/heilsa/lyf/lyfjasaga': '/health/medicine/prescriptions/history',
  '/minarsidur/heilsa/lyf/lyfjaumbod': '/health/medicine/delegation',
  '/minarsidur/heilsa/lyf/lyfjaumbod/nytt-lyfjaumbod':
    '/health/medicine/delegation/new',
  '/minarsidur/heilsa/lyf/lyfjaumbod/:id': ({ id }) => ({
    pathname: '/health/medicine/delegation/[id]',
    params: { id },
  }),
  // Family
  '/minarsidur/min-gogn/yfirlit': '/more/family',
  // Applications
  '/minarsidur/umsoknir': '/more/applications',
  '/minarsidur/umsoknir/:status"': ({ status }) => ({
    pathname: '/more/applications/[status]',
    params: {
      status:
        {
          'oklaradar-umsoknir': 'incomplete',
          'klaradar-umsoknir': 'complete',
          'i-vinnslu': 'in-progress',
          'opnar-umsoknir': 'open',
        }[status] || status,
    },
  }),
  '/minarsidur/umsoknir/klaradar-umsoknir': {
    pathname: '/more/applications/[status]',
    params: { status: 'complete' },
  },
  // Assets
  '/minarsidur/eignir/fasteignir': '/more/assets',
  '/minarsidur/eignir/fasteignir/:id': ({ id }) => ({
    pathname: '/more/assets/[id]',
    params: { id },
  }),
  // Finance
  '/minarsidur/fjarmal/stada': '/more/finance',
  // Vehicles
  '/minarsidur/eignir/okutaeki/min-okutaeki': '/more/vehicles',
  '/minarsidur/eignir/okutaeki/min-okutaeki/:id': ({ id }) => ({
    pathname: '/more/vehicles/[id]',
    params: { id },
  }),
  '/minarsidur/eignir/okutaeki/min-okutaeki/:id/kilometrastada': ({ id }) => ({
    pathname: '/more/vehicles/[id]/mileage',
    params: { id },
  }),
  // Air discount
  '/minarsidur/loftbru': '/more/air-discount',
  // Modals
  '/minarsidur/min-gogn/yfirlit/minar-upplysingar': '/personal-info',
  '/minarsidur/min-gogn/stillingar': '/settings',
  '/minarsidur/min-gogn/tilkynningar': '/notifications',
}

const navigateTimeMap = new Map<string, number>()

const NAVIGATE_TIMEOUT = 500

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

/**
 * Find a matching native route for a universal link URL.
 * Handles both full URLs (https://island.is/...) and path-only (/minarsidur/...).
 * Returns the mapped expo-router path, or null if no match.
 */
export function findRoute(url: string): Href | null {
  // Remove trailing slash and spaces
  const cleanLink = url.replace(/\/\s*$/, '')
  // Remove domain if present
  const pathWithQuery = cleanLink.replace(/https?:\/\/[^/]+/, '')
  // Remove query string and hash
  const path = pathWithQuery.replace(/[?#].*$/, '')

  for (const [pattern, routeTemplate] of Object.entries(minarSidurMap)) {
    const params = matchPattern(pattern, path)
    if (typeof routeTemplate === 'function') {
      return routeTemplate(params ?? {});
    }
    return routeTemplate;
  }

  return null
}

/**
 * Navigate to a specific url within the app.
 * Includes a 500ms throttle to prevent duplicate navigations from double-taps.
 * @param url Navigating url (ex. /inbox, /inbox/my-document-id, /wallet etc.)
 */
export function navigateTo(url: string, extraProps: Record<string, any> = {}) {
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
    return router.navigate(appRoute);
  }

  // No matching native route — open in browser
  if (openBrowser) {
    openBrowser(link)
  }
}
