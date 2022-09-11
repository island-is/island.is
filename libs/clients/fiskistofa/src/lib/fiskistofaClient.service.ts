import { Inject, Injectable } from '@nestjs/common'
import {
  GetAflamarkInformationForShipInput,
  GetDeilistofnaInformationForShipInput,
  GetUpdatedAflamarkInformationForShipInput,
  GetUpdatedDeilistofnaInformationForShipInput,
  GetShipsInput,
} from '@island.is/api/domains/fiskistofa'
import {
  Configuration,
  SkipApi,
  StadaSkipsApi,
  StodtoflurApi,
  V1SkipHeitiHeitiGetRequest,
  V1StadaskipsSkipnumerAlmanaksarArDeilistofnarBreyttPostRequest,
  V1StadaskipsSkipnumerAlmanaksarArDeilistofnarGetRequest,
  V1StadaskipsSkipnumerFiskveidiarTimabilBreyttPostRequest,
  V1StadaskipsSkipnumerFiskveidiarTimabilGetRequest,
} from '../../gen/fetch'
import { FiskistofaClientConfig } from './fiskistofaClient.config'
import type { ConfigType } from '@island.is/nest/config'
import { createEnhancedFetch, FetchError } from '@island.is/clients/middlewares'
import { AuthHeaderMiddleware } from '@island.is/auth-nest-tools'
import {
  mapAllowedCatchForShip,
  mapChangedAllowedCatchForShip,
  mapFishes,
} from './fiskistofaClient.utils'

@Injectable()
export class FiskistofaClientService {
  private stadaSkipsApi: StadaSkipsApi | null = null
  private stodtoflurApi: StodtoflurApi | null = null
  private skipApi: SkipApi | null = null

  constructor(
    @Inject(FiskistofaClientConfig.KEY)
    private clientConfig: ConfigType<typeof FiskistofaClientConfig>,
  ) {}

