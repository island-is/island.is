import { useState } from 'react'
import { ParsedUrlQuery } from 'querystring'
import { RegName, RegQueryName } from './types'

// ---------------------------------------------------------------------------

export const interpolate = (
  text: string,
  values: Record<string, string | number>,
): string =>
  text.replace(/\$\{([a-z0-9_$]+)\}/gi, (marker, name) =>
    values[name] != null ? values[name] + '' : marker,
  )

// ---------------------------------------------------------------------------

/** Pretty-formats a Regulation `name` for human consumption
 *
 * Chops off leading zeros
 */
export const prettyName = (regulationName: string): string =>
  regulationName.replace(/^0+/, '')

// ---------------------------------------------------------------------------

/** Converts a Regulation `name` into a URL path segment
 *
 *  Example: '0123/2020' --> '0123-2020'
 */
export const nameToSlug = (regulationName: RegName): RegQueryName =>
  regulationName.replace('/', '-') as RegQueryName

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

// ---------------------------------------------------------------------------

const domid_prefix = '_' + /*@__PURE__*/ (Date.now() + '-').substr(6)
let domid_incr = 0

export default function domid() {
  return domid_prefix + domid_incr++
}

// ---------------------------------------------------------------------------

// Returns a stable, unique ID string
export const useDomid = (staticId?: string) => useState(staticId || domid)[0]

// ---------------------------------------------------------------------------
