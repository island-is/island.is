import React from 'react'
import dns from 'dns'

const checkExternalDependency = (url: string) =>
  new Promise((resolve, reject) => {
    dns.lookup(url, (err) => {
      if (err) reject(false)
      resolve(true)
    })
  })

export const withHealthchecks =
  (externalEndpointDependencies: string[]) => (Component) => {
    const NewComponent = (props) => <Component {...props} />

    NewComponent.getInitialProps = async (context) => {
      const ctx = context.ctx ?? context
      /*
    Readiness should return 200 if it can resolve hostnames of external dependencies.
    Apps should inform the cluster of their own state not the state of other services.
    If we make this app depend on external service we risk it going down with those external dependecies.
    e.g the web app should render the error page for users if the api goes offline the web app should not go offline
    */
      if (ctx.req?.url === '/readiness') {
        // check if we can resolve the provided url hostnames in DNS
        const externalDnsRequests = externalEndpointDependencies.map(
          (externalUrl) => {
            const url = new URL(externalUrl)
            return checkExternalDependency(url.hostname)
          },
        )

        // we dotn care about the error, error means no resolve so we return 500
        const status = await Promise.all(externalDnsRequests)
          .then(() => 200)
          .catch(() => 500)

        // forward the api status code as readiness status code
        ctx.res.statusCode = status
        ctx.res.end('')
        return null
      }

      // tels the cluster this instance is alive
      if (ctx.req?.url === '/liveness') {
        ctx.res.statusCode = 200
        ctx.res.end('')
        return null
      }
      return Component.getInitialProps(context)
    }

    return NewComponent
  }
