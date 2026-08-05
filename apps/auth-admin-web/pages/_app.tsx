import { SessionProvider } from 'next-auth/react'
import App from 'next/app'
import React from 'react'

import '../styles/App.scss'

class AuthAdminWebApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <SessionProvider
        session={pageProps.session}
        basePath="/admin/api/auth"
        refetchInterval={120}
      >
        <Component {...pageProps} />
      </SessionProvider>
    )
  }
}

export default AuthAdminWebApp
