import React from 'react'
import {
  GetUrlQuery,
  QueryGetUrlArgs,
  ErrorPageQuery,
  QueryGetErrorPageArgs,
} from '@island.is/web/graphql/schema'
import { GET_URL_QUERY, GET_ERROR_PAGE } from '@island.is/web/screens/queries'
import { ApolloClient } from '@apollo/client/core'
import { NormalizedCacheObject } from '@apollo/client/cache'
import ErrorScreen from '../screens/Error/Error'
import Layout, { LayoutProps } from '../layouts/main'
import I18n from '../i18n/I18n'
import { Locale } from '@island.is/shared/types'
import { withApollo } from '../graphql/withApollo'
import { linkResolver, LinkType } from '../hooks/useLinkResolver'
import { NextPageContext } from 'next'
import { getLocaleFromPath } from '../i18n/withLocale'

type ErrorPageProps = {
  statusCode: number
  locale: Locale
  layoutProps: LayoutProps
  errorPage: ErrorPageQuery['getErrorPage']
}

type ErrorPageInitialProps = {
  apolloClient: ApolloClient<NormalizedCacheObject>
  locale: string
} & NextPageContext

class ErrorPage extends React.Component<ErrorPageProps> {
  state = { renderError: false }

  static getDerivedStateFromError(_error: Error) {
    // This means we had an error rendering the error page - We'll attempt to
    // render again with a simpler version
    return { renderError: true }
  }

  render() {
    const { layoutProps, locale, statusCode, errorPage } = this.props
    const { renderError } = this.state

    if (layoutProps && !renderError) {
      // getDerivedStateFromError catches client-side render errors, but we need
      // try-catch for server-side rendering
      try {
        return (
          <I18n locale={locale} translations={layoutProps.namespace}>
            <Layout {...layoutProps}>
              <ErrorScreen errPage={errorPage} statusCode={statusCode} />
            </Layout>
          </I18n>
        )
        // eslint-disable-next-line no-empty
      } catch {}
    }

    // fallback to simpler version if we're unable to use the Layout for any reason
    return <ErrorScreen errPage={errorPage} statusCode={statusCode} />
  }

  static async getInitialProps(props: ErrorPageInitialProps) {
    const { err, res, asPath = '' } = props
    const statusCode = err?.statusCode ?? res?.statusCode ?? 500
    const locale = getLocaleFromPath(asPath)

    // check if we have a redirect condition
    if (statusCode === 404) {
      const path = asPath
        .trim()
        .replace(/\/\/+/g, '/')
        .replace(/\/+$/, '')
        .toLowerCase()

      const redirectProps = await getRedirectProps({
        path: path,
        apolloClient: props.apolloClient,
        locale,
      })

      if (redirectProps) {
        const { type, slug } = redirectProps

        // Found an URL content type that contained this
        // path (which has a page assigned to it) so we redirect to that page
        const url =
          type === 'explicitRedirect'
            ? slug
            : linkResolver(type as LinkType, [slug], locale).href
        if (!process.browser) {
          res.writeHead(302, { Location: url })
          res.end()
        } else {
          return (window.location.href = url)
        }
      }
    }

    if (err) {
      console.error(err)
    }

    // Set the actual http response code if rendering server-side
    if (res) {
      res.statusCode = statusCode
    }

    // we'll attempt to get the required data to display page, but if it goes wrong we'll
    // show a simplified error page without any header or footer
    let layoutProps: LayoutProps = null
    let pageProps: any = null
    try {
      layoutProps = await Layout.getInitialProps({ ...props, locale })
      pageProps = await getPageProps({
        apolloClient: props.apolloClient,
        locale,
        statusCode,
      })
      // eslint-disable-next-line no-empty
    } catch {}

    console.error(
      new Error(`_error.tsx getInitialProps missing data at path: ${asPath}`),
    )

    return {
      statusCode,
      locale,
      layoutProps,
      errorPage: pageProps,
    }
  }
}

export default withApollo(ErrorPage)

export interface RedirectProps {
  slug: string
  type: string
}

interface GetRedirectPropsProps {
  path: string
  apolloClient: ApolloClient<NormalizedCacheObject>
  locale: string
}

const getRedirectProps = async ({
  path,
  apolloClient,
  locale,
}: GetRedirectPropsProps) => {
  const { getUrl } = await apolloClient
    .query<GetUrlQuery, QueryGetUrlArgs>({
      query: GET_URL_QUERY,
      variables: {
        input: {
          slug: path,
          lang: locale as string,
        },
      },
    })
    .then((response) => response.data)

  if (!getUrl?.page && getUrl?.explicitRedirect) {
    return {
      slug: getUrl.explicitRedirect,
      type: 'explicitRedirect',
    }
  }

  return getUrl?.page ?? null
}

interface GetErrorPageProps {
  statusCode: number
  apolloClient: ApolloClient<NormalizedCacheObject>
  locale: string
}

const getPageProps = async ({
  statusCode,
  apolloClient,
  locale,
}: GetErrorPageProps) => {
  const { getErrorPage } = await apolloClient
    .query<ErrorPageQuery, QueryGetErrorPageArgs>({
      query: GET_ERROR_PAGE,
      variables: {
        input: {
          lang: locale as string,
          errorCode: statusCode.toString(),
        },
      },
    })
    .then((response) => response.data)

  return getErrorPage
}
