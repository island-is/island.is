import React, { Component } from 'react'
import Router from 'next/router'
import { NextComponentType } from 'next'
import { BaseContext, NextPageContext } from 'next/dist/next-server/lib/utils'

import { isAuthenticated } from './utils'

const AUTH_URL = '/api/auth/login'

// export default function withAuth(WrappedComponent: any) {
//   return class extends Component {
//     static async getInitialProps(ctx: any) {
//       if (!isAuthenticated(ctx)) {
//         const authUrl = `${AUTH_URL}?returnUrl=${ctx.asPath}`
//         const { res } = ctx
//         if (res) {
//           res.writeHead(302, {
//             Location: authUrl,
//           })
//           res.end()
//         } else {
//           Router.push(authUrl)
//           return {}
//         }
//       }
//       const newContext = Object.assign({}, ctx, { isAuthenticated: true })
//       if (WrappedComponent.getInitialProps) {
//         return await WrappedComponent.getInitialProps(newContext)
//       }
//       return newContext
//     }
//
//     render() {
//       return <WrappedComponent {...this.props} />
//     }
//   }
// }

export default (Component: NextComponentType): NextComponentType => {
  const getInitialProps = Component.getInitialProps
  if (!getInitialProps) {
    return Component
  }

  Component.getInitialProps = async (ctx) => {
    const newContext = Object.assign({}, ctx, { isAuthenticated: true })
    const props = getInitialProps ? await getInitialProps(newContext) : {}

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

    return {
      ...props,
      isAuthenticated: true,
    }
  }

  return Component
}
