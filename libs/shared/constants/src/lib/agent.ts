import type { HttpsOptions } from 'agentkeepalive'

export const AGENT_DEFAULT_TIMEOUT = 1000 * 20 // 20 seconds

export const AGENT_DEFAULT_FREE_SOCKET_TIMEOUT = 1000 * 10 // 10 seconds

// based on these:
// - https://github.com/aws/aws-sdk-js-v3/issues/1959#issuecomment-777709813
// - https://learn.microsoft.com/en-us/azure/app-service/app-service-web-nodejs-best-practices-and-troubleshoot-guide#my-node-application-is-making-excessive-outbound-calls
// - https://medium.com/trendyol-tech/nodejs-performance-best-practices-more-than-cliche-9baa573cbf03#42c8
// - https://community.prismic.io/t/fetch-error-on-rest-api-econnreset/3632/24
const parseMaxSockets = (raw?: string): number => {
  const value = Number(raw)
  return Number.isInteger(value) && value > 0 ? value : 50
}

// Overridable per service via FETCH_MAX_SOCKETS; defaults to 50.
export const AGENT_DEFAULT_MAX_SOCKETS = parseMaxSockets(
  process.env.FETCH_MAX_SOCKETS,
)

export const AGENT_DEFAULTS: HttpsOptions = {
  keepAlive: true,
  timeout: AGENT_DEFAULT_TIMEOUT,
  freeSocketTimeout: AGENT_DEFAULT_FREE_SOCKET_TIMEOUT,
  maxSockets: AGENT_DEFAULT_MAX_SOCKETS,
  maxFreeSockets: AGENT_DEFAULT_MAX_SOCKETS,
}
