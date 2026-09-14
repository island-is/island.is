import dns from 'dns'
import { Express } from 'express'

const checkExternalDependency = (url: string) =>
  new Promise((resolve, reject) => {
    dns.lookup(url, (err) => {
      if (err) reject(false)
      resolve(true)
    })
  })

/**
 * Either a static list of external endpoint URLs or a callback returning one.
 * The callback runs server-side after the app is ready — read values from the
 * app's server runtime environment (process.env), e.g. its
 * environments/runtimeEnvironment.ts module.
 */
export type ExternalEndpointDependencies = string[] | (() => string[])

/**
 * Sets up /readiness and /liveness paths for a Next app.
 * /readiness checks for 200 OK response from external endpoint dependencies before responding with 200 OK.
 * /liveness responds with 200 OK indicating that the app server is up and running.
 *
 * @param app Express app to add the readiness and liveness routes.
 * @param readyPromise Promise which resolves when the server is ready.
 * @param externalEndpointDependencies Array or callback function to provide string[] of external endpoint dependencies.
 */
export const setupHealthchecks = (
  app: Express,
  readyPromise: Promise<void>,
  externalEndpointDependencies: ExternalEndpointDependencies = [],
) => {
  const getDependencies = readyPromise.then(() => {
    return typeof externalEndpointDependencies === 'function'
      ? externalEndpointDependencies()
      : externalEndpointDependencies
  })

  app.use('/readiness', async (_, res) => {
    /*
    Readiness should return 200 if it can resolve hostnames of external dependencies.
    Apps should inform the cluster of their own state, not the state of other services.
    If we make this app depend on external service we risk it going down with those external dependecies.
    e.g the web app should render the error page for users if the api goes offline, the web app should not go offline.
    */
    const dependencies = await getDependencies
    // check if we can resolve the provided url hostnames in DNS
    const externalDnsRequests = dependencies.map((externalUrl) => {
      const url = new URL(externalUrl)
      return checkExternalDependency(url.hostname)
    })

    // We don't care about the error, error means no resolve so we return 500
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
