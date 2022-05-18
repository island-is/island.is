import dns from 'dns'
import { Express } from 'express'
import getNextConfig from 'next/config'

const checkExternalDependency = (url: string) =>
  new Promise((resolve, reject) => {
    dns.lookup(url, (err) => {
      if (err) reject(false)
      resolve(true)
    })
  })

export type ExternalEndpointDependencies =
  | string[]
  // TODO: When NextJS has been upgraded update the type to NextConfig from import { NextConfig } from 'next'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | ((nextConfig: any) => string[])

/**
 * Sets up /readiness and /liveness paths for a Next app.
 * /readiness checks for 200 OK response from external endpoint dependencies before responding with 200 OK.
 * /liveness responds with 200 OK indicating that the app server is up and running.
 *
 * Note: This must be loaded after the Next app has been initialised as it depends on loading the next.config.js.
 *
 * @param app Express app to add the readiness and liveness routes.
 * @param externalEndpointDependencies Array or callback function to provide string[] of external endpoint dependencies.
 */
export const setupHealthchecks = (
  app: Express,
  externalEndpointDependencies: ExternalEndpointDependencies = [],
) => {
  const nextConfig = getNextConfig()
  const dependencies =
    typeof externalEndpointDependencies === 'function'
      ? externalEndpointDependencies(nextConfig)
      : externalEndpointDependencies

  app.use('/readiness', async (_, res) => {
    /*
    Readiness should return 200 if it can resolve hostnames of external dependencies.
    Apps should inform the cluster of their own state not the state of other services.
    If we make this app depend on external service we risk it going down with those external dependecies.
    e.g the web app should render the error page for users if the api goes offline the web app should not go offline
    */
    // check if we can resolve the provided url hostnames in DNS
    const externalDnsRequests = dependencies.map((externalUrl) => {
      const url = new URL(externalUrl)
      return checkExternalDependency(url.hostname)
    })

    // we dotn care about the error, error means no resolve so we return 500
    const status = await Promise.all(externalDnsRequests)
      .then(() => 200)
      .catch(() => 500)

    res.statusCode = status
    res.end('')
  })

  app.use('/liveness', (_, res) => {
    res.statusCode = 200
    res.end('')
  })
}
