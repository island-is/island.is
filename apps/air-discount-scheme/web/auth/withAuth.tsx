import React, { Component } from 'react'
import Router from 'next/router'

import { isAuthenticated } from './utils'
import { REDIRECT_KEY } from '../consts'
import { Routes } from '../types'
import { getSession, signIn } from 'next-auth/client'

const AUTH_URL = '/api/auth/signin-oidc'

export const login = async () => {
  signIn('identity-server')
}

interface PropTypes {
  route: keyof Routes
  redirectPath: ValueOf<Routes>
  hasAuthenticated: boolean
}

//export default (WrappedComponent) =>
const withAuth = (WrappedComponent) =>
  class extends Component<PropTypes> {
    /*
     * !NOTE!
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
      console.log('withAuth did mount')
      const session = getSession()
      if (route !== 'auth') {
        console.log('route is not auth in withauth')
        localStorage.setItem(REDIRECT_KEY, redirectPath)
      }
      if (!hasAuthenticated) {
        console.log('withauth !HasAuthenticated -window is ' + window.location.href)
        login()
        //Router.push(AUTH_URL)//('https://identity-server.dev01.devland.is')
      }
    }

    static async getInitialProps(ctx) {
      console.log('withAuth getinitialProps')
      const hasAuthenticated = isAuthenticated(ctx)
      console.log('withauth getinit isAuthenticated ' + isAuthenticated(ctx))
      const props = { redirectPath: ctx.pathname, hasAuthenticated }
      console.log('withAuth redirPath: ctxpathname: ' + ctx.pathname)
      if (!hasAuthenticated) {
        return props
      }

      if (WrappedComponent.getInitialProps) {
        console.log('inside this withauth - wrapped component  getinitprops')
        return { ...props, ...(await WrappedComponent.getInitialProps(ctx)) }
      }
      return props
    }

    render() {
      const { hasAuthenticated } = this.props
      console.log('withauth render redir ' + this.props.redirectPath)
      if (hasAuthenticated) {
        Router.push(this.props.redirectPath)
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
export default withAuth