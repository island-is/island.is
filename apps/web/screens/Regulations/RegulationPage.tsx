import {
  ISODate,
  prettyName,
  RegQueryName,
  Regulation,
  RegulationDiff,
  RegulationRedirect,
} from '@island.is/regulations'
import {
  RegulationOriginalDates,
  RegulationViewTypes,
} from '@island.is/regulations/web'
import { RegulationPageTexts } from '../../components/Regulations/RegulationTexts.types'

import React from 'react'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'
import { RegulationRedirectMessage } from '../../components/Regulations/RegulationRedirectMessage'
import { RegulationDisplay } from '../../components/Regulations/RegulationDisplay'
import { getUiTexts } from '../../components/Regulations/getUiTexts'
import {
  GetRegulationQuery,
  QueryGetRegulationArgs,
  RegulationViewTypes as Schema_RegulationViewTypes,
} from '@island.is/web/graphql/schema'
import { GET_REGULATION_QUERY } from '../queries'
import { Text } from '@island.is/island-ui/core'
import { HeadWithSocialSharing } from '@island.is/web/components'
import { safelyExtractPathnameFromUrl } from '@island.is/web/utils/safelyExtractPathnameFromUrl'

// ---------------------------------------------------------------------------

type RegulationPageProps =
  | {
      regulation: Regulation | RegulationDiff | RegulationRedirect
      texts: RegulationPageTexts
      nonCurrent: boolean
      urlDate?: ISODate
    }
  | { redirect: string }

const RegulationPage: Screen<RegulationPageProps> = (props) => {
  if ('redirect' in props) {
    return (
      <div>
        <meta httpEquiv="refresh" content={`0;url=${props.redirect}`} />
        <Text as="p" marginY={6}>
          <strong>Sæki PDF skrá</strong>
        </Text>
      </div>
    )
  }

  const { regulation, texts, nonCurrent, urlDate } = props

  const title = prettyName(regulation.name) + ' – ' + regulation.title
  const robotsDirective =
    'redirectUrl' in regulation ? 'noindex' : nonCurrent && 'noindex, nofollow'

  return (
    <>
      <HeadWithSocialSharing title={title} description=" ">
        {robotsDirective && <meta name="robots" content={robotsDirective} />}
      </HeadWithSocialSharing>

      {'redirectUrl' in regulation ? (
        <RegulationRedirectMessage texts={texts} regulation={regulation} />
      ) : (
        <RegulationDisplay
          texts={texts}
          regulation={regulation}
          urlDate={urlDate}
        />
      )}
    </>
  )
}

// ---------------------------------------------------------------------------

const viewTypeParams = {
  /*+ renders the current regulation text - This is the deafult view type. */
  current: 1,
  /** renders the original regulation text - same as /d/%{original.publicationDate} */
  original: 1,
  /** renders the diff between original and current */
  diff: 1,
  /** renders the regulation text as it was on a given date.
   * Accepts diff and diff/earlierDate suffixes
   *
   * Dates that don't match up with any date in the regulation's change-history
   * may result in a redirect to the actual change-history date. (??)
   */
  d: 1,
  /** Same as `d` above, except that its intended for explicit permalinks
   * and never results in a "corrective" redirect
   */
  on: 1,
}
type ViewTypeParam = keyof typeof viewTypeParams

const reRegQueryNameFlex = /^\d{1,4}-\d{4}$/

/** Throws if the slug doesn't roughly look like a valid regulation number
 *
 * Returns a fully zero-padded number.
 */
const assertRegQueryName = (slug: string): RegQueryName => {
  if (reRegQueryNameFlex.test(slug)) {
    return (
      slug.length === 9 ? slug : ('000' + slug).substr(-9)
    ) as RegQueryName
  }
  throw new CustomNextError(404)
}

const assertViewType = (viewType: string): ViewTypeParam => {
  if (!viewType || viewType in viewTypeParams) {
    return (viewType || 'current') as ViewTypeParam
  }
  throw new CustomNextError(404)
}

const assertDiff = (diff: string): true | undefined => {
  if (!diff || diff === 'diff') {
    return diff === 'diff' || undefined
  }
  throw new CustomNextError(404)
}

const smellsLikeISODate = (maybeISODate: string): boolean =>
  /^\d{4}-\d{2}-\d{2}$/.test(maybeISODate)

