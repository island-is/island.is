import React, { Component } from 'react'
import Router from 'next/router'

import { isAuthenticated } from './utils'
import { REDIRECT_KEY } from '../consts'
import { Routes } from '../types'

const AUTH_URL = '/api/auth/login'

interface PropTypes {
  route: keyof Routes
  redirectPath: ValueOf<Routes>
  hasAuthenticated: boolean
}

export default (WrappedComponent) =>
  class extends Component<PropTypes> {
    /*
     * NOTE!
     * This is hopefully temporarily since the current
     * Island.is login service every now and then loses
     * cookies when calling the callback endpoint.
     * We use this as a fallback (when that happens) and
     * store the redirectUrl in localStorage when
     * client-side rendering. In cases where the cookie is
     * lost, the api will redirect to the temp /_ route
     * which renders the screens/Auth component.
     * The component will read from localStorage and
     * redirect the user to the correct route.
     */
    componentDidMount() {
      const { route, redirectPath, hasAuthenticated } = this.props

      if (route !== 'auth') {
        localStorage.setItem(REDIRECT_KEY, redirectPath)
      }
      if (!hasAuthenticated) {
        Router.push(AUTH_URL)
      }
    }

    static async getInitialProps(ctx) {
      const hasAuthenticated = isAuthenticated(ctx)
      const props = { redirectPath: ctx.pathname, hasAuthenticated }
      if (!hasAuthenticated) {
        const { res } = ctx
        if (res) {
          res.writeHead(302, {
            Location: AUTH_URL,
            withCrendentials: true,
          })
          res.end()
        } else {
          return props
        }
      }

      if (WrappedComponent.getInitialProps) {
        return { ...props, ...(await WrappedComponent.getInitialProps(ctx)) }
      }
      return props
    }

    render() {
      const { hasAuthenticated } = this.props
      if (hasAuthenticated) {
        return <WrappedComponent {...this.props} />
      }

      /*
       * Render white screen for the redirection
       */
      return (
        <div
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            background: '#fff',
            zIndex: 999,
            top: 0,
          }}
        />
      )
    }
  }
