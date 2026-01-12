import React from 'react'
import { useRouter } from 'next/router'
import { ApolloProvider } from '@apollo/client/react'

import { getLocaleFromPath } from '@island.is/web/i18n/withLocale'

import { ScreenContext } from '../types'
import { safelyExtractPathnameFromUrl } from '../utils/safelyExtractPathnameFromUrl'
import initApollo from './client'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
export const withApollo = (Component) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const NewComponent = ({ apolloState, pageProps }) => {
    const { asPath } = useRouter()
    const clientLocale = getLocaleFromPath(asPath)
    return (
      <ApolloProvider client={initApollo({ ...apolloState }, clientLocale)}>
        <Component {...pageProps} />
      </ApolloProvider>
    )
  }

  NewComponent.getProps = async (ctx: Partial<ScreenContext>) => {
    const clientLocale = getLocaleFromPath(
      safelyExtractPathnameFromUrl(ctx.req?.url),
    )
    const apolloClient = initApollo({}, clientLocale, ctx)
    const newContext = { ...ctx, apolloClient }
    const props = Component.getProps ? await Component.getProps(newContext) : {}
    const cache = apolloClient.cache.extract()
    return {
      pageProps: props,
      apolloState: cache,
    }
  }

  return NewComponent
}

export default withApollo
