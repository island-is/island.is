import './app.css'

import React from 'react'
import { AppProps } from 'next/app'
import { ApolloProvider } from 'react-apollo'

import { client } from '../graphql'
import { MainLayout as Layout } from '../screens/Layouts'
import { appWithTranslation } from '../i18n'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  )
}

export default appWithTranslation(App)