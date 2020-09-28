import React from 'react'
import { NextPageContext } from 'next'
import { ApolloProvider } from 'react-apollo'
import initApollo from './client'

export const withApollo = (Component) => {
  const NewComponent = ({ apolloState, pageProps }) => {
    return (
      <ApolloProvider client={initApollo(apolloState)}>
        <Component {...pageProps} />
      </ApolloProvider>
    )
  }

  NewComponent.getInitialProps = async (ctx: NextPageContext) => {
    const apolloClient = initApollo({})
    const newContext = { ...ctx, apolloClient }
    const props = Component.getInitialProps
      ? await Component.getInitialProps(newContext)
      : {}
    const cache = apolloClient.cache.extract()
    return {
      pageProps: props,
      apolloState: cache,
    }
  }

  return NewComponent
}

export default withApollo
