import App, { AppContext, AppProps } from 'next/app'
import Head from 'next/head'
import { FC } from 'react'

const Layout: FC = ({ children }) => {
  return (
    <div>
      <Head>
        <title>Samradsgatt</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        ></link>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        ></link>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        ></link>
        <link rel="manifest" href="/site.webmanifest"></link>
        <link rel="shortcut icon" href="/favicon.ico" />
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
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </>
    )
  }
}

export default ConsultationPortalApplication
