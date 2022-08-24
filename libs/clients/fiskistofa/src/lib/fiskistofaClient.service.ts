import { Inject, Injectable } from '@nestjs/common'
import { Configuration, StadaSkipsApi } from '../../gen/fetch'
import { FiskistofaClientConfig } from './fiskistofaClient.config'
import type { ConfigType } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { AuthHeaderMiddleware } from '@island.is/auth-nest-tools'
import { mapAllowedCatchForShip } from './fiskiStofaClient.utils'

@Injectable()
export class FiskistofaClientService {
  constructor(
    @Inject(FiskistofaClientConfig.KEY)
    private clientConfig: ConfigType<typeof FiskistofaClientConfig>,
  ) {}

  private async createApi() {
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
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: this.clientConfig.accessTokenServiceClientId,
          client_secret: this.clientConfig.accessTokenServiceClientSecret,
          audience: this.clientConfig.accessTokenServiceAudience,
        }),
      },
    )

    const { access_token: accessToken } = await accessTokenResponse.json()

    if (!accessToken) {
      throw new Error('Fiskistofa client configuration and login went wrong')
    }

    return api.withMiddleware(
      new AuthHeaderMiddleware(`Bearer ${JSON.parse(accessToken)}`),
    )
  }

  async getShipStatusInformation(shipNumber: number, timePeriod: string) {
    const api = await this.createApi()
    const allowedCatchForShip = await api.v1StadaskipsSkipnumerFiskveidiarTimabilGet(
      {
        skipnumer: shipNumber,
        timabil: timePeriod,
      },
    )
    return mapAllowedCatchForShip(allowedCatchForShip)
  }
}
