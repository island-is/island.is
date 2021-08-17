import React from 'react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import './styles.css'
import Header from '../components/layout/header'
import ContentWrapper from '../components/layout/content-wrapper'
import UserProvider from '../components/util/UserProvider'

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider devLoggedIn>
      <Head>
        <title>Atvinnuleysisbætur</title>
      </Head>
      <ContentWrapper>
      <Header></Header>
        <Component {...pageProps} />
      </ContentWrapper>      
    </UserProvider>
  )
}

export default CustomApp
