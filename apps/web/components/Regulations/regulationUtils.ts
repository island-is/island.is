import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useDateUtils as _useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { ParsedUrlQuery } from 'querystring'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { ISODate, RegName, RegQueryName } from './Regulations.types'

export const interpolateArray = (
  text: string,
  values: Record<string, ReactNode>,
): Array<string | ReactNode> =>
  text
    .replace(/\$\{([a-z0-9_$]+)\}/gi, '|||$1|||')
    .split('|||')
    .map((segment, i) =>
      i % 2 === 0
        ? segment
        : values[segment] != null
        ? values[segment]
        : '${' + segment + '}',
    )

export const interpolate = (
  text: string,
  values: Record<string, string | number>,
): string =>
  text.replace(/\$\{([a-z0-9_$]+)\}/gi, (marker, name) =>
    values[name] != null ? values[name] + '' : marker,
  )

// ---------------------------------------------------------------------------

export const isPlural = (n: number) => n % 10 !== 1 || n % 100 === 11

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

export type RegulationSearchKeys =
  | 'q'
  | 'rn'
  | 'year'
  | 'yearTo'
  | 'ch'
  | 'iA'
  | 'iR'
  | 'page'
export type RegulationSearchFilters = Record<RegulationSearchKeys, string>

// ---------------------------------------------------------------------------

export const useRegulationLinkResolver = () => {
  // const router = useRouter()
  const utils = useLinkResolver()

  return {
    // router,
    ...utils,

    linkToRegulation: (
      regulationName: RegName,
      props?:
        | { original: boolean }
        | { diff: boolean }
        | { d: ISODate; diff?: boolean }
        | { d: ISODate; diff: true; earlierDate: ISODate | 'original' }
        | { on: ISODate; diff?: boolean }
        | { on: ISODate; diff: true; earlierDate: ISODate | 'original' },
    ) => {
      const href = utils.linkResolver('regulation', [
        nameToSlug(regulationName),
      ]).href
      if (!props) {
        return href
      }
      if ('d' in props || 'on' in props) {
        const date = 'd' in props ? '/d/' + props.d : '/on/' + props.on
        const diff = props.diff ? '/diff' : ''
        const earlierDate =
          diff && 'earlierDate' in props ? '/' + props.earlierDate : ''
        return href + date + diff + earlierDate
      }
      if ('diff' in props && props.diff) {
        return href + '/diff'
      }
      if ('original' in props && props.original) {
        return href + '/original'
      }
      return href
    },

    // NOTE: It's doubtful we need this method, since the precense of
    // `Regulation.timelineDate` should be enough of an indicator.
    //
    // /** Returns true if the given url (default to the current asPath)
    //   * is a URL for viewing the current version of the regulation
    //   * **OR** a full diff from the original text
    //   */
    // isCurrentVersionUrl: (path?: string) => {
    //   path = path ?? router.asPath
    //   const linkType = utils.typeResolver(
    //     path.replace(/\/diff(?:$|[#?])/, ''),
    //   )?.type
    //   return linkType === 'regulation'
    // },

    linkToRegulationSearch: <Keys extends RegulationSearchKeys>(
      filters: Record<Keys, string>,
    ) =>
      utils.linkResolver('regulationshome').href +
      '?' +
      new URLSearchParams(filters).toString(),
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

// ---------------------------------------------------------------------------

const domid_prefix = '_' + /*@__PURE__*/ (Date.now() + '-').substr(6)
let domid_incr = 0

export default function domid() {
  return domid_prefix + domid_incr++
}

// ---------------------------------------------------------------------------

/** Returns a stable, unique ID string
 *
 * NOTE: it triggers harmless SSR hydration warnings in the browser,
 * but those can't be avoided beause of how React is currently designed.
 */
export const useDomid = (staticId?: string) => useState(staticId || domid)[0]

// ---------------------------------------------------------------------------

const DEFAULT_DURATION = 0
// TODO: Add function signtures allowing either zero args, or 2.

/** State variable that always snaps back to `undefined` after `duration` milliseconds. */
export const useShortState = <S>(
  /** Initial temporary state that then gets reverted back
   * to `undefined` after `duration` milliseconds
   * */
  initialState?: S | (() => S),

  /** Default duration, can be overridden on a case-by-case basis
   * by passing a custom duration to the `setState` function
   * */
  defaultDuration = DEFAULT_DURATION,
) => {
  const [state, _setState] = useState<S | undefined>(initialState)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>()

  const cancelTimeout = () => {
    timeout.current && clearTimeout(timeout.current)
  }

  const setState = useRef(
    (newState: S | (() => S), duration = defaultDuration) => {
      _setState(newState)
      cancelTimeout()
      timeout.current = setTimeout(() => {
        timeout.current = null
        _setState(undefined)
      }, duration)
    },
  ).current

  useEffect(() => {
    if (initialState !== undefined) {
      setState(initialState, defaultDuration)
    }
    return cancelTimeout
  }, [])

  return [state, setState] as const
}

// ---------------------------------------------------------------------------

export const useDateUtils = () => {
  const dateUtl = _useDateUtils()
  const formatDate = (isoDate: string) => {
    return dateUtl.format(new Date(isoDate), 'd. MMM yyyy')
  }
  return { formatDate }
}
