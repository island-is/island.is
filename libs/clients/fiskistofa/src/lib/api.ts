import { AuthHeaderMiddleware } from '@island.is/auth-nest-tools'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import {
  Configuration,
  SkipApi,
  StadaSkipsApi,
  V1SkipHeitiHeitiGetRequest,
  V1StadaskipsKvotategundirAlmanaksarArGetRequest,
  V1StadaskipsSkipnumerAlmanaksarArDeilistofnarBreyttPostRequest,
  V1StadaskipsSkipnumerAlmanaksarArDeilistofnarGetRequest,
  V1StadaskipsSkipnumerFiskveidiarTimabilBreyttPostRequest,
  V1StadaskipsSkipnumerFiskveidiarTimabilGetRequest,
} from '../../gen/fetch'
import { FiskistofaClientConfig } from './fiskistofaClient.config'
import {
  mapAllowedCatchForShip,
  mapChangedAllowedCatchForShip,
  mapQuotaType,
} from './fiskistofaClient.utils'

@Injectable()
export class FiskistofaApi {
  private stadaSkipsApi: StadaSkipsApi | null = null
  private skipApi: SkipApi | null = null

  constructor(
    @Inject(FiskistofaClientConfig.KEY)
    private clientConfig: ConfigType<typeof FiskistofaClientConfig>,
  ) {}

  async initialize(ignoreCache: boolean = false) {
    if (this.stadaSkipsApi && this.skipApi && !ignoreCache) {
      return
    }

    const stadaSkipsApi = new StadaSkipsApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-fiskistofa',
          treat400ResponsesAsErrors: true,
          ...this.clientConfig.fetch,
        }),
        basePath: this.clientConfig.url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    )

    const skipApi = new SkipApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-fiskistofa',
          treat400ResponsesAsErrors: true,
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

    this.stadaSkipsApi = stadaSkipsApi.withMiddleware(
      new AuthHeaderMiddleware(`Bearer ${access_token}`),
    )
    this.skipApi = skipApi.withMiddleware(
      new AuthHeaderMiddleware(`Bearer ${access_token}`),
    )
  }

  async getUpdatedShipStatusForTimePeriod(
    params: V1StadaskipsSkipnumerFiskveidiarTimabilBreyttPostRequest,
  ) {
    const data = await this.stadaSkipsApi?.v1StadaskipsSkipnumerFiskveidiarTimabilBreyttPost(
      params,
    )
    return mapAllowedCatchForShip(data)
  }

  async getShipStatusForTimePeriod(
    params: V1StadaskipsSkipnumerFiskveidiarTimabilGetRequest,
  ) {
    const data = await this.stadaSkipsApi?.v1StadaskipsSkipnumerFiskveidiarTimabilGet(
      params,
    )
    return mapAllowedCatchForShip(data)
  }

  async getShipStatusForCalendarYear(
    params: V1StadaskipsSkipnumerAlmanaksarArDeilistofnarGetRequest,
  ) {
    const data = await this.stadaSkipsApi?.v1StadaskipsSkipnumerAlmanaksarArDeilistofnarGet(
      params,
    )
    return mapChangedAllowedCatchForShip(data)
  }

  async getUpdatedShipStatusForCalendarYear(
    params: V1StadaskipsSkipnumerAlmanaksarArDeilistofnarBreyttPostRequest,
  ) {
    const data = await this.stadaSkipsApi?.v1StadaskipsSkipnumerAlmanaksarArDeilistofnarBreyttPost(
      params,
    )
    return mapChangedAllowedCatchForShip(data)
  }

  async getQuotaTypesForTimePeriod(
    params: V1StadaskipsSkipnumerFiskveidiarTimabilGetRequest,
  ) {
    const data = await this.stadaSkipsApi?.v1StadaskipsKvotategundirFiskveidiarTimabilGet(
      params,
    )
    return (data ?? []).map(mapQuotaType)
  }

  async getQuotaTypesForCalendarYear(
    params: V1StadaskipsKvotategundirAlmanaksarArGetRequest,
  ) {
    const data = await this.stadaSkipsApi?.v1StadaskipsKvotategundirAlmanaksarArGet(
      params,
    )
    return (data ?? []).map(mapQuotaType)
  }

  async getShips(params: V1SkipHeitiHeitiGetRequest) {
    const data = await this.skipApi?.v1SkipHeitiHeitiGet(params)
    return (data ?? []).map((ship) => ({
      id: ship.skipaskraNumer,
      name: ship.heiti ?? '',
      shippingCompany: ship.utgerdarflokkur ?? '',
      shippingClass: ship.utgerd ?? '',
      homePort: ship.heimahofn ?? '',
    }))
  }
}
