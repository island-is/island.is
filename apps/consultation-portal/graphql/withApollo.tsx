import React from 'react'
import { useRouter } from 'next/router'
import { NextPageContext } from 'next'
import { ApolloProvider } from '@apollo/client/react'
import initApollo from './client'

export const withApollo = (Component) => {
  const NewComponent = ({ apolloState, pageProps }) => {
    const { asPath } = useRouter()
    return (
      <ApolloProvider client={initApollo({ ...apolloState })}>
        <Component {...pageProps} />
      </ApolloProvider>
    )
  }
  return NewComponent
}
export const getServerSideProps = async (ctx, Component) => {
  const apolloClient = initApollo({})
  const newContext = { ...ctx, apolloClient }
  const props = Component.getInitialProps
    ? await Component.getInitialProps(newContext)
    : {}
  const cache = apolloClient.cache.extract()
  return {
    pageProps: props,
    apolloState: cache,
    apolloClient,
  }
}

export default withApollo
