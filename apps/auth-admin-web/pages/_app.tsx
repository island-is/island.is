import { Provider } from 'next-auth/client'
import App from 'next/app'
import React from 'react'

import '../styles/App.scss'

class AuthAdminWebApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <Provider
        session={pageProps.session}
        options={{ clientMaxAge: 120, basePath: `/admin/api/auth` }}
      >
        <Component {...pageProps} />
      </Provider>
    )
  }
}

export default AuthAdminWebApp
