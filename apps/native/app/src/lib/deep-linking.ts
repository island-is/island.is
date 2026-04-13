import { Href, router } from 'expo-router'
import * as Router from 'expo-router'
import {
  GenericLicenseType,
  NotificationMessage,
} from '../graphql/types/schema'
import { match } from 'path-to-regexp'
import * as WebBrowser from 'expo-web-browser'

const UNIVERSAL_LINK_BASE = 'https://island.is'

// Map of universal link paths to native routes.
// The key is a path pattern to match against the incoming URL,
// and the value is either a static route or a function that generates a route with params.
const routes: Record<
  string,
  Href | ((params: Router.UnknownInputParams) => Href)
> = {
  // Inbox
  '/minarsidur/postholf': '/inbox',
  '/minarsidur/postholf/:id': ({ id }) => ({
    pathname: '/inbox/[id]',
    params: { id: id as string },
  }),
  // Wallet
  '/minarsidur/skirteini': '/wallet',
  '/minarsidur/skirteini/:provider/:type/:id': ({ id, type }) => ({
    pathname: '/wallet/[licenseType]/[id]',
    params: {
      id: id as string,
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
        }[type as string] || (type as string),
    },
  }),
  // Health
  '/minarsidur/heilsa/grunnupplysingar/yfirlit': '/health',
  '/minarsidur/heilsa/bolusetningar': '/health/vaccinations',
  '/minarsidur/heilsa/spurningalistar': '/health/questionnaires',
  '/minarsidur/heilsa/lyf': '/health/medicine',
  '/minarsidur/heilsa/lyf/lyfjaskirteini': '/health/medicine/prescriptions',
  '/minarsidur/heilsa/lyf/lyfjasaga/:id': ({ id }) => ({
    pathname: '/health/medicine/prescriptions/history/[id]',
    params: { id: id as string },
  }),
  '/minarsidur/heilsa/lyf/lyfjaumbod': '/health/medicine/delegation',
  '/minarsidur/heilsa/lyf/lyfjaumbod/nytt-lyfjaumbod':
    '/health/medicine/delegation/new',
  '/minarsidur/heilsa/lyf/lyfjaumbod/:id': ({ id }) => ({
    pathname: '/health/medicine/delegation/[id]',
    params: { id: id as string },
  }),
  // Family
  '/minarsidur/min-gogn/yfirlit': '/more/family',
  // Applications
  '/minarsidur/umsoknir': '/more/applications',
  '/minarsidur/umsoknir/:status': ({ status }) => ({
    pathname: '/more/applications/[status]',
    params: {
      status:
        {
          'oklaradar-umsoknir': 'incomplete',
          'klaradar-umsoknir': 'complete',
          'i-vinnslu': 'in-progress',
          'opnar-umsoknir': 'open',
        }[status as string] || (status as string),
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
    params: { id: id as string },
  }),
  // Finance
  '/minarsidur/fjarmal/stada': '/more/finance',
  // Vehicles
  '/minarsidur/eignir/okutaeki/min-okutaeki': '/more/vehicles',
  '/minarsidur/eignir/okutaeki/min-okutaeki/:id': ({ id }) => ({
    pathname: '/more/vehicles/[id]',
    params: { id: id as string },
  }),
  '/minarsidur/eignir/okutaeki/min-okutaeki/:id/kilometrastada': ({ id }) => ({
    pathname: '/more/vehicles/[id]/mileage',
    params: { id: id as string },
  }),
  // Air discount
  '/minarsidur/loftbru': '/more/air-discount',
  // Modals
  '/minarsidur/min-gogn/yfirlit/minar-upplysingar': '/personal-info',
  '/minarsidur/min-gogn/stillingar': '/settings',
  '/minarsidur/min-gogn/tilkynningar': '/notifications',
}

// Compiled map of links
const compiledRoutes = Object.entries(routes).map(
  ([pattern, route]) => [match(pattern), route] as const,
)

/**
 * Find a matching native route for a universal link URL.
 * Handles both full URLs (https://island.is/...) and path-only (/minarsidur/...).
 * Returns the mapped expo-router path, or null if no match.
 */
export function findRoute(url: string): Href | null {
  const cleanUrl = new URL(url, UNIVERSAL_LINK_BASE)
  for (const [matchFn, href] of compiledRoutes) {
    const result = matchFn(cleanUrl.pathname)
    if (result) {
      if (typeof href === 'function') {
        // Combine params from the URL path and the query string.
        const params = {
          ...Object.fromEntries(cleanUrl.searchParams.entries()),
          ...result.params,
        } as Record<string, string>
        return href(params)
      }
      return href
    }
  }
  return null
}

function replacePathname(href: Href, pathname: string): Href {
  if (typeof href === 'string') {
    return pathname as Href
  }
  return {
    ...href,
    pathname,
  } as Href
}

function adjustedAppRoute(dest: Href, source: Href | undefined): Href {
  const pathname = typeof dest === 'string' ? dest : dest.pathname
  const isFromNotifications = source?.toString().includes('/notifications')
  if (isFromNotifications) {
    if (pathname.startsWith('/inbox/')) {
      return replacePathname(dest, pathname.replace('/inbox/', '/notifications/document/'))
    }
  }
  return dest
}

/**
 * Navigate to a universal link. If our mapping returns a valid native screen,
 * navigate there directly. Otherwise, open in the in-app browser.
 */
export async function navigateToUniversalLink({
  link,
  fromScreen,
}: {
  link?: NotificationMessage['link']['url']
  fromScreen?: Href
}) {
  if (!link) return

  const appRoute = findRoute(link)

  if (appRoute) {
    return router.navigate(adjustedAppRoute(appRoute, fromScreen))
  }

  // No matching native route — open in browser
  try {
    if (link.startsWith('http')) {
      await WebBrowser.openBrowserAsync(link, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
      })
    }
  } catch (error) {
    console.log('Failed to open link in browser', { link, error })
  }
}
