import React from 'react'
import ErrorScreen from '../screens/Error/Error'
import { getLocaleFromPath } from '../i18n/withLocale'
import Layout, { LayoutProps } from '../layouts/main'
import I18n, { Locale } from '../i18n/I18n'
import { withApollo } from '../graphql/withApollo'

import {
  Article,
  LifeEventPage,
  News,
  GetUrlQuery,
  QueryGetUrlArgs,
} from '@island.is/web/graphql/schema'
import { GET_URL_QUERY } from '@island.is/web/screens/queries'
import ApolloClient from 'apollo-client'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { NextPageContext } from 'next'
import routeNames, { PathTypes } from '../i18n/routeNames'

type ErrorPageProps = {
  statusCode: number
  locale: Locale
  layoutProps: LayoutProps
}

class ErrorPage extends React.Component<ErrorPageProps> {
  state = { renderError: false }

  static getDerivedStateFromError(_error: Error) {
    // This means we had an error rendering the error page - We'll attempt to
    // render again with a simpler version
    return { renderError: true }
  }

  render() {
    if (this.props.layoutProps && !this.state.renderError) {
      // getDerivedStateFromError catches client-side render errors, but we need
      // try-catch for server-side rendering
      try {
        return (
          <I18n
            locale={this.props.locale}
            translations={this.props.layoutProps.namespace}
          >
            <Layout {...this.props.layoutProps}>
              <ErrorScreen statusCode={this.props.statusCode} />
            </Layout>
          </I18n>
        )
        // eslint-disable-next-line no-empty
      } catch {}
    }

    // fallback to simpler version if we're unable to use the Layout for any reason
    return <ErrorScreen statusCode={this.props.statusCode} />
  }

  static async getInitialProps(props /*: NextPageContext*/) {
    const { err, res, asPath = '' } = props
    const statusCode = err?.statusCode ?? res?.statusCode ?? 500
    const locale = getLocaleFromPath(asPath)

    if (!asPath.startsWith('/_next') && statusCode === 404) {
      const path = asPath
        .trim()
        .replace(/\/\/+/g, '/')
        .replace(/\/+$/, '')
        .toLowerCase()

      const redirectProps = await getRedirectProps({
        path,
        apolloClient: props.apolloClient,
        locale,
      })

      if (redirectProps) {
        const { makePath } = routeNames(locale)

        const { pageType, page } = redirectProps

        // Found an URL content type that contained this
        // path (which has a page assigned to it) so we redirect to that page
        if (pageType && page) {
          const url = makePath(pageType as PathTypes, page.slug)

          if (!process.browser) {
            res.writeHead(302, { Location: url })
            res.end()
          } else {
            return (window.location.href = url)
          }
        }
      }
    }

    // TODO: Next-js takes care of calling this function for any error that
    // occurs anywhere in the application, so this would probably be an ideal
    // place to add some error logging

    // Set the actual http resopnse code if rendering server-side
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

    return { statusCode, locale, layoutProps }
  }
}

export default withApollo(ErrorPage)

export interface RedirectProps {
  pageType: string
  page:
    | Pick<Article, 'slug'>
    | Pick<Article, 'slug'>
    | Pick<News, 'slug'>
    | Pick<LifeEventPage, 'slug'>
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
  } = await apolloClient
    .query<GetUrlQuery, QueryGetUrlArgs>({
      query: GET_URL_QUERY,
      variables: {
        input: {
          slug: path,
          lang: locale as string,
        },
      },
    })
    .then((r) => r)

  const pageType = getUrl?.page?.__typename ?? null

  if (!pageType) {
    return null
  }

  return {
    pageType,
    page: getUrl.page,
  }
}
