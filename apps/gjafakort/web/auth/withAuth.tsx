import React, { Component } from 'react'
import cookies from 'next-cookies'
import Router from 'next/router'
import { NextComponentType } from 'next'
import { NextPageContext } from 'next/dist/next-server/lib/utils'

import { isAuthenticated } from './utils'

const AUTH_URL = '/api/auth/login'

export default (WrappedComponent: NextComponentType) =>
  class extends Component {
    static async getInitialProps(ctx: NextPageContext) {
      if (!isAuthenticated(ctx)) {
        const authUrl = `${AUTH_URL}?returnUrl=${ctx.asPath}`
        const { res } = ctx
        if (res) {
          res.writeHead(302, {
            Location: authUrl,
          })
          res.end()
        } else {
          Router.push(authUrl)
          return {}
        }
      }

      const props = { isAuthenticated: true }
      if (WrappedComponent.getInitialProps) {
        return await WrappedComponent.getInitialProps(
          Object.assign({}, ctx, props),
        )
      }
      return { isAuthenticated: true }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
