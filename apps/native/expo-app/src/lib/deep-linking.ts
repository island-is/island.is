// import { compile, match } from 'path-to-regexp'
// import { Navigation } from 'react-native-navigation'
// import createUse from 'zustand'
// import create, { State } from 'zustand/vanilla'
// import { bundleId } from '../config'
import {
  GenericLicenseType,
  NotificationMessage,
} from '../graphql/types/schema'

// export type RouteCallbackArgs =
//   | boolean
//   | ({ path: string } & {
//       scheme: string
//       match?: RegExpExecArray
//       [key: string]: string | RegExpExecArray | undefined
//     })

// export interface Route {
//   expression: string | RegExp
//   callback(args: RouteCallbackArgs): void
// }

// export interface DeepLinkingStore extends State {
//   schemes: string[]
//   routes: Route[]
// }

// export const deepLinkingStore = create<DeepLinkingStore>((set, get) => ({
//   schemes: [],
//   routes: [],
// }))

// export const useDeepLinkingStore = createUse(deepLinkingStore)

// function fetchQueries(expression: string) {
//   const regex = /:([^/]*)/g
//   const queries = []

//   let match = regex.exec(expression)
//   while (match) {
//     if (match && match[0] && match[1]) {
//       queries.push(match[0])
//     }

//     match = regex.exec(expression)
//   }

//   return queries
// }

// function execRegex(queries: string[], expression: string, path: string) {
//   let regexExpression = expression
//   queries.forEach((query) => {
//     regexExpression = regexExpression.replace(query, '(.*)')
//   })

//   const queryRegex = new RegExp(regexExpression, 'g')
//   const match = queryRegex.exec(path)

//   if (match && !match[1].includes('/')) {
//     let results = { path: match[0] }
//     queries.forEach((query, index) => {
//       const id = query.substring(1)
//       results = { [id]: match[index + 1], ...results }
//     })

//     return results
//   }

//   return false
// }

// function evaluateExpression(
//   expression: string | RegExp,
//   path: string,
//   scheme: string,
// ) {
//   if (expression === path) {
//     return { scheme, path }
//   }

//   try {
//     const regex = expression as RegExp
//     const match = regex.exec(path)
//     regex.lastIndex = 0
//     if (match) {
//       return { scheme, path, match }
//     }
//   } catch (e) {
//     // Error, expression is not regex
//   }

//   if (typeof expression === 'string' && expression.includes(':')) {
//     const queries = fetchQueries(expression)
//     if (queries.length) {
//       return execRegex(queries, expression, path)
//     }
//   }

//   return false
// }

export function evaluateUrl(url: string, extraProps: any = {}) {
  // @todo migration
  return false;
  // let solved = false
  // const { schemes, routes } = deepLinkingStore.getState()
  // schemes.forEach((scheme) => {
  //   if (url.startsWith(scheme)) {
  //     const path = url.substring(scheme.length - 1)
  //     routes.forEach((route) => {
  //       const result = evaluateExpression(route.expression, path, scheme)
  //       if (result) {
  //         solved = true
  //         route.callback({ scheme, ...result, ...extraProps })
  //       }
  //     })
  //   }
  // })

  // return solved
}

export const addRoute = (
  expression: string | RegExp,
  callback: (args: any) => void,
) => {
  // @todo migration
  // const route = { expression, callback }
  // deepLinkingStore.setState(({ routes }) => ({ routes: [...routes, route] }))
}

export const addScheme = (scheme: string) => {
  // @todo migration
  // deepLinkingStore.setState(({ schemes }) => ({
  //   schemes: [...schemes, scheme],
  // }))
}


// const navigateTimeMap = new Map()
// const NAVIGATE_TIMEOUT = 500

/**
 * Navigate to a specific url within the app
 * @param url Navigating url (ex. /inbox, /inbox/my-document-id, /wallet etc.)
 * @returns
 */
export function navigateTo(url: string, extraProps: any = {}) {
  // @todo migration

  // const now = Date.now()
  // // find last navigate time to this route
  // const lastNavigate = navigateTimeMap.get(url)

  // if (lastNavigate && now - lastNavigate <= NAVIGATE_TIMEOUT) {
  //   // user tried to navigate to same route twice within TAP_TIMEOUT (500ms)
  //   return
  // }

  // // update navigate time for this route
  // navigateTimeMap.set(url, now)

  // // setup linking url
  // const linkingUrl = `${bundleId}://${String(url).replace(/^\//, '')}`

  // // evaluate and route
  // return evaluateUrl(linkingUrl, extraProps)

  // @todo when to use native linking system?
  // return Linking.openURL(linkingUrl);
}

/**
 * Navigate to a specific universal link, if our mapping does not return a valid screen within the app - open a webview.
 */
export function navigateToUniversalLink({
  link,
  componentId,
  openBrowser,
}: {
  // url to navigate to
  link?: NotificationMessage['link']['url']
  // componentId to open web browser in
  componentId?: string
  openBrowser?: (link: string, componentId?: string) => void
  }) {
  // @todo migration

  // If no link do nothing
  // if (!link) return

  // const appRoute = findRoute(link)

  // if (appRoute) {
  //   navigateTo(appRoute)

  //   return
  // }

  // if (!componentId) {
  //   // Use home tab for browser
  //   Navigation.mergeOptions(MainBottomTabs, {
  //     bottomTabs: {
  //       currentTabIndex: 1,
  //     },
  //   })
  // }

  // openBrowser(link, componentId ?? ComponentRegistry.HomeScreen)
}

// Map between notification link and app screen
const urlMapping: { [key: string]: string } = {
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
  '/minarsidur/eignir/fasteignir': '/assets',
  '/minarsidur/eignir/fasteignir/:id': '/asset/:id',
  '/minarsidur/fjarmal/stada': '/finance',
  '/minarsidur/eignir/okutaeki/min-okutaeki': '/vehicles',
  '/minarsidur/eignir/okutaeki/min-okutaeki/:id': '/vehicle/:id',
  '/minarsidur/eignir/okutaeki/min-okutaeki/:id/kilometrastada':
    '/vehicle-mileage/:id',
  '/minarsidur/loftbru': '/air-discount',
}

// const findRoute = (url: string) => {
//   // Remove trailing slash and spacess
//   const cleanLink = url.replace(/\/\s*$/, '')
//   // Remove domain
//   const path = cleanLink.replace(/https?:\/\/[^/]+/, '')

//   for (const [pattern, routeTemplate] of Object.entries(urlMapping)) {
//     const matcher = match(pattern, { decode: decodeURIComponent })
//     const matchResult = matcher(path)

//     if (matchResult) {
//       const compiler = compile(routeTemplate)
//       return compiler(matchResult.params)
//     }
//   }

//   return null
// }
