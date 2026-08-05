import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { ComplaintsCommitteeRulingsClientConfig } from './complaints-committee-rulings.config'

export const AuthApiConfiguration = {
  provide: 'ComplaintsCommitteeRulingsAuthApiConfiguration',
  useFactory: (
    config: ConfigType<typeof ComplaintsCommitteeRulingsClientConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-complaints-committee-rulings-auth',
        logErrorResponseBody: true,
      }),
      basePath: `${config.basePath}/OneRulings`,
      headers: {
        Accept: 'application/json',
        'X-API-KEY': config.apiKey,
      },
    })
  },
  inject: [ComplaintsCommitteeRulingsClientConfig.KEY],
}

export const RulingsApiConfiguration = {
  provide: 'ComplaintsCommitteeRulingsApiConfiguration',
  useFactory: (
    config: ConfigType<typeof ComplaintsCommitteeRulingsClientConfig>,
  ) => {
    let cachedToken: string | null = null
    let tokenExpiry: Date | null = null

    const getToken = async (): Promise<string> => {
      if (cachedToken && tokenExpiry && tokenExpiry > new Date()) {
        return cachedToken
      }

      const authFetch = createEnhancedFetch({
        name: 'clients-complaints-committee-rulings-token',
        logErrorResponseBody: true,
      })
      const response = await authFetch(
        `${config.basePath}/OneRulings/api/auth/token`,
        {
          method: 'POST',
          headers: {
            'X-API-KEY': config.apiKey,
            Accept: 'application/json',
          },
        },
      )
      const data = await response.json()
      cachedToken = data.accessToken ?? null
      tokenExpiry = new Date(Date.now() + 55 * 60 * 1000)

      if (!cachedToken) {
        throw new Error('Failed to obtain access token')
      }
      return cachedToken
    }

    const baseFetch = createEnhancedFetch({
      name: 'clients-complaints-committee-rulings',
      logErrorResponseBody: true,
    })

    const authenticatedFetch: typeof fetch = async (input, init) => {
      const token = await getToken()
      const headers = new Headers(init?.headers)
      headers.set('Authorization', `Bearer ${token}`)
      return baseFetch(input, { ...init, headers })
    }

    return new Configuration({
      fetchApi: authenticatedFetch,
      basePath: `${config.basePath}/OneRulings`,
      headers: {
        Accept: 'application/json',
      },
    })
  },
  inject: [ComplaintsCommitteeRulingsClientConfig.KEY],
}
