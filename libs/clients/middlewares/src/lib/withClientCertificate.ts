import https from 'https'
import { SecureContextOptions } from 'tls'
import { FetchAPI, FetchMiddlewareOptions } from './types'

// Chrerry-pick the supported types of certs from TLS
export interface ClientCertificateOptions {
  pfx: NonNullable<SecureContextOptions['pfx']>
  passphrase: SecureContextOptions['passphrase']
}

export interface ClientCertificateMiddlewareOptions
  extends FetchMiddlewareOptions {
  clientCertificate: ClientCertificateOptions
}

export function withClientCertificate({
  clientCertificate,
  fetch,
}: ClientCertificateMiddlewareOptions): FetchAPI {
  /**
   * Create an https agent that manages the certificate.
   * `agent` is an extension from node-fetch and is not a part of the fetch spec
   * https://github.com/node-fetch/node-fetch#custom-agent
   */
  const agent = new https.Agent({
    pfx: clientCertificate.pfx,
    passphrase: clientCertificate.passphrase,
  })

  return (input, init) => fetch(input, { agent, ...init })
}
