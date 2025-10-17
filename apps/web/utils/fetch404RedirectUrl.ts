import {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'

import { defaultLanguage } from '@island.is/shared/constants'
import { Locale } from '@island.is/shared/types'

import { GetUrlQuery, GetUrlQueryVariables } from '../graphql/schema'
import { linkResolver, LinkType } from '../hooks'
import { GET_URL_QUERY } from '../screens/queries'

export const fetch404RedirectUrl = async (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  path: string,
  locale: Locale,
): Promise<string | null> => {
  path = path.trim().replace(/\/\/+/g, '/').replace(/\/+$/, '').toLowerCase()

  const [redirectPropsWithQueryParams, redirectPropsWithoutQueryParams] =
    await Promise.all([
      apolloClient.query<GetUrlQuery, GetUrlQueryVariables>({
        query: GET_URL_QUERY,
        variables: {
          input: {
            slug: path,
            lang: locale,
          },
        },
      }),
      apolloClient.query<GetUrlQuery, GetUrlQueryVariables>({
        query: GET_URL_QUERY,
        variables: {
          input: {
            slug: path.split('?')[0],
            lang: locale,
          },
        },
      }),
    ])

  let redirectProps: ApolloQueryResult<GetUrlQuery> | null = null

  if (redirectPropsWithQueryParams?.data?.getUrl) {
    redirectProps = redirectPropsWithQueryParams
  } else if (redirectPropsWithoutQueryParams?.data?.getUrl) {
    redirectProps = redirectPropsWithoutQueryParams
  }

  if (redirectProps?.data?.getUrl) {
    const page = redirectProps.data.getUrl.page
    const explicitRedirect = redirectProps.data.getUrl.explicitRedirect
    if (!page && explicitRedirect) {
      return encodeURI(explicitRedirect)
    } else if (page) {
      let url = linkResolver(page.type as LinkType, [page.slug], locale).href

      if (!url) {
        // Fallback to using default language if page isn't present in another language
        url = linkResolver(
          page.type as LinkType,
          [page.slug],
          defaultLanguage,
        ).href
      }

      return encodeURI(url)
    }
  }

  return null
}
