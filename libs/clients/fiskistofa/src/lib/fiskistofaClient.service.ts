import { Inject, Injectable } from '@nestjs/common'
import {
  GetAflamarkInformationForShipInput,
  GetDeilistofnaInformationForShipInput,
  GetUpdatedAflamarkInformationForShipInput,
  GetUpdatedDeilistofnaInformationForShipInput,
} from '@island.is/api/domains/fiskistofa'
import {
  Configuration,
  StadaSkipsApi,
  StodtoflurApi,
  V1StadaskipsSkipnumerAlmannaksarArDeilistofnarBreyttPostRequest,
  V1StadaskipsSkipnumerAlmannaksarArDeilistofnarGetRequest,
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
  private shipApi: StadaSkipsApi | null = null
  private fishApi: StodtoflurApi | null = null

  constructor(
    @Inject(FiskistofaClientConfig.KEY)
    private clientConfig: ConfigType<typeof FiskistofaClientConfig>,
  ) {}

  private async initialize(ignoreCache: boolean = false) {
    if (this.shipApi && this.fishApi && !ignoreCache) {
      return
    }

    const shipApi = new StadaSkipsApi(
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
    const fishApi = new StodtoflurApi(
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

    this.shipApi = shipApi.withMiddleware(
      new AuthHeaderMiddleware(`Bearer ${access_token}`),
    )
    this.fishApi = fishApi.withMiddleware(
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
        breytingarFisktegundar: input.changes.categoryChanges.map(
          ({ catchChange, allowedCatchChange, id }) => ({
            aflabreyting: catchChange,
            aflamarksbreyting: allowedCatchChange,
            kvotategund: id,
          }),
        ),
      },
    }

    this.initialize()

    try {
      const response = await this.getUpdatedAflamarkInformationForShipInternal(
        this.shipApi as StadaSkipsApi,
        params,
      )
      return response
    } catch (error) {
      if (error instanceof FetchError) {
        await this.initialize(true)
        const response = await this.getUpdatedAflamarkInformationForShipInternal(
          this.shipApi as StadaSkipsApi,
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
        this.shipApi as StadaSkipsApi,
        params,
      )
      return response
    } catch (error) {
      await this.initialize(true)
      const response = this.getAflamarkInformationForShipInternal(
        this.shipApi as StadaSkipsApi,
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
    const params: V1StadaskipsSkipnumerAlmannaksarArDeilistofnarGetRequest = {
      ar: input.year,
      skipnumer: input.shipNumber,
    }

    await this.initialize()

    try {
      const response = await this.getDeilistofnaInformationForShipInternal(
        this.shipApi as StadaSkipsApi,
        params,
      )
      return response
    } catch (error) {
      await this.initialize(true)
      const response = this.getDeilistofnaInformationForShipInternal(
        this.shipApi as StadaSkipsApi,
        params,
      )
      return response
    }
  }

  private async getDeilistofnaInformationForShipInternal(
    api: StadaSkipsApi,
    params: V1StadaskipsSkipnumerAlmannaksarArDeilistofnarGetRequest,
  ) {
    const response = await api.v1StadaskipsSkipnumerAlmannaksarArDeilistofnarGet(
      params,
    )
    return mapChangedAllowedCatchForShip(response)
  }

  async getUpdatedDeilistofnaInformationForShip(
    input: GetUpdatedDeilistofnaInformationForShipInput,
  ) {
    const params: V1StadaskipsSkipnumerAlmannaksarArDeilistofnarBreyttPostRequest = {
      ar: input.year,
      skipnumer: input.shipNumber,
      aflamarkSkipsBreytingarDTO: {
        breytingarFisktegundar: input.changes.categoryChanges.map(
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
        this.shipApi as StadaSkipsApi,
        params,
      )
      return response
    } catch (error) {
      await this.initialize(true)
      const response = this.getUpdatedDeilistofnaInformationForShipInternal(
        this.shipApi as StadaSkipsApi,
        params,
      )
      return response
    }
  }

  private async getUpdatedDeilistofnaInformationForShipInternal(
    api: StadaSkipsApi,
    params: V1StadaskipsSkipnumerAlmannaksarArDeilistofnarBreyttPostRequest,
  ) {
    const response = await api.v1StadaskipsSkipnumerAlmannaksarArDeilistofnarBreyttPost(
      params,
    )
    return mapChangedAllowedCatchForShip(response)
  }

  async getAllFishes() {
    await this.initialize()
    try {
      const response = await this.getAllFishesInternal(
        this.fishApi as StodtoflurApi,
      )
      return response
    } catch (error) {
      await this.initialize(true)
      const response = await this.getAllFishesInternal(
        this.fishApi as StodtoflurApi,
      )
      return response
    }
  }

  private async getAllFishesInternal(api: StodtoflurApi) {
    const response = await api.v1StodtoflurFisktegundirGet()
    return mapFishes(response)
  }
}
