import { Inject, Injectable } from '@nestjs/common'
import {
  Configuration,
  StadaSkipsApi,
  V1StadaskipsSkipnumerFiskveidiarTimabilGetRequest,
} from '../../gen/fetch'
import { FiskistofaClientConfig } from './fiskistofaClient.config'
import type { ConfigType } from '@island.is/nest/config'
import { createEnhancedFetch, FetchError } from '@island.is/clients/middlewares'
import { AuthHeaderMiddleware } from '@island.is/auth-nest-tools'
import { mapAllowedCatchForShip } from './fiskiStofaClient.utils'

@Injectable()
export class FiskistofaClientService {
  private api: StadaSkipsApi | null = null

  constructor(
    @Inject(FiskistofaClientConfig.KEY)
    private clientConfig: ConfigType<typeof FiskistofaClientConfig>,
  ) {}

  private async createApi(ignoreCache: boolean = false) {
    if (this.api && !ignoreCache) {
      return this.api
    }

    const api = new StadaSkipsApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-fiskistofa',
          ...this.clientConfig.fetch,
        }),
        basePath: this.clientConfig.url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    )

    const accessTokenResponse = await fetch(
      this.clientConfig.accessTokenServiceUrl,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: this.clientConfig.accessTokenServiceClientId,
          client_secret: this.clientConfig.accessTokenServiceClientSecret,
          audience: this.clientConfig.accessTokenServiceAudience,
        }),
      },
    )

    const { access_token } = await accessTokenResponse.json()

    if (!access_token) {
      throw new Error('Fiskistofa client configuration and login went wrong')
    }

    this.api = api.withMiddleware(
      new AuthHeaderMiddleware(`Bearer ${access_token}`),
    )

    return this.api
  }

  async getShipStatusInformation(shipNumber: number, timePeriod: string) {
    const api = await this.createApi()
    const params = {
      skipnumer: shipNumber,
      timabil: timePeriod,
    }
    try {
      return this.getShipStatusInformationInternal(api, params)
    } catch (error) {
      if (error instanceof FetchError) {
        const tokenExpired = error.status === 401
        if (tokenExpired) {
          const apiWithUpdatedToken = await this.createApi(true)
          return this.getShipStatusInformationInternal(
            apiWithUpdatedToken,
            params,
          )
        }
      }
      throw error
    }
  }

  private async getShipStatusInformationInternal(
    api: StadaSkipsApi,
    params: V1StadaskipsSkipnumerFiskveidiarTimabilGetRequest,
  ) {
    const allowedCatchForShip = await api.v1StadaskipsSkipnumerFiskveidiarTimabilGet(
      params,
    )
    return mapAllowedCatchForShip(allowedCatchForShip)
  }
}
