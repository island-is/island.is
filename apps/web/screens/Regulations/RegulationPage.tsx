import {
  Regulation,
  RegulationRedirect,
  ISODate,
  RegName,
} from './Regulations.types'
import { RegulationPageTexts } from './Regulations.mock'

import React from 'react'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
import getConfig from 'next/config'
import { CustomNextError } from '@island.is/web/units/errors'
import { RegulationRedirectMessage } from './RegulationRedirectMessage'
import { RegulationDisplay } from './RegulationDisplay'
import { getParams } from './regulationUtils'
import { getUiTexts } from './getUiTexts'
import {
  GetRegulationQuery,
  QueryGetRegulationArgs,
} from '@island.is/web/graphql/schema'
import { GET_REGULATION_QUERY } from '../queries'

const { publicRuntimeConfig } = getConfig()

// ---------------------------------------------------------------------------

type RegulationPageProps = {
  regulation: Regulation | RegulationRedirect
  texts: RegulationPageTexts
  urlDate?: ISODate
}

const RegulationPage: Screen<RegulationPageProps> = (props) => {
  const { disableRegulationsPage: disablePage } = publicRuntimeConfig
  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }

  const { regulation, texts, urlDate } = props

  return 'redirectUrl' in regulation ? (
    <RegulationRedirectMessage texts={texts} regulation={regulation} />
  ) : (
    <RegulationDisplay
      texts={texts}
      regulation={regulation}
      urlDate={urlDate}
    />
  )
}

const viewTypes = {
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
export type ViewType = keyof typeof viewTypes

/** Throws if the slug doesn't roughly look like a valid regulation number
 *
 * Returns a fully zero-padded number.
 */
const assertName = (slug: string): RegName => {
  if (/\d{1,4}-\d{4}/.test(slug)) {
    return (slug.length === 9 ? slug : ('000' + slug).substr(-9)) as RegName
  }
  throw new CustomNextError(404)
}

const assertViewType = (viewType: string): ViewType => {
  if (!viewType || viewType in viewTypes) {
    return (viewType || 'current') as ViewType
  }
  throw new CustomNextError(404)
}

const assertDiff = (diff: string): true | undefined => {
  if (!diff || diff === 'diff') {
    return diff === 'diff' || undefined
  }
  throw new CustomNextError(404)
}

const isISODate = (maybeISODate: string): boolean =>
  /\d{4}-\d{2}-\d{2}/.test(maybeISODate)

const assertDate = (
  maybeISODate: string,
  viewType?: ViewType,
): ISODate | undefined => {
  if (viewType === undefined || viewType === 'd') {
    if (isISODate(maybeISODate)) {
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
): 'original' | ISODate | undefined => {
  if (date) {
    if (maybeISODate === 'original') {
      return 'original'
    }
    const baseDate = maybeISODate ? assertDate(maybeISODate) : undefined
    if (!baseDate || baseDate <= date) {
      return baseDate
    }
  }
  throw new CustomNextError(404)
}

RegulationPage.getInitialProps = async ({ apolloClient, locale, query }) => {
  const p = getParams(query, [
    'name',
    'viewType',
    'date',
    'diff',
    'earlierDate',
  ])
  const name = assertName(p.name)
  const viewType = assertViewType(p.viewType)
  const date = assertDate(p.date, viewType)
  const isCustomDiff = date ? assertDiff(p.diff) : undefined
  const earlierDate = isCustomDiff
    ? assertEarlierDate(p.earlierDate, date)
    : undefined

  const [texts, regulation] = await Promise.all([
    await getUiTexts<RegulationPageTexts>(
      apolloClient,
      locale,
      'Regulations_Viewer',
    ),

    apolloClient
      .query<GetRegulationQuery, QueryGetRegulationArgs>({
        query: GET_REGULATION_QUERY,
        variables: {
          input: {
            viewType: viewType === 'on' ? 'd' : viewType,
            name,
            date,
            isCustomDiff,
          },
        },
      })
      .then(
        (res) =>
          res.data?.getRegulation as
            | Regulation
            | RegulationRedirect
            | undefined,
      ),
  ])

  if (!regulation) {
    throw new CustomNextError(404, 'Þessi reglugerð finnst ekki!')
  }

  // TODO: Consider then comparing `date` and `regulation.effectiveDate`
  // if `viewType === "d"` ... and if they differ then redirect
  // the browser to `/d/${regulation.effectiveDate}/etc...`
  //
  // This would be more in line with the intended difference between
  // viewTypes `"d"` and `"on"`

  const urlDate = viewType === 'on' ? date : undefined

  return {
    regulation,
    texts,
    urlDate,
  }
}

export default withMainLayout(RegulationPage)
