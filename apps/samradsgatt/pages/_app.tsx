import App, { AppContext, AppProps } from 'next/app'
import Head from 'next/head'
import { FC } from 'react'
import { client } from '../graphql'
import { ApolloProvider } from '@apollo/client'

const Layout: FC = ({ children }) => {
  return (
    <div>
      <Head>
        <title>Ísland.is</title>
      </Head>
      {children}
    </div>
  )
}

class ConsultationPortalApplication extends App<AppProps> {
  static async getInitialProps(appContext: AppContext) {
    const pageProps = await App.getInitialProps(appContext)
    return { ...pageProps }
  }
  render() {
    const { Component, pageProps } = this.props

    return (
      <>
        <ApolloProvider client={client}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ApolloProvider>
      </>
    )
  }
}

export default ConsultationPortalApplication
