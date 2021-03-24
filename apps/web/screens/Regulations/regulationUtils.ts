import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { ParsedUrlQuery } from 'querystring'

/** Pretty-formats a Regulation `name` for human consumption
 *
 * Chops off leading zeros
 */
export const prettyName = (regulationName: string) =>
  regulationName.replace(/^0+/, '')

// ---------------------------------------------------------------------------

/** Converts a Regulation `name` into a URL path segment
 *
 *  Example: '0123/2020' --> '0123-2020'
 */
export const nameToSlug = (regulationName: string, seperator?: string) => {
  // const [number, year] = regulationName.split('/')
  // return year + (seperator || '/') + number
  return regulationName.replace('/', seperator || '-')
}

// ---------------------------------------------------------------------------

export const useRegulationLinkResolver = () => {
  const utils = useLinkResolver()
  return {
    ...utils,
    linkToRegulation: (regulationName: string) =>
      utils.linkResolver('regulation', [nameToSlug(regulationName)]).href,
  }
}

// ---------------------------------------------------------------------------

/** Returns the first query parameter value as string, falling back to '' */
const getParamStr = (query: ParsedUrlQuery, key: string): string => {
  const val = query[key]
  return val == null ? '' : typeof val === 'string' ? val : val[0]
}

/** Picks named keys from the query object and defaults them to '' */
export const getParams = <K extends string>(
  query: ParsedUrlQuery,
  keys: Array<K>,
): Record<K, string> =>
  keys.reduce((obj, key) => {
    obj[key] = getParamStr(query, key)
    return obj
  }, {} as Record<K, string>)
