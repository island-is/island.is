import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useDateUtils as _useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { ISODate, RegName, nameToSlug } from '@island.is/regulations'

export type RegulationSearchKey =
  | 'q'
  | 'rn'
  | 'year'
  | 'yearTo'
  | 'ch'
  | 'iA'
  | 'iR'
  | 'page'
export type RegulationSearchFilters = Record<RegulationSearchKey, string>

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
          props.diff && 'earlierDate' in props ? '/' + props.earlierDate : ''
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

    linkToRegulationSearch: <Keys extends RegulationSearchKey>(
      filters: Record<Keys, string>,
    ) =>
      utils.linkResolver('regulationshome').href +
      '?' +
      new URLSearchParams(filters).toString(),
  }
}

// ---------------------------------------------------------------------------

export const useDateUtils = () => {
  const dateUtl = _useDateUtils()
  const formatDate = (isoDate: string) => {
    return dateUtl.format(new Date(isoDate), 'd. MMM yyyy')
  }
  return { formatDate }
}
