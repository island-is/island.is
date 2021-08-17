import React from 'react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { ReactComponent as NxLogo } from '../public/nx-logo-white.svg'
import './styles.css'
import Header from '../components/layout/header'
import ContentWrapper from '../components/layout/content-wrapper'

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Atvinnuleysisbætur</title>
      </Head>
      <ContentWrapper>
      <Header></Header>
        <Component {...pageProps} />
      </ContentWrapper>      
    </>
  )
}

export default CustomApp
