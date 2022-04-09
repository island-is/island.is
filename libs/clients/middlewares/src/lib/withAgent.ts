import Agent, { HttpsOptions, HttpsAgent } from 'agentkeepalive'
import { SecureContextOptions } from 'tls'
import { FetchAPI, FetchMiddlewareOptions } from './nodeFetch'

export type AgentOptions = HttpsOptions

// Chrerry-pick the supported types of certs from TLS
export interface ClientCertificateOptions {
  pfx: NonNullable<SecureContextOptions['pfx']>
  passphrase?: SecureContextOptions['passphrase']
}

export interface AgentMiddlewareOptions extends FetchMiddlewareOptions {
  clientCertificate?: ClientCertificateOptions
  agentOptions?: AgentOptions
  freeSocketTimeout: number
  keepAlive: boolean
}

const AGENTS = new Map<string, Agent>()

export function withAgent({
  clientCertificate,
  agentOptions,
  freeSocketTimeout,
  keepAlive,
  fetch,
}: AgentMiddlewareOptions): FetchAPI {
  const options: AgentOptions = {
    ...clientCertificate,
    freeSocketTimeout,
    keepAlive,
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

  return (input, init) => fetch(input, { agent: getAgent, ...init })
}
