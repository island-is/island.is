import { NextComponentType } from 'next'
import initApollo from './client'
import { BaseContext, NextPageContext } from 'next/dist/shared/lib/utils'

export const withApollo = <
  C extends BaseContext = NextPageContext,
  IP = {},
  P = {},
>(
  Component: NextComponentType<C, IP, P>,
): NextComponentType<C, IP> => {
  const getInitialProps = Component.getInitialProps
  if (!getInitialProps) {
    return Component
  }

  Component.getInitialProps = async (ctx) => {
    const apolloClient = initApollo({})
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
