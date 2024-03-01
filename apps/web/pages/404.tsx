import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
  useQuery,
} from '@apollo/client'

import { Box } from '@island.is/island-ui/core'
import {
  ErrorPageQuery,
  GetUrlQuery,
  QueryGetErrorPageArgs,
  QueryGetUrlArgs,
} from '@island.is/web/graphql/schema'
import { LinkType, useLinkResolver } from '@island.is/web/hooks'
import { getLocaleFromPath } from '@island.is/web/i18n'
import I18n from '@island.is/web/i18n/I18n'
import Layout, { LayoutProps } from '@island.is/web/layouts/main'

import withApollo from '../graphql/withApollo'
import { ErrorScreen } from '../screens/Error'
import { GET_ERROR_PAGE, GET_URL_QUERY } from '../screens/queries'

const STATUS_CODE = 404

const NotFoundPage: React.FC = () => {
  const { asPath, replace, query } = useRouter()
  const activeLocale = getLocaleFromPath(asPath)
  const isRedirecting = useRef(false)
  const { linkResolver } = useLinkResolver()
  const [layoutProps, setLayoutProps] = useState<LayoutProps | null>(null)

  const apolloClient = useApolloClient()

  const { data: urlData, loading: urlDataLoading } = useQuery<
    GetUrlQuery,
    QueryGetUrlArgs
  >(GET_URL_QUERY, {
    variables: {
      input: {
        slug: asPath,
        lang: activeLocale,
      },
    },
  })

  const { data: errorPageData, loading: errorPageDataLoading } = useQuery<
    ErrorPageQuery,
    QueryGetErrorPageArgs
  >(GET_ERROR_PAGE, {
    variables: {
      input: {
        lang: activeLocale,
        errorCode: STATUS_CODE.toString(),
      },
    },
  })

  // Temporary "fix", see https://github.com/vercel/next.js/issues/16931 for details
  useEffect(() => {
    const els = document.querySelectorAll('link[href*=".css"]')
    Array.prototype.forEach.call(els, (el) => {
      el.setAttribute('rel', 'stylesheet')
    })
  }, [])

  useEffect(() => {
    if (!activeLocale || !apolloClient) {
      return
    }

    Layout.getProps?.({
      apolloClient: apolloClient as ApolloClient<NormalizedCacheObject>,
      locale: activeLocale,
      query,
      req: undefined,
      res: undefined,
    }).then((props) => setLayoutProps(props))
  }, [activeLocale, apolloClient, query])

  if (STATUS_CODE === 404) {
    if (urlDataLoading) {
      return null
    }

    if (urlData?.getUrl) {
      const page = urlData.getUrl?.page
      const explicitRedirect = urlData.getUrl?.explicitRedirect

      if (!page && explicitRedirect) {
        if (!isRedirecting.current) {
          isRedirecting.current = true
          replace(explicitRedirect)
        }
      } else if (page) {
        if (!isRedirecting.current) {
          isRedirecting.current = true

          replace(linkResolver(page.type as LinkType, [page.slug]).href)
        }
      }

      if (isRedirecting.current) {
        return null
      }
    }
  }

  const Wrapper = layoutProps ? Layout : Box

  return (
    <I18n locale={activeLocale} translations={layoutProps?.namespace ?? {}}>
      <Wrapper {...layoutProps}>
        asdf
        {!errorPageDataLoading && (
          <ErrorScreen
            statusCode={STATUS_CODE}
            errPage={errorPageData?.getErrorPage}
          />
        )}
      </Wrapper>
    </I18n>
  )
}

export default withApollo(() => <NotFoundPage />)
