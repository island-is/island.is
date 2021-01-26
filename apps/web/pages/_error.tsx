import React from 'react'
import * as Sentry from '@sentry/node'
import { GetUrlQuery, QueryGetUrlArgs } from '@island.is/web/graphql/schema'
import { GET_URL_QUERY } from '@island.is/web/screens/queries'
import { ApolloClient } from '@apollo/client/core'
import { NormalizedCacheObject } from '@apollo/client/cache'
import ErrorScreen from '../screens/Error/Error'
import Layout, { LayoutProps } from '../layouts/main'
import I18n, { Locale } from '../i18n/I18n'
import { withApollo } from '../graphql/withApollo'
import { linkResolver, LinkType, typeResolver } from '../hooks/useLinkResolver'
import { NextPageContext } from 'next'

type ErrorPageProps = {
  statusCode: number
  locale: Locale
  layoutProps: LayoutProps
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
    const { layoutProps, locale, statusCode } = this.props
    const { renderError } = this.state

    if (layoutProps && !renderError) {
      // getDerivedStateFromError catches client-side render errors, but we need
      // try-catch for server-side rendering
      try {
        return (
          <I18n locale={locale} translations={layoutProps.namespace}>
            <Layout {...layoutProps}>
              <ErrorScreen statusCode={statusCode} />
            </Layout>
          </I18n>
        )
        // eslint-disable-next-line no-empty
      } catch {}
    }

    // fallback to simpler version if we're unable to use the Layout for any reason
    return <ErrorScreen statusCode={statusCode} />
  }

  static async getInitialProps(props: ErrorPageInitialProps) {
    const { err, res, asPath = '' } = props
    const statusCode = err?.statusCode ?? res?.statusCode ?? 500
    const { locale } = typeResolver(asPath)

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
        const url = linkResolver(type as LinkType, [slug], locale)
        if (!process.browser) {
          res.writeHead(302, { Location: url })
          res.end()
        } else {
          return (window.location.href = url)
        }
      }
    }

    if (err) {
      Sentry.withScope((scope) => {
        Object.keys(err).forEach((key) => {
          scope.setExtra(key, err[key])
        })

        Sentry.captureException(err)
      })

      await Sentry.flush(2000)
    }

    // Set the actual http response code if rendering server-side
    if (res) {
      res.statusCode = statusCode
    }

    // we'll attempt to use the layout component, but if it goes wrong we'll
    // show a simplified error page without any header or footer
    let layoutProps: LayoutProps = null
    try {
      layoutProps = await Layout.getInitialProps({ ...props, locale })
      // eslint-disable-next-line no-empty
    } catch {}

    Sentry.captureException(
      new Error(`_error.tsx getInitialProps missing data at path: ${asPath}`),
    )

    await Sentry.flush(2000)

    return { statusCode, locale, layoutProps }
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
}: GetRedirectPropsProps): Promise<RedirectProps | null> => {
  const {
    data: { getUrl },
  } = await apolloClient.query<GetUrlQuery, QueryGetUrlArgs>({
    query: GET_URL_QUERY,
    variables: {
      input: {
        lang: locale as string,
        slug: path,
      },
    },
  })

  return getUrl?.page ?? null
}
