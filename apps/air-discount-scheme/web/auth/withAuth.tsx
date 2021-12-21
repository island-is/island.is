import React, { Component } from 'react'
import Router from 'next/router'

import { isAuthenticated } from './utils'
import { REDIRECT_KEY } from '../consts'
import { Routes } from '../types'
import { getSession, signIn, useSession } from 'next-auth/client'
import { GraphQLError } from 'graphql'
import errorLink from '../graphql/errorLink'
import { onError, ErrorResponse, ErrorLink } from '@apollo/client/link/error'
import { Link } from '@island.is/island-ui/core'


const AUTH_URL = '/api/auth/signin-oidc'

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
      if (route !== 'auth') {
        console.log('route is not auth in withauth')
        localStorage.setItem(REDIRECT_KEY, redirectPath)
      }
      if (!hasAuthenticated) {
        console.log('withauth !HasAuthenticated -window is ' + window.location.href)
        //Router.push(AUTH_URL)//('https://identity-server.dev01.devland.is')
        //return signIn('identity-server', {callbackUrl: `${window.location}`})
      }
    }

    // static async getInitialProps(ctx) {
    //   console.log('withAuth getinitialProps')
    //   const hasAuthenticated = isAuthenticated(ctx)
    //   console.log('withauth getinit isAuthenticated ' + isAuthenticated(ctx))
    //   const props = { redirectPath: ctx.pathname, hasAuthenticated }
    //   console.log('withAuth redirPath: ctxpathname: ' + ctx.pathname)
    //   if (!hasAuthenticated) {
    //     console.log('!hasAuth returning props ' + JSON.stringify(props))
    //     return props
    //   }

    //   if (WrappedComponent.getInitialProps) {
    //     console.log('inside this withauth - wrapped component  getinitprops')
    //     return { ...props, ...(await WrappedComponent.getInitialProps(ctx)) }
    //   }
    //   return props
    // }

    render() {
      const { hasAuthenticated } = this.props
      console.log('withauth render redir ' + this.props.redirectPath)
      if (hasAuthenticated) {
        Router.push(this.props.redirectPath)
        return <WrappedComponent {...this.props} />
      }

      //
      //Uncaught TypeError: _ref$page is undefined Subsidy Subsidy.tsx:30 --- The above error occurred in the <Subsidy> component
      //next-auth][error][client_fetch_error] https://next-auth.js.org/errors#client_fetch_error providers AND session
      //return <WrappedComponent {...signIn('identity-server')} />
      

      //error webpack-internal:///…evelopment.js:13231 Uncaught Error: Objects are not valid as a React child (found: [object Promise]). If you meant to render a collection of children, use an array instead.
      //​ The above error occurred in the <_class> component:
      //next-auth][error][client_fetch_error] https://next-auth.js.org/errors#client_fetch_error providers 
      //return signIn('identity-server', {callbackUrl: `${window.location.href}`})
      //throw new ErrorLink()
      

      
      /*
       * Render white screen for the redirection
       */
      const callbackObj = {callbackUrl: `${window.location.href}`}
      return (
        <div
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            background: '#0ff',
            zIndex: 999,
            top: 0,
          }}
        >
          {/* <button onClick={() => [signIn('identity-server4'),callbackObj]}>sign in</button> */}
          <Link href="/api/auth/signin">Sign in here</Link>
        </div>
      )
    }
  }
export default withAuth
