import {
  exampleRegulation,
  exampleRegulationOriginalBody,
  regulationPageTexts,
  Regulation,
  RegulationHistoryItem,
  RegulationRedirect,
  exampleRegulationRedirect,
  RegulationPageTexts,
  ISODate,
} from './mockData'

import React from 'react'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
// import getConfig from 'next/config'
import { CustomNextError } from '@island.is/web/units/errors'
import { RegulationRedirectMessage } from './RegulationRedirectMessage'
import { RegulationDisplay } from './RegulationDisplay'
import { getParams } from './regulationUtils'
import { getUiTexts } from './getUITexts'
import {
  GetNamespaceQuery,
  GetRegulationOriginalQuery,
  QueryGetNamespaceArgs,
  QueryGetRegulationOriginalArgs,
} from '@island.is/web/graphql/schema'
import { GET_NAMESPACE_QUERY, GET_REGULATION_ORIGINAL_QUERY } from '../queries'

// const { publicRuntimeConfig } = getConfig()

// ---------------------------------------------------------------------------

type RegulationPageProps = {
  regulation: Regulation | RegulationRedirect
  originalBody?: string
  texts: RegulationPageTexts
}

const RegulationPage: Screen<RegulationPageProps> = (props) => {
  const { regulation, originalBody, texts } = props

  return 'redirectUrl' in regulation ? (
    <RegulationRedirectMessage texts={texts} regulation={regulation} />
  ) : (
    <RegulationDisplay
      texts={texts}
      regulation={regulation}
      originalBody={originalBody}
    />
  )
}

const viewTypes = {
  original: 1,
  diff: 1,
  d: 1,
}
type ViewType = 'current' | keyof typeof viewTypes

/** Throws if the slug doesn't roughly look like a valid regulation number
 *
 * Returns a fully zero-padded number.
 */
const assertNumber = (slug: string): string => {
  if (/\d{1,4}-\d{4}/.test(slug)) {
    return slug.length === 9 ? slug : ('000' + slug).substr(-9)
  }
  throw new CustomNextError(404)
}

const assertViewType = (viewType: string): ViewType => {
  if (!viewType || viewType in viewTypes) {
    return (viewType || 'curernt') as ViewType
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
    'number',
    'viewType',
    'date',
    'diff',
    'earlierDate',
  ])
  const number = assertNumber(p.number)
  const viewType = assertViewType(p.viewType)
  const date = assertDate(p.date, viewType)
  const isCustomDiff = date ? assertDiff(p.diff) : undefined
  const earlierDate = isCustomDiff
    ? assertEarlierDate(p.earlierDate, date)
    : undefined

  console.log('FOOBAR', {
    number,
    viewType,
    date,
    isCustomDiff,
    earlierDate,
  })

  const [texts, regulationOriginal] = await Promise.all([
    await getUiTexts<RegulationPageTexts>(
      apolloClient,
      locale,
      'Regulations_Viewer',
      regulationPageTexts,
    ),

    apolloClient.query<
      GetRegulationOriginalQuery,
      QueryGetRegulationOriginalArgs
    >({
      query: GET_REGULATION_ORIGINAL_QUERY,
      variables: {
        input: {
          regulationName: number,
        },
      },
    }),
  ])

  console.log({ texts, regulationOriginal })

  // FIXME: use apollo GQL api
  const redirect = Math.random() < 0.2

  return {
    regulation: redirect ? exampleRegulationRedirect : exampleRegulation,
    originalBody: redirect ? undefined : exampleRegulationOriginalBody,
    texts,
  }
}

export default withMainLayout(RegulationPage)
