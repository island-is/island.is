import { NextComponentType } from 'next'
import { BaseContext, NextPageContext } from 'next/dist/next-server/lib/utils'

import initApollo from './client'

export const withApollo = <
  C extends BaseContext = NextPageContext,
  IP = {},
  P = {}
>(
  Component: NextComponentType<C, IP, P>,
): NextComponentType<C, IP> => {
  const getInitialProps = Component.getInitialProps
  if (!getInitialProps) {
    return Component
  }

  Component.getInitialProps = async (ctx) => {
    const apolloClient = initApollo({}, ctx)
    const newContext = Object.assign({}, ctx, { apolloClient })
    const props = await getInitialProps(newContext)
    const cache = apolloClient.cache.extract()

    return {
      ...props,
      apolloState: cache,
    }
  }

  return Component
}
