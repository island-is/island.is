import React from 'react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import './styles.css'
import Header from '../components/layout/header'
import ContentWrapper from '../components/layout/content-wrapper'
import UserProvider from '../components/util/UserProvider'
import ServicesProvider from '../components/util/ServicesProvider'
import { RecoilRoot } from 'recoil';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
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
    </RecoilRoot>

  )
}

export default CustomApp
