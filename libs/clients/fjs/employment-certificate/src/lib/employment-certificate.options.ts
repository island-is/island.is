import type { EnhancedFetchOptions } from '@island.is/clients/middlewares'
import type {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import type { EmploymentCertificateClientConfig } from './employment-certificate.config'

export const EMPLOYMENT_CERTIFICATE_CLIENT_OPTIONS =
  'EmploymentCertificateClientOptions'

export interface EmploymentCertificateClientOptions {
  /** Undefined when the client can't be used, see `notConfiguredReason`. */
  baseUrl: string | undefined
  /** Why the client can't be used. Undefined when it can. */
  notConfiguredReason: string | undefined
  headers: Record<string, string>
  timeout: number
  /** Undefined when the user's own token is forwarded as it is. */
  autoAuth: EnhancedFetchOptions['autoAuth']
}

// The user's token goes to this URL, so it must be encrypted or stay on the machine.
const isSafeDirectUrl = (url: string): boolean =>
  /^https:\/\//i.test(url) ||
  /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(url)

/**
 * Decides how the API is reached and which token it gets:
 *
 * - Base URL: the direct URL (local development) wins over X-Road.
 * - Token: exchanged for one with the configured scope, or forwarded as it is
 *   when no scope is configured.
 *
 * A configuration that can't be used gives no base URL and a reason, and the
 * service then refuses every call. That way a half-configured client never
 * sends the user's token somewhere unintended.
 */
export const getEmploymentCertificateClientOptions = (
  config: ConfigType<typeof EmploymentCertificateClientConfig>,
  xroadConfig: ConfigType<typeof XRoadConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
): EmploymentCertificateClientOptions => {
  const headers: Record<string, string> = { Accept: 'application/json' }
  const useTokenExchange = config.tokenExchangeScope.length > 0
  let baseUrl: string | undefined
  let notConfiguredReason: string | undefined

  if (config.directBaseUrl) {
    if (isSafeDirectUrl(config.directBaseUrl)) {
      baseUrl = config.directBaseUrl.replace(/\/+$/, '')
    } else {
      notConfiguredReason = 'the direct URL must use https'
    }
  } else if (config.xRoadServicePath) {
    baseUrl = `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`
    headers['X-Road-Client'] = xroadConfig.xRoadClient
  } else {
    notConfiguredReason = 'no base URL'
  }

  if (useTokenExchange && !idsClientConfig.isConfigured) {
    // Forwarding the user's own, broader token instead would be wrong.
    baseUrl = undefined
    notConfiguredReason =
      'a token exchange scope is set but the IAS client is not configured'
  }

  return {
    baseUrl,
    notConfiguredReason,
    headers,
    timeout: config.fetchTimeout,
    autoAuth:
      useTokenExchange && idsClientConfig.isConfigured
        ? {
            mode: 'tokenExchange',
            issuer: idsClientConfig.issuer,
            clientId: idsClientConfig.clientId,
            clientSecret: idsClientConfig.clientSecret,
            scope: config.tokenExchangeScope,
          }
        : undefined,
  }
}
