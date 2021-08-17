import React from 'react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import './styles.css'
import Header from '../components/layout/header'
import ContentWrapper from '../components/layout/content-wrapper'
import UserProvider from '../components/util/UserProvider'
import ServicesProvider from '../components/util/ServicesProvider'

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider devLoggedIn>
      <ServicesProvider>
        <Head>
          <title>Atvinnuleysisbætur</title>
        </Head>
        <ContentWrapper>
          <Header></Header>
          <Component {...pageProps} />
        </ContentWrapper>
      </ServicesProvider>
    </UserProvider>
  )
}

export default CustomApp
