import React, { Component } from 'react'
import Router from 'next/router'
import { NextComponentType } from 'next'

import { AUTH_URL, isAuthenticated } from './utils'

type AuthType = 'citizen' | 'recyclingPartner'

const USER_MOCKED =
  process.env.NODE_ENV === 'development' && process.env.API_MOCKS === 'true'

const withAuth = (WrappedComponent: NextComponentType, authType: AuthType) =>
  class extends Component {
    static async getInitialProps(ctx: any) {
      if (!isAuthenticated(ctx) && !USER_MOCKED) {
        const authUrl = `${AUTH_URL[authType]}/login?returnUrl=${ctx.asPath}`
        const { res } = ctx
        if (res) {
          res.writeHead(302, {
            Location: authUrl,
            withCrendentials: true,
          })
          res.end()
        } else {
          Router.push(authUrl)
          return {}
        }
      }

      if (WrappedComponent.getInitialProps) {
        return await WrappedComponent.getInitialProps(ctx)
      }
      return {}
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

export default withAuth