const assertDate = (
  maybeISODate: string,
  viewType?: RegulationViewTypes,
): ISODate | undefined => {
  if (viewType === undefined || viewType === 'd') {
    if (smellsLikeISODate(maybeISODate)) {
      const date = new Date(maybeISODate).toISOString().substr(0, 10) as ISODate
      if (date === maybeISODate) {
        return date
      }
    }
  } else {
    if (!maybeISODate) {
      return undefined
    }
  }
  throw new CustomNextError(404)
}

const assertEarlierDate = (
  maybeISODate: string,
  date: ISODate | undefined,
): ISODate | RegulationOriginalDates.gqlHack | undefined => {
  if (date) {
    if (maybeISODate === RegulationOriginalDates.api) {
      return RegulationOriginalDates.gqlHack
    }
    const baseDate = maybeISODate ? assertDate(maybeISODate) : undefined
    if (!baseDate || baseDate <= date) {
      return baseDate
    }
  }
  throw new CustomNextError(404)
}

// ---------------------------------------------------------------------------

RegulationPage.getProps = async ({ apolloClient, locale, query, res, req }) => {
  const asPath = safelyExtractPathnameFromUrl(req.url)

  const params = query.params as Partial<Array<string>>
  const isPdf = params[params.length - 1] === 'pdf'
  if (isPdf) {
    params.pop()
  }
  const p = {
    name: params[0] || '',
    viewType: params[1] || '',
    date: params[2] || '',
    diff: params[3] || '',
    earlierDate: params[4] || '',
  }

  const name = assertRegQueryName(p.name)
  const viewTypeParam = assertViewType(p.viewType)
  // FIXME: This assertion is technically unsafe but will do until we either stop using
  // an enum, or refactor it into a standalone, shared regulations-types library
  const viewType = (viewTypeParam === 'on' ? 'd' : viewTypeParam) as
    | RegulationViewTypes
    | undefined // Ugh, enums are pain.
  const date = assertDate(p.date, viewType)
  const isCustomDiff = date ? assertDiff(p.diff) : undefined
  const earlierDate = isCustomDiff
    ? assertEarlierDate(p.earlierDate, date)
    : undefined

  if (!name || !viewType) {
    throw new CustomNextError(404)
  }

  if (name !== p.name) {
    const nameRe = new RegExp(`/nr/${p.name}(?:/|$)`)
    const currentUrl = asPath || '/reglugerdir'
    const redirectUrl = currentUrl.replace(nameRe, `/nr/${name}/`)
    if (res) {
      res.writeHead(301, { Location: redirectUrl })
      res.end()
    }
    return {
      redirect: redirectUrl,
    }
  }

  const [texts, regulation] = await Promise.all([
    getUiTexts<RegulationPageTexts>(apolloClient, locale, 'Regulations_Viewer'),
    apolloClient
      .query<GetRegulationQuery, QueryGetRegulationArgs>({
        query: GET_REGULATION_QUERY,
        variables: {
          input: {
            viewType: viewType as unknown as Schema_RegulationViewTypes,
            name,
            date,
            isCustomDiff,
            earlierDate,
          },
        },
      })
      .then(
        (res) =>
          res.data?.getRegulation as
            | Regulation
            | RegulationDiff
            | RegulationRedirect
            | undefined,
      ),
  ])

  if (!regulation) {
    throw new CustomNextError(404, 'Þessi reglugerð finnst ekki!')
  }

  const nonCurrent = viewType !== RegulationViewTypes.current

  if (res && nonCurrent) {
    //  !('redirectUrl' in regulation) && (regulation.timelineDate || regulation.showingDiff)
    res.setHeader('X-Robots-Tag', 'noindex, nofollow')
  }

  if (isPdf) {
    const pdfUrl =
      'redirectUrl' in regulation
        ? regulation.originalDoc
        : regulation.pdfVersion

    if (!pdfUrl) {
      throw new CustomNextError(
        404,
        'Þessi reglugerð á ekki PDF útgáfu (ennþá)',
      )
    }
    if (res) {
      res.writeHead(307, { Location: pdfUrl })
      res.end()
    }
    return {
      redirect: pdfUrl,
    }
  }

  // TODO: Consider then comparing `date` and `regulation.effectiveDate`
  // if `viewType === "d"` ... and if they differ then redirect
  // the browser to `/d/${regulation.effectiveDate}/etc...`
  //
  // This would be more in line with the intended difference between
  // viewTypes `"d"` and `"on"`

  // TODO: Consider adding the same validation + redirect behavior
  // for `earlierDate`s

  const urlDate = viewTypeParam === 'on' ? date : undefined

  return {
    regulation,
    texts,
    urlDate,
    nonCurrent,
  }
}

export default withMainLayout(RegulationPage)