  private async initialize(ignoreCache: boolean = false) {
    if (
      this.stadaSkipsApi &&
      this.stodtoflurApi &&
      this.skipApi &&
      !ignoreCache
    ) {
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
    const stodtoflurApi = new StodtoflurApi(
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
    this.stodtoflurApi = stodtoflurApi.withMiddleware(
      new AuthHeaderMiddleware(`Bearer ${access_token}`),
    )
    this.skipApi = skipApi.withMiddleware(
      new AuthHeaderMiddleware(`Bearer ${access_token}`),
    )
  }

  async getUpdatedAflamarkInformationForShip(
    input: GetUpdatedAflamarkInformationForShipInput,
  ) {
    const params: V1StadaskipsSkipnumerFiskveidiarTimabilBreyttPostRequest = {
      skipnumer: input.shipNumber,
      timabil: input.timePeriod,
      aflamarkSkipsBreytingarDTO: {
        breytingarFisktegundar: input.changes.map(
          ({ catchChange, allowedCatchChange, id }) => ({
            aflabreyting: catchChange,
            aflamarksbreyting: allowedCatchChange,
            kvotategund: id,
          }),
        ),
      },
    }

    await this.initialize()

    try {
      const response = await this.getUpdatedAflamarkInformationForShipInternal(
        this.stadaSkipsApi as StadaSkipsApi,
        params,
      )
      return response
    } catch (error) {
      if (error instanceof FetchError) {
        await this.initialize(true)
        const response = await this.getUpdatedAflamarkInformationForShipInternal(
          this.stadaSkipsApi as StadaSkipsApi,
          params,
        )
        return response
      }
    }
  }

  private async getUpdatedAflamarkInformationForShipInternal(
    api: StadaSkipsApi,
    params: V1StadaskipsSkipnumerFiskveidiarTimabilBreyttPostRequest,
  ) {
    const response = await api.v1StadaskipsSkipnumerFiskveidiarTimabilBreyttPost(
      params,
    )
    return mapChangedAllowedCatchForShip(response)
  }

  async getAflamarkInformationForShip(
    input: GetAflamarkInformationForShipInput,
  ) {
    const params: V1StadaskipsSkipnumerFiskveidiarTimabilGetRequest = {
      skipnumer: input.shipNumber,
      timabil: input.timePeriod,
    }
    await this.initialize()

    try {
      const response = await this.getAflamarkInformationForShipInternal(
        this.stadaSkipsApi as StadaSkipsApi,
        params,
      )
      return response
    } catch (error) {
      await this.initialize(true)
      const response = this.getAflamarkInformationForShipInternal(
        this.stadaSkipsApi as StadaSkipsApi,
        params,
      )
      return response
    }
  }

  private async getAflamarkInformationForShipInternal(
    api: StadaSkipsApi,
    params: V1StadaskipsSkipnumerFiskveidiarTimabilGetRequest,
  ) {
    const response = await api.v1StadaskipsSkipnumerFiskveidiarTimabilGet(
      params,
    )
    return mapAllowedCatchForShip(response)
  }

  async getDeilistofnaInformationForShip(
    input: GetDeilistofnaInformationForShipInput,
  ) {
    const params: V1StadaskipsSkipnumerAlmanaksarArDeilistofnarGetRequest = {
      ar: input.year,
      skipnumer: input.shipNumber,
    }

    await this.initialize()

    try {
      const response = await this.getDeilistofnaInformationForShipInternal(
        this.stadaSkipsApi as StadaSkipsApi,
        params,
      )
      return response
    } catch (error) {
      await this.initialize(true)
      const response = this.getDeilistofnaInformationForShipInternal(
        this.stadaSkipsApi as StadaSkipsApi,
        params,
      )
      return response
    }
  }

  private async getDeilistofnaInformationForShipInternal(
    api: StadaSkipsApi,
    params: V1StadaskipsSkipnumerAlmanaksarArDeilistofnarGetRequest,
  ) {
    const response = await api.v1StadaskipsSkipnumerAlmanaksarArDeilistofnarGet(
      params,
    )
    return mapChangedAllowedCatchForShip(response)
  }

  async getUpdatedDeilistofnaInformationForShip(
    input: GetUpdatedDeilistofnaInformationForShipInput,
  ) {
    const params: V1StadaskipsSkipnumerAlmanaksarArDeilistofnarBreyttPostRequest = {
      ar: input.year,
      skipnumer: input.shipNumber,
      aflamarkSkipsBreytingarDTO: {
        breytingarFisktegundar: input.changes.map(
          ({ catchChange, allowedCatchChange, id }) => ({
            aflabreyting: catchChange,
            aflamarksbreyting: allowedCatchChange,
            kvotategund: id,
          }),
        ),
      },
    }
    await this.initialize()

    try {
      const response = await this.getUpdatedDeilistofnaInformationForShipInternal(
        this.stadaSkipsApi as StadaSkipsApi,
        params,
      )
      return response
    } catch (error) {
      await this.initialize(true)
      const response = this.getUpdatedDeilistofnaInformationForShipInternal(
        this.stadaSkipsApi as StadaSkipsApi,
        params,
      )
      return response
    }
  }

  private async getUpdatedDeilistofnaInformationForShipInternal(
    api: StadaSkipsApi,
    params: V1StadaskipsSkipnumerAlmanaksarArDeilistofnarBreyttPostRequest,
  ) {
    const response = await api.v1StadaskipsSkipnumerAlmanaksarArDeilistofnarBreyttPost(
      params,
    )
    return mapChangedAllowedCatchForShip(response)
  }

  async getAllFishes() {
    await this.initialize()
    try {
      const response = await this.getAllFishesInternal(
        this.stodtoflurApi as StodtoflurApi,
      )
      return response
    } catch (error) {
      await this.initialize(true)
      const response = await this.getAllFishesInternal(
        this.stodtoflurApi as StodtoflurApi,
      )
      return response
    }
  }

  private async getAllFishesInternal(api: StodtoflurApi) {
    const response = await api.v1StodtoflurFisktegundirGet()
    return mapFishes(response)
  }

  async getShips(input: GetShipsInput) {
    await this.initialize()
    try {
      const response = await this.getShipsInternal(this.skipApi as SkipApi, {
        heiti: input.shipName,
      })
      return response
    } catch (error) {
      await this.initialize(true)
      const response = await this.getShipsInternal(this.skipApi as SkipApi, {
        heiti: input.shipName,
      })
      return response
    }
  }

  async getShipsInternal(api: SkipApi, params: V1SkipHeitiHeitiGetRequest) {
    const response = await api.v1SkipHeitiHeitiGet(params)
    return (response ?? []).map((ship) => ({
      id: ship.skipaskraNumer,
      name: ship.heiti ?? '',
      shippingCompany: ship.utgerdarflokkur ?? '',
      shippingClass: ship.utgerd ?? '',
      homePort: ship.heimahofn ?? '',
    }))
  }
}
