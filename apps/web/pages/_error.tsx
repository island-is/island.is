import React from 'react'
import type { GetServerSidePropsContext, NextPageContext } from 'next'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import {
  ErrorPageQuery,
  ErrorPageQueryVariables,
  GetUrlQuery,
  GetUrlQueryVariables,
} from '../graphql/schema'
import Layout, { LayoutProps } from '../layouts/main'
import { ErrorScreen } from '../screens/Error'
import { getLocaleFromPath } from '../i18n'
import { GET_ERROR_PAGE, GET_URL_QUERY } from '../screens/queries'
import { LinkType, linkResolver } from '../hooks'
import withApollo from '../graphql/withApollo'
import I18n from '../i18n/I18n'

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

  static async getProps(props: ErrorPageInitialProps) {
    const { err, res, asPath = '' } = props
    const statusCode = err?.statusCode ?? res?.statusCode ?? 500
    const locale = getLocaleFromPath(asPath)

    if (statusCode === 404) {
      const path = asPath
        .trim()
        .replace(/\/\/+/g, '/')
        .replace(/\/+$/, '')
        .toLowerCase()

      const redirectProps = await props.apolloClient.query<
        GetUrlQuery,
        GetUrlQueryVariables
      >({
        query: GET_URL_QUERY,
        variables: {
          input: {
            slug: path,
            lang: locale as string,
          },
        },
      })

      if (redirectProps?.data?.getUrl) {
        const isBrowser = typeof window !== 'undefined'

        const page = redirectProps.data.getUrl.page
        const explicitRedirect = redirectProps.data.getUrl.explicitRedirect
        if (!page && explicitRedirect) {
          if (isBrowser) {
            window.location.href = explicitRedirect
          } else {
            res?.writeHead(302, { Location: explicitRedirect })
            res?.end()
          }
        } else if (page) {
          const url = linkResolver(page.type as LinkType, [page.slug]).href
          if (isBrowser) {
            window.location.href = url
          } else {
            res?.writeHead(302, { Location: url })
            res?.end()
          }
        }
      }
    }

    if (err) {
      console.error(err)
    }

    if (res) {
      res.statusCode = statusCode
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    let layoutProps: LayoutProps = null
    let pageProps: ErrorPageQuery['getErrorPage'] = null

    try {
      const [layoutPropsResponse, pagePropsResponse] = await Promise.all([
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        Layout.getProps({
          ...props,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          res: props.res,
          req: props.req as unknown as GetServerSidePropsContext['req'],
          locale,
        }),
        props.apolloClient.query<ErrorPageQuery, ErrorPageQueryVariables>({
          query: GET_ERROR_PAGE,
          variables: {
            input: {
              errorCode: statusCode?.toString() ?? '500',
              lang: locale,
            },
          },
        }),
      ])
      layoutProps = layoutPropsResponse
      pageProps = pagePropsResponse?.data?.getErrorPage
    } catch {
      console.error(
        new Error(`_error.tsx getInitialProps missing data at path: ${asPath}`),
      )
    }

    return {
      statusCode,
      locale,
      layoutProps,
      errorPage: pageProps,
    }
  }
}

const Screen = withApollo(ErrorPage)

const ScreenWithGetInitialProps: typeof Screen & {
  getInitialProps?: typeof Screen.getProps
} = Screen

ScreenWithGetInitialProps.getInitialProps = Screen.getProps

export default ScreenWithGetInitialProps
