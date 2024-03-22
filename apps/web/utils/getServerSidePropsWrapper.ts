import type { GetServerSideProps } from 'next'
import { ApolloQueryResult, NormalizedCacheObject } from '@apollo/client'

import { logger } from '@island.is/logging'
import { defaultLanguage } from '@island.is/shared/constants'
import initApollo from '../graphql/client'
import { GetUrlQuery, GetUrlQueryVariables } from '../graphql/schema'
import { linkResolver, LinkType } from '../hooks'
import { getLocaleFromPath } from '../i18n'
import { GET_URL_QUERY } from '../screens/queries'
import type { ScreenContext } from '../types'
import { CustomNextError } from '../units/errors'
import { safelyExtractPathnameFromUrl } from './safelyExtractPathnameFromUrl'

// Taken from here: https://github.com/vercel/next.js/discussions/11209#discussioncomment-38480
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deleteUndefined = (obj: Record<string, any> | undefined): void => {
  if (obj) {
    Object.keys(obj).forEach((key: string) => {
      if (obj[key] && typeof obj[key] === 'object') {
        deleteUndefined(obj[key])
      } else if (typeof obj[key] === 'undefined') {
        delete obj[key] // eslint-disable-line no-param-reassign
      }
    })
  }
}

type Component = {
  ({
    apolloState,
    pageProps,
  }: {
    apolloState: unknown
    pageProps: unknown
  }): JSX.Element
  getProps(ctx: Partial<ScreenContext>): Promise<{
    pageProps: unknown
    apolloState: NormalizedCacheObject
  }>
}

export const getServerSidePropsWrapper: (
  screen: Component,
) => GetServerSideProps = (screen) => async (ctx) => {
  try {
    const props = screen.getProps ? await screen.getProps(ctx) : ctx
    deleteUndefined(props)
    return {
      props,
    }
  } catch (error) {
    if (error instanceof CustomNextError) {
      if (error.statusCode === 404) {
        logger.info(error.title || '404 error occurred on web', error)

        let path = safelyExtractPathnameFromUrl(ctx.req.url)
        if (!path) {
          return {
            notFound: true,
          }
        }

        const clientLocale = getLocaleFromPath(path)

        const apolloClient = initApollo({}, clientLocale, ctx)

        path = path
          .trim()
          .replace(/\/\/+/g, '/')
          .replace(/\/+$/, '')
          .toLowerCase()

        const [redirectPropsWithQueryParams, redirectPropsWithoutQueryParams] =
          await Promise.all([
            apolloClient.query<GetUrlQuery, GetUrlQueryVariables>({
              query: GET_URL_QUERY,
              variables: {
                input: {
                  slug: path,
                  lang: clientLocale,
                },
              },
            }),
            apolloClient.query<GetUrlQuery, GetUrlQueryVariables>({
              query: GET_URL_QUERY,
              variables: {
                input: {
                  slug: path.split('?')[0],
                  lang: clientLocale,
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
            return {
              redirect: {
                destination: explicitRedirect,
                permanent: false,
              },
            }
          } else if (page) {
            let url = linkResolver(
              page.type as LinkType,
              [page.slug],
              clientLocale,
            ).href

            if (!url) {
              // Fallback to using default language if page isn't present in another language
              url = linkResolver(
                page.type as LinkType,
                [page.slug],
                defaultLanguage,
              ).href
            }

            return {
              redirect: {
                destination: url,
                permanent: false,
              },
            }
          }
        }

        return {
          notFound: true,
        }
      }
    }
    throw error
  }
}
