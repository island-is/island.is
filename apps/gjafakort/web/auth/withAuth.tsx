import React, { Component } from 'react'
import Router from 'next/router'

import { isAuthenticated } from './utils'

const AUTH_URL = 'api/auth/login'

export default (WrappedComponent: any) =>
  class extends Component {
    static async getInitialProps(ctx: any) {
      if (!isAuthenticated(ctx)) {
        const authUrl = `${AUTH_URL}?returnUrl=${ctx.pathname}`
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
      const newContext = Object.assign({}, ctx, { isAuthenticated: true })
      if (WrappedComponent.getInitialProps) {
        return await WrappedComponent.getInitialProps(newContext)
      }
      return newContext
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
