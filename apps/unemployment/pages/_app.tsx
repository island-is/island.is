import React from 'react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { ReactComponent as NxLogo } from '../public/nx-logo-white.svg'
import './styles.css'
import Header from '../components/layout/header'
import UserProvider from '../components/util/UserProvider'
import ServicesProvider from '../components/util/ServicesProvider'

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider devLoggedIn>
      <ServicesProvider>
        <Head>
          <title>Welcome to unemployment!</title>
        </Head>
        <div className="app">
          <Header />
          <main>
            <Component {...pageProps} />
            <div>Hér er header</div>
          </main>
        </div>
      </ServicesProvider>
    </UserProvider>
  )
}

export default CustomApp
