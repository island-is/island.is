import Agent, { HttpsOptions, HttpsAgent } from 'agentkeepalive'
import { SecureContextOptions } from 'tls'
import { FetchMiddlewareOptions, MiddlewareAPI } from './nodeFetch'

import { URL } from 'url' // Import URL from the Node.js core library.

export type AgentOptions = HttpsOptions

// Cherry-pick the supported types of certs from TLS
export interface ClientCertificateOptions {
  pfx: NonNullable<SecureContextOptions['pfx']>
  passphrase?: SecureContextOptions['passphrase']
}

export interface AgentMiddlewareOptions extends FetchMiddlewareOptions {
  clientCertificate?: ClientCertificateOptions
  agentOptions?: AgentOptions
}

const AGENTS = new Map<string, Agent>()

export function withAgent({
  clientCertificate,
  agentOptions,
  fetch,
}: AgentMiddlewareOptions): MiddlewareAPI {
  const options: AgentOptions = {
    ...clientCertificate,
    ...agentOptions,
  }
  const agentKeyBase = JSON.stringify(options)

  // Automatically create http and https agents and share them between EnhancedFetch.
  const getAgent = (url: URL): Agent => {
    const agentKey = url.protocol + agentKeyBase
    let agent = AGENTS.get(agentKey)
    if (!agent) {
      agent =
        url.protocol === 'https:' ? new HttpsAgent(options) : new Agent(options)
      AGENTS.set(agentKey, agent)
    }
    return agent
  }

  return (request) => {
    request.agent = request.agent || getAgent
    return fetch(request)
  }
}
