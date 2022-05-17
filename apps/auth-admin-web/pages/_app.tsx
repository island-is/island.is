import { Provider } from 'next-auth/client'
import App from 'next/app'
import React from 'react'

import { withHealthchecks } from '@island.is/next/health'

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

const endpointDependencies = process.env.BASE_URL ? [process.env.BASE_URL] : []

export default withHealthchecks(endpointDependencies)(AuthAdminWebApp)
