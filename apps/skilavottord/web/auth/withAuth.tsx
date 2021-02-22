import React, { Component } from 'react'
import Router from 'next/router'
import { NextComponentType } from 'next'

import { AUTH_URL, isAuthenticated } from './utils'
import { BASE_PATH } from '@island.is/skilavottord/consts'

type AuthType = 'citizen' | 'recyclingPartner'

const USER_MOCKED = process.env.API_MOCKS === 'true'

const withAuth = (WrappedComponent: NextComponentType, authType: AuthType) =>
  class extends Component {
    static async getInitialProps(ctx: any) {
      if (!isAuthenticated(ctx) && !USER_MOCKED) {
        const { res } = ctx
        if (res) {
          const authUrl = `${BASE_PATH}${AUTH_URL[authType]}/login?returnUrl=${BASE_PATH}${ctx.asPath}`
          res.writeHead(302, {
            Location: authUrl,
            withCrendentials: true,
          })
          res.end()
        } else {
          const authUrl = `${AUTH_URL[authType]}/login?returnUrl=${ctx.asPath}`
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
